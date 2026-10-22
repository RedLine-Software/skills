# Skills

A collection of AI agent skills for the [Skills CLI](https://skills.sh/) ecosystem (`npx skills`). Each skill is a self-contained module that extends an AI agent's capabilities with specialized knowledge, workflows, and tools.

## Skills Overview

| Skill | Description | Language |
|---|---|---|
| [arxiv-search](arxiv-search/) | Search academic papers on arXiv via Atom XML API | Python |
| [blockframe-video](blockframe-video/) | Produce vertical BlockFrame knowledge shorts with HyperFrames (brief → storyboard → render) | Node.js |
| [blog-search](blog-search/) | Search and retrieve blog posts from blog.redlinesoft.net | Python |
| [book-mockup](book-mockup/) | Generate 3D book mockup images from a flat cover via Google Gemini | Python |
| [book-sales-api](book-sales-api/) | Query internal Book and Sales REST API | curl |
| [calculator](calculator/) | Math expression evaluator | Python |
| [claude-code-docs](claude-code-docs/) | Comprehensive Claude Code documentation and reference | Markdown |
| [create-blog-post](create-blog-post/) | Automate Astro blog post creation with frontmatter | Workflow |
| [create-slide](create-slide/) | Generate reveal.js presentations with Chart.js | Node.js |
| [find-skills](find-skills/) | Discover and install skills from the open skills ecosystem | Workflow |
| [little-girl-today](little-girl-today/) | Fetch daily staff schedules from mosl9.com | Workflow |
| [mermaid-figures](mermaid-figures/) | Render Mermaid diagram sources to PNG figures embedded in book chapters | Node.js |
| [mintlify](mintlify/) | Best practices for building Mintlify documentation sites | Markdown |
| [quick-chart](quick-chart/) | Generate charts and QR codes via QuickChart.io API | Python |
| [roll-dice](roll-dice/) | Roll dice of configurable size and quantity | Python |
| [technical-book-writer](technical-book-writer/) | Writing style guide for Thai-language technical books | Markdown |
| [uikits](uikits/) | Browse and scaffold Flutter UI component templates | Node.js |

## Project Structure

```
skills/
├── LICENSE                     # MIT License
├── arxiv-search/
│   └── scripts/search_arxiv.py
├── blockframe-video/
│   ├── references/             # Design system, pipeline, media & scene contract docs
│   └── scripts/                # fetch-fonts.mjs, loop-bgm.mjs
├── blog-search/
│   └── scripts/fetch_llm_index.py
├── book-mockup/
│   └── scripts/generate_mockup.py
├── book-sales-api/
│   └── references/api-spec.json
├── calculator/
│   └── scripts/calculate.py
├── claude-code-docs/
│   └── references/             # 18 reference docs
├── create-blog-post/
├── create-slide/
│   ├── scripts/generate_presentation.cjs
│   ├── references/template.html
│   └── assets/sample_presentation.json
├── find-skills/
├── little-girl-today/
├── mermaid-figures/
│   ├── references/mermaid-config.json
│   └── scripts/                # extract, render, analyze, verify figures
├── mintlify/
├── quick-chart/
│   ├── scripts/chart_gen.py
│   └── scripts/qr_gen.py
├── roll-dice/
│   └── scripts/roll_dice.py
├── technical-book-writer/
└── uikits/
    ├── scripts/list_templates.cjs
    └── scripts/get_template.cjs
```

## Skill Categories

- **Search & Retrieval** — arxiv-search, blog-search, book-sales-api, find-skills
- **Content Creation** — create-blog-post, create-slide, book-mockup, technical-book-writer, mermaid-figures, blockframe-video
- **Reference Documentation** — claude-code-docs, mintlify, technical-book-writer
- **Utilities** — calculator, roll-dice, quick-chart
- **Scaffolding & Templates** — uikits

## Skill Anatomy

Each skill follows a consistent structure:

```
skill-name/
├── SKILL.md          # Skill manifest (YAML frontmatter + instructions)
├── scripts/          # Optional executable scripts
├── references/       # Optional reference documentation
└── assets/           # Optional templates or sample data
```

The `SKILL.md` file is the single source of truth — it serves as both the skill manifest and the instruction manual for AI agents. It contains YAML frontmatter with metadata (`name`, `description`, `version`, `author`, `category`, `license`) followed by the skill's workflow instructions.

## Usage

Install the [Skills CLI](https://skills.sh/) and add skills to your agent:

```bash
# Install skills CLI
npx skills

# Search for available skills
npx skills find [query]

# Add a skill
npx skills add <package>
```

For local development, copy a skill directory into your agent's skills folder and reference it in your agent's configuration.

## Requirements

- **Python** — Used by most scripts. Standard library only for most skills.
- **Node.js** — Required by create-slide, uikits, blockframe-video, and mermaid-figures.
- **HyperFrames CLI** — blockframe-video renders through `npx hyperframes`.
- **mermaid-cli** — mermaid-figures requires a global install of `@mermaid-js/mermaid-cli`.
- Some skills require API keys:
  - `book-mockup` requires `GOOGLE_API_KEY`
  - `blockframe-video` requires `GEMINI_API_KEY` for Thai narration (Gemini TTS; Kokoro has no Thai)
  - `book-sales-api` requires network access to `192.168.1.36:8000`

## License

[MIT](LICENSE) — Copyright (c) 2026 Anuchit Chalothorn
