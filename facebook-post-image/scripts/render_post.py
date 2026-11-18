#!/usr/bin/env python3
"""Render a Facebook post image (main text centered, footer at bottom) via Playwright."""

import argparse
import sys
from pathlib import Path
from urllib.parse import quote

DEFAULT_FOOTER = "เพจ Dart แบบ Dart Dart"
TEMPLATE = Path(__file__).resolve().parent.parent / "templates" / "post.html"


def parse_size(value: str) -> tuple[int, int]:
    try:
        w, h = value.lower().split("x")
        return int(w), int(h)
    except ValueError:
        raise argparse.ArgumentTypeError(f"size must look like 1080x1080, got {value!r}")


def main() -> int:
    parser = argparse.ArgumentParser(description="Create a Facebook post image with Playwright.")
    parser.add_argument("--main", required=True, help="Main content text (centered)")
    parser.add_argument("--footer", default=DEFAULT_FOOTER, help="Footer text (bottom center)")
    parser.add_argument("--out", default="post.png", help="Output PNG path (default: post.png)")
    parser.add_argument("--size", type=parse_size, default=(1080, 1080),
                        help="Image size as WIDTHxHEIGHT (default: 1080x1080)")
    args = parser.parse_args()

    if not TEMPLATE.is_file():
        print(f"error: template not found: {TEMPLATE}", file=sys.stderr)
        return 1

    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("error: playwright is not installed.\n"
              "  pip install playwright && playwright install chromium", file=sys.stderr)
        return 1

    width, height = args.size
    url = TEMPLATE.as_uri() + "?main=" + quote(args.main) + "&footer=" + quote(args.footer)

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": width, "height": height},
                                device_scale_factor=2)
        page.goto(url)
        page.wait_for_load_state("networkidle")
        out = Path(args.out).resolve()
        out.parent.mkdir(parents=True, exist_ok=True)
        page.screenshot(path=str(out))
        browser.close()

    print(f"created: {out} ({width}x{height} @2x)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
