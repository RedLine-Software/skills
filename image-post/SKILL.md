---
name: facebook-post-image
description: Create a Facebook post image with Playwright. Renders two text items — a main content text centered in the middle and a footer text centered at the bottom — using a Google Sans + blue design system. Use when the user wants to generate a Facebook post image, share card, or quote graphic from provided main text and optional footer text (defaults to "เพจ Dart แบบ Dart Dart" when no footer is given).
---

# Facebook Post Image

Generate a 1080×1080 (configurable) Facebook post image by rendering an HTML
template in headless Chromium via Playwright and taking a screenshot.

## Inputs

| Input    | Required | Default                          | Notes                                  |
|----------|----------|----------------------------------|----------------------------------------|
| main     | yes      | —                                | Main content text, centered vertically & horizontally |
| footer   | no       | `เพจ Dart แบบ Dart Dart`         | Single line, centered at the bottom    |
| output   | no       | `post.png`                       | PNG path                               |
| size     | no       | `1080x1080`                      | `WIDTHxHEIGHT`                         |

If the user does not provide footer text, use the default footer exactly as
written above.

## Steps

1. Ensure Playwright is installed (see Troubleshooting if not).
2. Run the render script with the user's text:

   ```bash
   python scripts/render_post.py \
     --main "Your main content text here" \
     --footer "เพจ Dart แบบ Dart Dart" \
     --out post.png \
     --size 1080x1080
   ```

   `--footer` may be omitted to get the default footer.

3. Verify the PNG exists and open/read it to confirm the layout:
   - main text is centered (horizontally and vertically)
   - footer text is centered on the bottom edge with padding
   - Thai characters render correctly (no tofu boxes)
4. Return the file path to the user.

## Design System

Defined in `templates/post.html` as CSS custom properties:

| Token            | Value     | Usage                                   |
|------------------|-----------|-----------------------------------------|
| `--primary`      | `#1A73E8` | Google Blue 600 — background gradient   |
| `--primary-dark` | `#1557B0` | Gradient end / shadow tint              |
| `--on-primary`   | `#FFFFFF` | Main and footer text color              |
| `--font`         | Google Sans, fallbacks below | Brand typeface             |

Font stack: `'Google Sans', 'Product Sans', 'Noto Sans Thai', 'Noto Sans', sans-serif`
— Google Sans is used when available on the system/browser; `Noto Sans Thai`
guarantees correct Thai rendering for the default footer.

To change the look, edit the `:root` variables in `templates/post.html`.
Other primary swatches: Google Red `#EA4335`, Yellow `#FBBC04`, Green `#34A853`.

## Layout Rules

- Main content: `display: flex; align-items: center; justify-content: center;`
  across the full card, `text-align: center`, sized fluidly (clamp) so long
  text wraps and scales down without overflowing.
- Footer: absolutely positioned at the bottom, `text-align: center`, with
  equal horizontal padding and a bottom safe-area margin.

## Custom Size

Pass `--size 1200x630` for a link-share image, `1080x1920` for a story, etc.
The layout adapts fluidly; only the screenshot viewport changes.

## Troubleshooting

- `playwright` not installed → `pip install playwright && playwright install chromium`
- Font looks wrong → Google Sans is not on Google Fonts; the template falls
  back to Noto Sans Thai/Noto Sans. If the user has Google Sans installed
  locally it will be picked up automatically.
- Text overflow → shorten the main text or lower the `clamp()` font sizes in
  the template's `.main` rule.
- Verify output: check the PNG dimensions match the requested `--size`.
