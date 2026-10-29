#!/usr/bin/env python3
"""Get the latest A-share macro fear & greed snapshot.

PUBLIC ENDPOINT — no API key required. This is the fastest way to answer
"how is the A-share market today?" without spending any quota.

Usage:
  python public_snapshot.py
"""

from __future__ import annotations

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from api_client import get, print_json


def main():
    data = get("/v1/public/feargreed/latest", auth=False)
    print_json(data)
    return 0


if __name__ == "__main__":
    sys.exit(main())
