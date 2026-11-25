---
name: search-blog-post
description: Searches and retrieves blog posts from https://blog.redlinesoft.net — use when the user asks to search, find, read, summarize, or cite posts from that site, mentions its llms.txt, wants raw Markdown sources, or needs post content/links from the Redlinesoft blog.
---

# Search Blog Post Skill

Search and retrieve posts from the live Redlinesoft blog (**https://blog.redlinesoft.net**) using its static endpoints, then pull raw Markdown sources for full-fidelity content. Works from anywhere — always uses the live site, never the local `src/content/posts/` files.

## Endpoints (all verified live)

| URL | What it gives you | Size / notes |
|---|---|---|
| `https://blog.redlinesoft.net/search.json` | Full post index: `[{title, description, slug, tags}]` | ~546 KB, 1478 entries. **Fetch once per session.** |
| `https://blog.redlinesoft.net/llms.txt` | One line per post: `[Title](html) — [Markdown source](md)` | Titles + both URL types, no tags/descriptions |
| `https://blog.redlinesoft.net/posts/<slug>.md` | Raw post: YAML frontmatter + markdown body | `text/markdown; charset=utf-8`, byte-identical to the repo source |
| `https://blog.redlinesoft.net/tags/<tag>` | HTML listing of every post with that tag | Tags are lowercase-hyphenated (`google-adk`) |
| `https://blog.redlinesoft.net/blog/<n>` | Paginated archive (HTML), 12 posts per page | |
| `https://blog.redlinesoft.net/sitemap-0.xml` | Every URL on the site | Last-resort discovery |

Post HTML pages live at `https://blog.redlinesoft.net/posts/<slug>` (no trailing slash needed).

## Workflow

1. **Rank with the helper script** (one command — fetch + score + print):

   ```bash
   node .agents/skills/search-blog-post/scripts/rank.mjs "ADK swarm multi-agent" --top 5
   ```

   - `--md` also fetches and prints the raw Markdown of the top hit
   - `--json` prints machine-readable `{query, results[], topMarkdown}` for further processing
   - Exit codes: `0` results, `2` no match, `3` network/index failure

2. **Or rank manually** if the script can't run: fetch `search.json` once, then score locally —
   title match (×10 per token) > tag match (×8 exact / ×4 partial) > description match (×3), plus a +50 bonus for an exact title phrase. Keep the top 3–5.

3. **Fetch raw content** for the posts you'll actually use:
   `GET https://blog.redlinesoft.net/posts/<slug>.md`
   - Frontmatter (`title`, `date`, `description`, `author`, `tags`, `image`) is part of the response — keep it, it's your citation metadata.
   - The body is the complete original markdown (code blocks, tables, headings intact) — use it verbatim for summarizing, quoting, or extracting sections.

4. **Cite results** with both URLs:
   - HTML: `https://blog.redlinesoft.net/posts/<slug>`
   - Markdown source: `https://blog.redlinesoft.net/posts/<slug>.md`

5. **Fetch only what you need** — do not download all 1478 posts. Ranking is metadata-only; pull `.md` files for the 1–3 posts you'll actually read.

## Fallback chain

1. `search.json` unreachable/failed → fetch `llms.txt` and match query tokens against the `Title` part of each line (no tags/descriptions, so expect coarser results).
2. Need everything on one topic → try `https://blog.redlinesoft.net/tags/<tag>` (guess tag from the query: lowercase, hyphenated).
3. Need a URL inventory → `sitemap-0.xml`.

Within one session, **cache both index fetches** (`search.json` ~546 KB, `llms.txt` ~150 KB) — never re-download them per query.

## Gotchas

- `.md` responses include the YAML frontmatter block (`--- ... ---`) — do not strip it; it carries title/date/tags.
- `search.json` has **no body text** — ranking can only use title/description/tags. If a content-level search is needed, fetch `.md` for a candidate shortlist and grep locally.
- Tags in `search.json` are lowercase-hyphenated; tag URLs must match exactly (`Machine Learning` → `/tags/Machine Learning` only if that's how the tag appears — prefer the tags listed in `search.json`).
- The site is static: no search API, no query parameters — all searching happens client-side after one index fetch.
- HTTP failures: the blog is behind Firebase Hosting; a `404` on a `.md` URL means the slug is wrong (check `llms.txt` for the exact slug), a `5xx`/timeout means retry later and fall back per the chain above.
