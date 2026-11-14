---
name: render-cover-image
description: Renders a deterministic 1200x630 blog cover image with Playwright headless Chromium (platform-independent: Windows/macOS/Linux), using the blog post title from frontmatter as the cover title. Use when picsum.photos is unreachable, when an offline/seed-stable cover is needed, or when a title-on-gradient cover is required. Generates public/images/post/<slug>.jpg to match blog frontmatter.
---

# Render Cover Image Skill

Generates blog cover images **locally** (no network) as an alternative or fallback to downloading from picsum.photos. Use this when:

- `picsum.photos` is down or unreachable (returns 522 / times out),
- you need deterministic, reproducible covers (same slug → same image, forever),
- you want a branded cover that displays the **blog post title** (read from frontmatter, not the slug).

## Output contract

| Item | Value |
| --- | --- |
| Size | 1200x630 px (matches existing `public/images/post/` covers) |
| Format | JPEG (quality 90) |
| Path | `public/images/post/<slug>.jpg` |
| Frontmatter | `image: "https://blog.redlinesoft.net/images/post/<slug>.jpg"` |
| Cover title | The post's frontmatter `title:` (auto-read from `src/content/posts/<slug>.md`) |
| Min size | > 10 KB (quality gate used by post verification) |

## Method 1 (preferred): Playwright — platform-independent

Renders an HTML/CSS template (dark gradient, dot grid, accent stripe, wrapped title, footer) to a screenshot with headless Chromium. Works identically on Windows, macOS, and Linux.

### One-time setup

```bash
npm install -D playwright          # package (already a devDependency of this project)
npx playwright install chromium    # one-time ~123 MB browser download
```

### Usage

```bash
# title auto-read from src/content/posts/<slug>.md frontmatter
node .agents/skills/render-cover-image/render-cover.mjs <slug>

# overrides
node .agents/skills/render-cover-image/render-cover.mjs <slug> \
  --title "Custom Cover Title" \
  --out public/images/post/<slug>.jpg \
  --footer "RedLineSoft Blog  ·  AI Agents 2026"
```

Example output:

```
public/images/post/fcm-message-handling-flutter.jpg  60024 bytes  hue=7  title="Firebase Messaging in Flutter: Handling Messages in Every App State"
```

### How it works

- **Title**: read from the post's frontmatter `title:` line — never the slug. HTML-escaped; font auto-shrinks (60 → 52 → 44 → 36 px) so titles up to ~120 chars fit in 3 lines.
- **Palette**: hue = string hash of the slug (`hash * 31 + charCode % 360`), so re-running always reproduces the same image — safe to regenerate without churn.
- **Layout**: 45° hue-shifted dark gradient + subtle dot grid + glowing accent stripe at y=512 + footer at y=548; system font stack (`system-ui, Segoe UI, Roboto, ...`) so no fonts need installing on any OS.
- **Render**: `chromium.launch()` → `viewport 1200x630`, `deviceScaleFactor 1` → `page.screenshot({ type: 'jpeg', quality: 90 })`.
- The script exits with code 2 and prints a warning if the output is under 10 KB.

## Method 2 (fallback): PowerShell + Windows only

When Node/Playwright isn't available and you're on Windows — no browser or network needed:

```powershell
param([string]$slug, [string]$title)
Add-Type -AssemblyName System.Drawing
if (-not $title) { $title = (Get-Content "src/content/posts/$slug.md" | Select-String '^title:').Line -replace '^title:\s*','' -replace '^["'']|["'']$','' }
$hash = 0; foreach ($c in $slug.ToCharArray()) { $hash = (($hash * 31) + [int]$c) % 360 }; $hue = $hash
$bmp = New-Object System.Drawing.Bitmap(1200, 630)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$rect = New-Object System.Drawing.Rectangle(0, 0, 1200, 630)
$brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect,
  [System.Drawing.Color]::FromArgb(255, [int](20 + ($hue % 80)), [int](24 + ($hue % 40)), [int](48 + ($hue % 70))),
  [System.Drawing.Color]::FromArgb(255, [int](8 + ($hue % 30)), [int](10 + ($hue % 24)), [int](20 + ($hue % 40))), 45)
$g.FillRectangle($brush, 0, 0, 1200, 630)
$pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(220, [int](120 + ($hue % 100)), [int](80 + ($hue % 120)), [int](200 - ($hue % 80))), 10)
$g.DrawLine($pen, 60, 520, 460, 520)
$font = New-Object System.Drawing.Font('Segoe UI', 34, [System.Drawing.FontStyle]::Bold)
$fontSmall = New-Object System.Drawing.Font('Segoe UI', 18, [System.Drawing.FontStyle]::Regular)
$words = ($title -replace '-', ' ') -split ' '; $lines = @(); $cur = ''
foreach ($wd in $words) { if (($cur + ' ' + $wd).Trim().Length -gt 24 -and $cur -ne '') { $lines += $cur; $cur = $wd } else { $cur = ($cur + ' ' + $wd).Trim() } }
if ($cur) { $lines += $cur }
$y = 140; foreach ($line in $lines) { $g.DrawString($line, $font, [System.Drawing.Brushes]::White, 60, $y); $y += 52 }
$g.DrawString('RedLineSoft Blog  ·  Flutter 2026', $fontSmall, (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(180, 255, 255, 255))), 62, 545)
$g.Dispose()
$dest = "public/images/post/$slug.jpg"; $bmp.Save($dest, [System.Drawing.Imaging.ImageFormat]::Jpeg); $bmp.Dispose()
Write-Output "$slug.jpg  $((Get-Item $dest).Length) bytes  hue=$hue"
```

Note: `System.Drawing` text metrics differ slightly from Chromium's, so line wrapping may vary between methods — the Playwright render is authoritative.

## Notes

- **Preferred source when online**: `Invoke-WebRequest -Uri "https://picsum.photos/seed/<slug>/1200/630" -OutFile "public/images/post/<slug>.jpg"` (seeded = deterministic too). Use this skill when that fails. For batch fallback without generation, see the random-pool method in the `create-blog-post` skill.
- **Footer text**: change the `--footer` default (`RedLineSoft Blog  ·  Flutter 2026`) to match the current content series.
- **Batch rendering**: loop over slugs — `foreach ($s in $slugs) { node .agents/skills/render-cover-image/render-cover.mjs $s }`.
- **Verify after render**: file exists, > 10 KB, `1200x630`, and frontmatter `image:` URL basename equals `<slug>.jpg`. Then `npm run build` to refresh `dist/`.
- No internet access needed after the one-time browser install; no NuGet/Python packages required.
