---
name: bisac-categorizer
description: Recommend BISAC subject codes (Book Industry Standards and Communications) for a book so it can be correctly shelved on Google Play Books and other distribution systems. Use when asked to choose หมวดหนังสือ / genres / subject codes, to fill section 3 of sale.md, or to review whether a book's genres match its content.
version: "1.0.0"
license: MIT
compatibility: No runtime dependencies; reads toc.md and chapters/, verifies codes at bisg.org
tags: [bisac, metadata, genres, google-play-books, categorization, ebook]
triggers: ["sale.md", "BISAC", "หมวดหนังสือ", "genre", "subject code", "COM0"]
---

# BISAC Categorizer

BISAC (Book Industry Standards and Communications) subject codes are the book industry's category vocabulary. This skill turns a book's actual content into one **primary** code plus up to two **secondary** codes, written into `sale.md` section 3.

## 1. Why BISAC Matters on Google Play Books

Official rules from the Google Play Books Partner Center:

- A book **requires at least one genre** to be published.
- Google **recommends BISAC** because "genres in the Play Store are based on BISAC"; other standards are auto-mapped to their BISAC equivalent.
- **Maximum 3 genres** per book, the **first one must be the most relevant**, and **all genres must come from the same subject standard**.
- All genres should be from the same subject standard — do not mix BISAC with BIC/CLIL/etc.

Because only three slots exist, the ranking matters as much as the choice.

## 2. The Selection Procedure

```text
1. Summarize the book in one sentence
        ↓
2. Pick the BISAC section that matches the CONTENT (not the audience)
        ↓
3. Walk down to the most specific leaf heading that is still true
        ↓
4. Primary = the most relevant leaf; Secondary = up to 2 distinct angles
        ↓
5. Verify every code character-for-character at bisg.org
        ↓
6. Write the result into sale.md section 3
```

### Decision rules

1. **Content, not reader.** A book *for* managers about writing docs is still `COMPUTERS` if the subject is documentation tooling.
2. **Specific beats general.** Choose `COM085000 COMPUTERS / Documentation & Technical Writing` over `COM000000 COMPUTERS / General` whenever the specific leaf is true — "General" is a fallback, never a first choice.
3. **No duplicates of the same angle.** Three codes from the same branch waste slots; secondary codes should cover genuinely different facets (e.g. tools vs. writing craft vs. workflows).
4. **Stay inside one subject standard.** All codes must be from the same standard (for this project: BISAC).
5. **Never invent a code.** If no leaf fits, use the closest true heading — BISG's own guidance is "use whatever codes currently best represent your book" — and say so in the note.
6. **Verify before writing.** Codes change between BISAC editions; confirm each code + heading pair at [bisg.org](https://www.bisg.org/BISAC-Subject-Codes-main) or in `references/verified-codes.md` (a project-curated subset, verified 2026-10-26).

## 3. Where Codes Come From

| Resource | Use |
|---|---|
| `references/verified-codes.md` | Curated subset verified against bisg.org on 2026-10-26 — start here |
| <https://www.bisg.org/BISAC-Subject-Codes-main> | Official free full list (browse section by section) |
| <https://www.bisg.org/complete-bisac-subject-headings-list> | Entry point for all sections |

**Copyright note:** the full BISAC list is © Book Industry Study Group and may not be redistributed. Copy only the few code/heading pairs the book actually uses into `sale.md`; never dump whole sections into project files.

## 4. Output Format

Write into `sale.md` → `## 3. แนะนำหมวดหนังสือ BISAC (...)`, following the existing structure:

```markdown
* **หมวดหลัก (Primary BISAC Code):**
* **<CODE>** — `<SECTION> / <Subsection> / <Leaf>` (<คำอธิบายไทย>)

* **หมวดรองที่เกี่ยวข้อง (Secondary BISAC Codes - ถ้าแพลตฟอร์มรองรับ):**
* **<CODE>** — `<SECTION> / <Subsection> / <Leaf>` (<คำอธิบายไทย>)
* **<CODE>** — `<SECTION> / <Subsection> / <Leaf>` (<คำอธิบายไทย>)
```

Rules for the block:

- Code in bold, heading copied **exactly** as BISG writes it (English, including slashes and capitalization), followed by a short Thai gloss.
- Primary first; secondaries ordered by relevance.
- If a platform only accepts one code, the primary alone must still stand on its own.

## 5. Common Mistakes

| Mistake | Fix |
|---|---|
| Invented or remembered-wrong code | Re-verify at bisg.org before writing |
| `COM000000 COMPUTERS / General` as primary | Use the most specific true leaf |
| Choosing by audience ("for developers") | Choose by the book's actual subject |
| 3 codes that all say the same thing | One primary angle + genuinely different secondary angles |
| Mixing BISAC with another standard | One standard per book (BISAC for Google Play) |
| Reproducing whole BISAC sections in the repo | Cite only the used pairs; link the official list |

## 6. Final QA

- [ ] At least one code (Google requires a genre) and at most three
- [ ] Primary is the single most relevant heading
- [ ] All codes verified character-for-character against bisg.org
- [ ] All codes from the same subject standard (BISAC)
- [ ] English heading copied exactly; Thai gloss present
- [ ] `sale.md` section 3 updated; sections 1, 2, 4 untouched
- [ ] No bulk reproduction of the copyrighted BISAC list
