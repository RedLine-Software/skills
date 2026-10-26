---
name: book-promo-writer
description: Write promotional copy for a book — the Google Play Books book description (คำโปรยนำ / back-cover copy) and social-network launch posts (Facebook, X, LinkedIn, Instagram). Use when asked to write or revise a book description, promo blurb, launch announcement, or to fill sections 1-2 of sale.md.
version: "1.0.0"
license: MIT
compatibility: No runtime dependencies; reads toc.md, chapters/, epub.yaml, and writes sale.md
tags: [marketing, copywriting, google-play-books, social-media, ebook, thai]
triggers: ["sale.md", "คำโปรย", "book description", "promo", "social network", "blurb"]
---

# Book Promo Writer

This skill produces the two promotional artifacts every book needs before it goes on sale:

| # | Artifact | Destination |
|---|----------|-------------|
| 1 | **Google Play Books description** — the back-cover copy shown on the store page | `sale.md` → `## 1. คำโปรยนำสำหรับ Google Play Books (Book Description)` |
| 2 | **Social network posts** — launch posts for Facebook / X / LinkedIn / Instagram | `sale.md` → `## 2. คำโปรยสำหรับ Social Network (Facebook / X / LinkedIn)` |

Promo copy is **selling writing**, not book prose. It may carry more energy than the chapters, but every factual claim still has to come from the project itself.

---

## 1. Gather Inputs First

Never write from the title alone. Collect these before drafting:

| Input | Where it lives |
|---|---|
| Title, subtitle, author, language | `epub.yaml` |
| Chapter list + per-chapter bullets | `toc.md` |
| Page count, format facts | `sale.md` (existing), `build/` output |
| Target reader | `AGENTS.md` → "Target reader" |
| Price + store link | `sale.md` section 4 (from the `play-books-pricing` skill) |
| Previous promo copy | `sale.md` sections 1-2 |

If a fact is not in the project (page count, price, link, tool list), **do not invent it** — leave an explicit placeholder such as `[ใส่ลิงก์ Google Play Books ตรงนี้]`.

---

## 2. Rules That Must Not Be Broken

1. **Facts come from the project.** Every feature, chapter topic, page count, and price must be traceable to `toc.md`, `chapters/`, `epub.yaml`, or `sale.md`.
2. **Thai is the selling language; English stays for technical terms** (`README`, `GFM`, `Mermaid`, `Marp`, `Docs-as-Code`, ...) — same convention as the book itself.
3. **The first line must stand alone.** Store pages and social feeds truncate; the hook has to sell by itself before anything is expanded.
4. **No Markdown syntax in the Play Books description.** The Partner Center description field is plain text — no `#`, no `**bold**`, no rendered links. Use line breaks and simple `*` bullets as literal characters.
5. **No invented claims.** Do not add "รีวิว 5 ดาว", "ติดอันดับ", sales figures, or endorsements that do not exist.
6. **One promise per post.** Say what the reader gets, not five unrelated things.
7. **Placeholders stay visible.** Links, prices, and dates that are not final are written as `[...]` so they are impossible to miss.

---

## 3. Deliverable A — Google Play Books Description

Google's `Description` metadata field is plain "back-cover copy"; the Partner Center documentation does not publish a hard character limit, so aim for **500-1,200 characters of Thai text** — long enough to convert, short enough to read on a phone.

### Anatomy

```text
Hook (1-2 sentences, no setup)      ← must work alone when truncated
        ↓
What it is + the problem it solves
        ↓
"What you will learn" — 3-5 bullets
        ↓
Who it is for
        ↓
Closing line + store/CTA note
```

### Template

```text
<ชื่อหนังสือ> คือ <หนึ่งประโยคบอกประโยชน์หลัก> เหมาะกับ <กลุ่มผู้อ่าน> ที่ต้องการ <ผลลัพธ์>

ในยุคที่ <บริบท/ปัญหาของผู้อ่าน> การ <พฤติกรรมที่ต้องการ> กลายเป็นทักษะที่จำเป็น หนังสือความยาว <N> หน้าเล่มนี้พาคุณจากพื้นฐาน สู่การประยุกต์ใช้ระดับมืออาชีพ ครอบคลุม <หัวข้อเด่น 3-4 หัวข้อจาก toc.md>

สิ่งที่คุณจะได้เรียนรู้:
* <หัวข้อที่ 1 — ระบุตัวอย่างที่จับต้องได้>
* <หัวข้อที่ 2>
* <หัวข้อที่ 3>
* <หัวข้อที่ 4>

เหมาะสำหรับ <อาชีพ/กลุ่มอ่าน> ที่ต้องการยกระดับ <ผลลัพธ์> ให้อ่านง่าย ทำงานร่วมกันได้ และใช้ได้จริงในโปรเจกต์จริง
```

### Style

- Benefit first, feature second: "`อ่านจบและใช้งานได้ทันทีในโปรเจกต์จริง`" beats "ครอบคลุมเนื้อหา 10 บท".
- Bullets are concrete (name the tool or the task), never "และอีกมากมาย".
- Keep the author's own voice calm and professional — this copy sells the same book the chapters write.

---

## 4. Deliverable B — Social Network Posts

### Platform limits (verify before each campaign; these are long-standing limits)

| Platform | Length | Notes |
|---|---|---|
| X (Twitter) | 280 characters | Link usually counted as 23; hook + one claim + link |
| LinkedIn | 3,000 characters | Professional angle, `#hashtags` at the end, 3-5 |
| Facebook | Long posts truncated after the first few lines | Hook line must survive the "see more" cut |
| Instagram | 2,200 characters, max 30 hashtags | Caption + CTA in bio; 5-10 relevant hashtags |

### Anatomy of a launch post

```text
Emoji/hook line (1 line, standalone)
        ↓
Pain or question — 1-2 sentences
        ↓
Book announcement + what's inside — 3-5 bullets
        ↓
CTA: where to buy (placeholder link if not final)
        ↓
Hashtags (3-6)
```

### Template (Thai, reusable per platform)

```text
🚀 <ประโยคเปิดขาย 1 บรรทัด>

<ปัญหาของผู้อ่าน 1-2 ประโยค — "เบื่อไหมกับ..." หรือคำถามตรงๆ>

หนังสือใหม่! "<ชื่อหนังสือ>: <คำโปรย>"
📖 <ประโยคบอกความคุ้มค่า — ความยาว อ่านจบไว ใช้ได้ทันที>

* <ประโยชน์ 1>
* <ประโยชน์ 2>
* <ประโยชน์ 3>

💻 สั่งซื้อและอ่านบน Google Play Books ได้แล้ววันนี้!
👉 [ใส่ลิงก์ Google Play Books ตรงนี้]

#<关键词1> #<关键词2> #<关键词3> #<关键词4>
```

Generate one variant per platform: X gets the compressed 280-character version, LinkedIn gets the professional "why documentation matters" angle, Facebook keeps the friendly question hook, Instagram gets the visual/emoji-heavy version.

---

## 5. Output Convention

Write both artifacts into `sale.md`, keeping its section numbering intact:

- Section 1 — Google Play Books description (English heading stays, Thai body)
- Section 2 — Social network posts (one sub-block per platform is allowed)

Do **not** touch section 3 (BISAC — owned by the `bisac-categorizer` skill) or section 4 (pricing — owned by the `play-books-pricing` skill).

---

## 6. Final QA

- [ ] First line sells alone when everything below it is cut off
- [ ] Every claim traces to `toc.md` / `chapters/` / `epub.yaml`
- [ ] Page count, price, and link match the rest of `sale.md` (placeholders where unknown)
- [ ] No Markdown syntax inside the Play Books description
- [ ] Thai reads naturally; technical terms stay in English
- [ ] 3-5 learning bullets, each concrete and specific
- [ ] Each platform variant fits its length limit
- [ ] Hashtags at the end, 3-6 for Facebook/X/LinkedIn, up to 10 for Instagram
- [ ] No invented reviews, rankings, or sales numbers
