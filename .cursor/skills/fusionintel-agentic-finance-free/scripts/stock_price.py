#!/usr/bin/env python3
"""Get A-share basic price data (OHLC + 涨停跌停价).

Free tier: returns the most recent 30 trading days only (period=30d).
Pro+ users can pass period=180d/1y/3y/5y but the call will 403 on free keys.

Usage:
  python stock_price.py <code> [period] [--summary]
  python stock_price.py 000001.SZ
  python stock_price.py 600519.SH 30d --summary
"""

from __future__ import annotations

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from api_client import get, print_json, quote_path_segment, summarize_table


def main():
    args = [a for a in sys.argv[1:] if a != "--summary"]
    summary = "--summary" in sys.argv
    if not args:
        print(
            "Usage: stock_price.py <code> [period] [--summary]\n"
            "  code: A 股代码 e.g. 000001.SZ (Shenzhen) or 600519.SH (Shanghai)\n"
            "  period: 30d (free, default), 180d / 1y / 3y / 5y (Pro/Pro+)",
            file=sys.stderr,
        )
        return 2

    code = quote_path_segment(args[0])
    period = args[1] if len(args) > 1 else "30d"
    data = get(f"/v1/stock/{code}", params={"period": period})
    print_json(summarize_table(data) if summary else data)
    return 0


if __name__ == "__main__":
    sys.exit(main())
