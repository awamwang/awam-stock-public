#!/usr/bin/env python3
"""Get A-share macro fear & greed index (抄底逃顶指数).

Free tier supports period: latest, 7d, 30d.
Pro can go to 1y; Pro+ to all-history.

Usage:
  python macro_feargreed.py [period] [--summary]
  python macro_feargreed.py latest
  python macro_feargreed.py 30d --summary
"""

from __future__ import annotations

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from api_client import get, print_json, summarize_table

CODE = "shi_feargreedindex"  # the only macro instrument code today


def main():
    args = [a for a in sys.argv[1:] if a != "--summary"]
    summary = "--summary" in sys.argv
    period = args[0] if args else "30d"

    if period not in {"latest", "7d", "30d"}:
        print(
            f"Warning: free tier does not support period={period}. "
            "Allowed on free: latest, 7d, 30d. Calling anyway — will likely 403.",
            file=sys.stderr,
        )

    data = get(f"/v1/feargreed/a_stock_macro/{CODE}", params={"period": period})
    print_json(summarize_table(data) if summary else data)
    return 0


if __name__ == "__main__":
    sys.exit(main())
