#!/usr/bin/env node
/**
 * render-cover.mjs — platform-independent blog cover generator (Node + Playwright).
 *
 * Renders an HTML/CSS template (dark gradient, accent stripe, wrapped blog TITLE,
 * footer) to a 1200x630 JPEG with headless Chromium. Works on Windows/macOS/Linux.
 *
 * Usage:
 *   node .agents/skills/render-cover-image/render-cover.mjs <slug> [options]
 *
 * Options:
 *   --title  "<text>"   Override the cover title (default: read from frontmatter)
 *   --out    <path>     Override output path (default: public/images/post/<slug>.jpg)
 *   --footer "<text>"   Override footer text (default: RedLineSoft Blog · Flutter 2026)
 *
 * The title defaults to the blog post's frontmatter `title:` — NOT the slug.
 */
import { chromium } from 'playwright';
import { readFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

// ---------- CLI args ----------
const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith('--'));
if (!slug) {
  console.error('Usage: node render-cover.mjs <slug> [--title "..."] [--out path] [--footer "..."]');
  process.exit(1);
}
const opt = (name, fallback = null) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};

// ---------- title: frontmatter first, --title override ----------
let title = opt('title');
if (!title) {
  try {
    const md = await readFile(`src/content/posts/${slug}.md`, 'utf8');
    const m = md.match(/^title:\s*(.+)$/m);
    if (m) title = m[1].trim().replace(/^["']|["']$/g, '');
  } catch {
    /* file missing — fall through to slug */
  }
}
if (!title) title = slug.replace(/-/g, ' ');

const out = opt('out', `public/images/post/${slug}.jpg`);
const footer = opt('footer', 'RedLineSoft Blog  ·  Flutter 2026');

// ---------- deterministic palette from slug (same slug -> same image) ----------
let hue = 0;
for (const c of slug) hue = (hue * 31 + c.charCodeAt(0)) % 360;

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// shrink font for long titles so they fit in ~3 lines
const size = title.length > 90 ? 36 : title.length > 60 ? 44 : title.length > 36 ? 52 : 60;

const html = `<!doctype html>
<html><head><meta charset="utf-8"><style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body {
    position: relative;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    background: linear-gradient(45deg,
      hsl(${hue}, 45%, ${14 + (hue % 8)}%) 0%,
      hsl(${(hue + 40) % 360}, 50%, ${26 + (hue % 10)}%) 55%,
      hsl(${(hue + 80) % 360}, 55%, ${8 + (hue % 6)}%) 100%);
  }
  .accent {
    position: absolute; left: 64px; top: 512px;
    width: 420px; height: 10px; border-radius: 5px;
    background: linear-gradient(90deg,
      hsl(${(hue + 180) % 360}, 85%, 62%),
      hsl(${(hue + 240) % 360}, 85%, 72%));
    box-shadow: 0 0 24px hsla(${(hue + 180) % 360}, 85%, 62%, .55);
  }
  .title {
    position: absolute; left: 64px; top: 96px; width: 1040px;
    font-size: ${size}px; font-weight: 800; line-height: 1.16;
    color: #fff; letter-spacing: -0.5px; text-wrap: balance;
    text-shadow: 0 4px 30px rgba(0,0,0,.45);
  }
  .footer {
    position: absolute; left: 66px; top: 548px;
    font-size: 20px; font-weight: 500; color: rgba(255,255,255,.72);
    letter-spacing: .6px;
  }
  .grid {
    position: absolute; inset: 0; opacity: .07;
    background-image: radial-gradient(rgba(255,255,255,.9) 1.5px, transparent 1.5px);
    background-size: 34px 34px;
  }
</style></head>
<body>
  <div class="grid"></div>
  <div class="title">${esc(title)}</div>
  <div class="accent"></div>
  <div class="footer">${esc(footer)}</div>
</body></html>`;

// ---------- render with Playwright ----------
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
const page = await ctx.newPage();
await page.setContent(html, { waitUntil: 'load' });
await mkdir(dirname(out), { recursive: true });
await page.screenshot({ path: out, type: 'jpeg', quality: 90 });
await browser.close();

const { stat } = await import('node:fs/promises');
const st = await stat(out);
console.log(`${out}  ${st.size} bytes  hue=${hue}  title="${title}"`);
if (st.size < 10240) {
  console.error('WARNING: output < 10 KB — quality gate may fail');
  process.exit(2);
}
