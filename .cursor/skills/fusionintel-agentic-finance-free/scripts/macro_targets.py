#!/usr/bin/env python3
"""List A-share macro fear & greed instruments.

The macro category currently has exactly one code: `shi_feargreedindex`
(上证恐贪指数). Backend has no /list endpoint for single-code categories,
so this script returns the constant directly without an HTTP call.

Same applies to `hk_stock_macro` → `hsi_feargreedindex`(恒指恐贪指数,Pro+).

Usage:
  python macro_targets.py
"""

from __future__ import annotations

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from api_client import print_json

_MACRO_TARGETS = {
    "metadata": {
        "category": "a_stock_macro",
        "category_name": "A股宏观恐贪指数",
        "count": 1,
        "note": "Single-code category — no backend /list endpoint; codes hard-coded here.",
    },
    "data": [
        {"code": "shi_feargreedindex", "name": "上证恐贪指数"},
    ],
}


def main():
    print_json(_MACRO_TARGETS)
    return 0


if __name__ == "__main__":
    sys.exit(main())
