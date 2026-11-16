---
name: book-promo-image-post
description: Create a Facebook book-promo post image with Playwright. Renders a user-provided book cover centered with a drop shadow falling to the bottom-left, on a random background color chosen to contrast clearly with the cover, with an uppercase "NEW RELEASE" line pinned to the top center and an "E-book available" line pinned to the bottom center, in a Google Sans design system. Use when the user wants a promotional / new-release share image for an e-book or book from a cover image they provide.
---

# Book Promo Post Image

Generate a 1080×1080 (configurable) Facebook promo image for a book release by
rendering an HTML template in headless Chromium via Playwright and taking a
screenshot.

Result: the cover image sits exactly in the center with a drop shadow that
falls to the **bottom-left**; `NEW RELEASE` is centered on the top edge and
`E-book available` is centered on the bottom edge; the background color is
random but always chosen so the cover stays clearly visible.

## Inputs

| Input    | Required | Default               | Notes                                              |
|----------|----------|-----------------------|----------------------------------------------------|
| cover    | yes      | —                     | Path to the cover image (png/jpg), user-provided   |
| footer1  | no       | `NEW RELEASE`         | Pinned to the top edge, centered, uppercase       |
| footer2  | no       | `E-book available`    | Pinned to the bottom edge, centered               |
| bg       | no       | random, contrast-based| Fixed hex (e.g. `1A73E8`) to skip randomization    |
| output   | no       | `promo.png`           | PNG path                                           |
| size     | no       | `1080x1080`           | `WIDTHxHEIGHT`                                     |

## Steps

1. Get the cover image path from the user (this directory ships `cover.png`
   as a sample).
2. Ensure Playwright is installed (see Troubleshooting if not).
3. Run the render script:

   ```bash
   python scripts/render_promo.py \
     --cover path/to/cover.png \
     --out promo.png \
     --size 1080x1080
   ```

   Optional: `--footer1 "NEW RELEASE"`, `--footer2 "E-book available"`,
   `--bg 1A73E8`.

4. Verify the PNG (read/open it) and confirm:
   - cover is centered and unobscured, with its shadow falling bottom-left
   - background clearly contrasts with the cover (light cover → deep color,
     dark cover → light color)
   - `NEW RELEASE` is centered on the top edge, `E-book available` on the
     bottom edge
   - Google Sans-style text renders cleanly (no tofu boxes for Thai/emoji)
5. Return the file path to the user.

## Design System

Defined in `templates/promo.html` as CSS custom properties:

| Token            | Value                              | Usage                              |
|------------------|------------------------------------|------------------------------------|
| `--font`         | Google Sans, Product Sans, fallbacks | Brand typeface                   |
| `--bg`           | random per run                     | Background color, set at runtime   |
| `--on-bg`        | white or `#202124`                 | Footer text, derived from `--bg`   |
| `--cover-shadow` | `-18px 26px 34px rgba(0,0,0,.45)`  | Drop shadow toward **bottom-left** |

Font stack: `'Google Sans', 'Product Sans', 'Google Sans Text', 'Noto Sans',
'Segoe UI', Roboto, sans-serif` — Google Sans is picked up when installed
locally; otherwise the closest system UI font is used.

### Background color algorithm (in the template)

- The cover's average color is sampled on a 48×48 canvas.
- Light/neutral covers (relative luminance ≥ 0.30) get a **deep** background
  (HSL lightness 0.14–0.24, saturation 0.55–0.80) → white text.
- Dark covers get a **light** background (HSL lightness 0.86–0.94) → dark text.
- Colorful covers push the hue 160–200° away from the cover's hue (near
  complement) so cover and background never blend together.
- The hue is otherwise random, so every run looks different.
- Pass `--bg <hex>` to pin the color instead.

## Layout Rules

- Cover: flex-centered on the full canvas, `max-width: 88%`, `max-height: 70%`,
  aspect ratio preserved, `filter: drop-shadow(-18px 26px 34px …)` — negative X
  + positive Y means the shadow lands at the bottom-left.
- Text lines: `.footers` is a full-canvas overlay (`inset: 0`,
  `text-align: center`). `.footer-1` (bold, letterspaced, uppercase,
  `clamp(36px, 4.6vw, 72px)`) is absolutely positioned at `top: 7%`;
  `.footer-2` (`clamp(20px, 2.9vw, 36px)`) at `bottom: 5%`. `text-indent`
  equal to `letter-spacing` keeps the letterspaced top line optically centered.
- Cover is capped at 70% height so it never collides with either text line.

## Custom Size

Pass `--size 1200x630` for a link-share image, `1080x1920` for a story, etc.
The layout adapts fluidly; only the screenshot viewport changes.

## Troubleshooting

- `playwright` not installed → `pip install playwright && playwright install chromium`
- `error: failed to load cover image` → check the `--cover` path (it is
  resolved to a `file://` URI, so relative paths must exist at run time).
- Background stayed dark grey → the canvas could not read the cover pixels;
  Chromium was likely launched without `--allow-file-access-from-files`
  (the script passes it by default).
- Cover looks too small → raise `max-height` / `max-width` in the `.cover`
  rule of `templates/promo.html`, or shorten the footer lines.
- Shadow on the wrong side → keep X negative and Y positive in
  `--cover-shadow`.
- Verify output: PNG exists and dimensions match `--size` (×2 device scale).
