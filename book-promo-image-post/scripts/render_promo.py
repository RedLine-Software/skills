#!/usr/bin/env python3
"""Render a book-promo Facebook post image via Playwright.

Layout: cover image centered with a drop shadow falling to the bottom-left,
plus two footer lines centered at the bottom ("NEW RELEASE" / "E-book available"),
on a random high-contrast background color with the Google Sans design system.
"""

import argparse
import sys
from pathlib import Path
from urllib.parse import quote

DEFAULT_FOOTER_1 = "NEW RELEASE"
DEFAULT_FOOTER_2 = "E-book available"
TEMPLATE = Path(__file__).resolve().parent.parent / "templates" / "promo.html"


def parse_size(value: str) -> tuple[int, int]:
    try:
        w, h = value.lower().split("x")
        return int(w), int(h)
    except ValueError:
        raise argparse.ArgumentTypeError(f"size must look like 1080x1080, got {value!r}")


def main() -> int:
    parser = argparse.ArgumentParser(description="Create a book promo Facebook post image with Playwright.")
    parser.add_argument("--cover", required=True, help="Path to the book cover image (png/jpg)")
    parser.add_argument("--footer1", default=DEFAULT_FOOTER_1,
                        help=f"Top footer line (default: {DEFAULT_FOOTER_1!r})")
    parser.add_argument("--footer2", default=DEFAULT_FOOTER_2,
                        help=f"Bottom footer line (default: {DEFAULT_FOOTER_2!r})")
    parser.add_argument("--bg", default=None,
                        help="Fixed background color as hex (e.g. 1A73E8 or #1A73E8); "
                             "omit to pick a random color that contrasts with the cover")
    parser.add_argument("--out", default="promo.png", help="Output PNG path (default: promo.png)")
    parser.add_argument("--size", type=parse_size, default=(1080, 1080),
                        help="Image size as WIDTHxHEIGHT (default: 1080x1080)")
    args = parser.parse_args()

    cover = Path(args.cover)
    if not cover.is_file():
        print(f"error: cover image not found: {cover}", file=sys.stderr)
        return 1
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
    params = {
        "cover": cover.resolve().as_uri(),
        "footer1": args.footer1,
        "footer2": args.footer2,
    }
    if args.bg:
        params["bg"] = args.bg
    url = TEMPLATE.as_uri() + "?" + "&".join(
        f"{key}={quote(str(value))}" for key, value in params.items()
    )

    with sync_playwright() as p:
        # --allow-file-access-from-files lets the page read cover pixels
        # (average color) for the contrast-checked background choice.
        browser = p.chromium.launch(args=["--allow-file-access-from-files"])
        page = browser.new_page(viewport={"width": width, "height": height},
                                device_scale_factor=2)
        page.goto(url)
        try:
            page.wait_for_function("window.__ready === true", timeout=15000)
        except Exception:
            browser.close()
            print("error: template never became ready (cover failed to load?)", file=sys.stderr)
            return 1

        error = page.evaluate("window.__error || null")
        if error:
            browser.close()
            print(f"error: {error}", file=sys.stderr)
            return 1

        bg = page.evaluate("window.__bg || 'n/a'")
        out = Path(args.out).resolve()
        out.parent.mkdir(parents=True, exist_ok=True)
        page.screenshot(path=str(out))
        browser.close()

    print(f"created: {out} ({width}x{height} @2x, background={bg})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
