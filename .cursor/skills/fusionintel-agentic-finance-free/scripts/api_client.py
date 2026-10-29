#!/usr/bin/env python3
"""Shared HTTP helper for the Agentic Finance Free Skill.

Stdlib-only — no `requests` / `httpx` dependency, so the skill runs on any
host (OpenClaw gateway, WorkBuddy, vanilla Python 3.7+) without an extra
`pip install` step.

Reads two environment variables:
  FUSIONINTEL_API_KEY   (sk_xxx, optional for public endpoint)
  FUSIONINTEL_API_URL   (default: https://api.fusionintel.net)

Legacy aliases (still accepted so existing configs keep working):
  AGENTIC_FINANCE_API_KEY / AGENTIC_FINANCE_API_URL
  SENTIMENT_API_KEY     / SENTIMENT_API_URL
"""

from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request

DEFAULT_BASE = "https://api.fusionintel.net"


def _base_url() -> str:
    # Preferred:        FUSIONINTEL_API_URL
    # Legacy fallback:  AGENTIC_FINANCE_API_URL / SENTIMENT_API_URL
    # (kept so users who set env vars under the older skill version keep working)
    raw = (
        os.environ.get("FUSIONINTEL_API_URL")
        or os.environ.get("AGENTIC_FINANCE_API_URL")
        or os.environ.get("SENTIMENT_API_URL")
        or DEFAULT_BASE
    )
    return raw.rstrip("/")


def _api_key():
    return (
        os.environ.get("FUSIONINTEL_API_KEY")
        or os.environ.get("AGENTIC_FINANCE_API_KEY")
        or os.environ.get("SENTIMENT_API_KEY")
    )


def quote_path_segment(value):
    """Percent-encode a single URL path segment.

    Defense in depth: the backend validates `code` against a strict regex,
    but we should never pass user-supplied values through f-strings without
    encoding. Special characters in stock codes (`.`) are kept readable via
    `safe='.'`.
    """
    return urllib.parse.quote(str(value), safe=".")


def get(path, params=None, auth=True, timeout=15):
    """GET <base>+path with optional X-API-Key auth.

    Returns the parsed JSON dict. On HTTP / network error, prints a helpful
    message to stderr and exits with a non-zero code so the calling LLM can
    see exactly what went wrong.
    """
    base = _base_url()
    url = f"{base}{path}"

    if params:
        filtered = {k: v for k, v in params.items() if v is not None}
        if filtered:
            url = f"{url}?{urllib.parse.urlencode(filtered)}"

    headers = {
        "Accept": "application/json",
        "User-Agent": "agentic-finance-skill-free/1.0",
    }
    if auth:
        key = _api_key()
        if not key:
            print(
                "ERROR: FUSIONINTEL_API_KEY env var is required for this endpoint.\n"
                "       Get a free key at https://www.fusionintel.net/register\n"
                "错误:此端点需要设置 FUSIONINTEL_API_KEY 环境变量。\n"
                "       免费注册:https://www.fusionintel.net/register",
                file=sys.stderr,
            )
            sys.exit(2)
        headers["X-API-Key"] = key

    req = urllib.request.Request(url, headers=headers, method="GET")
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        try:
            detail = json.loads(body).get("detail", body)
        except Exception:
            detail = body
        msg = f"API error {e.code}: {detail}"
        if e.code == 403:
            msg += (
                "\nHint: Free plan cannot access this endpoint or period range."
                " Upgrade to Pro / Pro+, or try a smaller period."
                "\n提示:Free 套餐无法访问该端点或 period 范围。升级 Pro/Pro+ 或换更小的 period。"
            )
        elif e.code == 429:
            msg += (
                "\nHint: Free daily quota (100/day) exhausted; resets at UTC 00:00."
                "\n提示:今日免费额度已用完(100次/天),UTC 0 点重置。"
            )
        elif e.code == 401:
            msg += (
                "\nHint: Check that FUSIONINTEL_API_KEY is set correctly."
                "\n提示:检查 FUSIONINTEL_API_KEY 是否正确。"
            )
        print(msg, file=sys.stderr)
        sys.exit(1)
    except urllib.error.URLError as e:
        print(f"Network error: {e.reason}", file=sys.stderr)
        sys.exit(1)


def print_json(data):
    """Pretty-print Chinese-friendly JSON to stdout.

    Forces UTF-8 on stdout so Chinese labels (乐观 / 悲观 / 中性) render
    correctly even when the host shell is cp936 / cp1252 (common on Windows).
    """
    try:
        sys.stdout.reconfigure(encoding="utf-8")  # py3.7+
    except Exception:
        pass
    print(json.dumps(data, ensure_ascii=False, indent=2))


def summarize_table(payload, last_n=5):
    """Compact a TablePayload {metadata, data: [[...rows]]} into a small dict.

    Useful when the LLM only needs recent values + simple stats.
    """
    if not isinstance(payload, dict):
        return payload
    meta = payload.get("metadata") or {}
    rows = payload.get("data") or []
    columns = meta.get("columns") or []
    fg_idx = -1
    for i, col in enumerate(columns):
        if isinstance(col, str) and "feargreed" in col.lower():
            fg_idx = i
            break

    stats = {}
    if fg_idx >= 0 and rows:
        values = []
        for row in rows:
            if isinstance(row, list) and len(row) > fg_idx:
                v = row[fg_idx]
                if isinstance(v, (int, float)):
                    values.append(v)
        if values:
            stats = {
                "feargreed_min": min(values),
                "feargreed_max": max(values),
                "feargreed_avg": round(sum(values) / len(values), 2),
                "feargreed_latest": values[-1],
            }

    return {
        "metadata": meta,
        "summary": {"total_rows": len(rows), "shown_rows": min(last_n, len(rows)), **stats},
        "recent": rows[-last_n:] if rows else [],
    }
