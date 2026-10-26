---
name: play-books-pricing
description: Set the USD list price of a book on Google Play Books when Google takes a 48% GP cut (publisher keeps 52%). Use when asked to ตั้งราคาขายหนังสือ, calculate retail price / net earnings in USD, build a price ladder, or fill section 4 of sale.md.
version: "1.0.0"
license: MIT
compatibility: Requires Node.js for scripts/price.js; pricing rules verified against Google Play Books Partner Center docs (2026-10-26)
tags: [pricing, google-play-books, usd, revenue-share, ebook, royalties]
triggers: ["sale.md", "ราคาขาย", "list price", "GP 48%", "revenue split", "royalty"]
---

# Play Books Pricing (USD, GP 48%)

This skill computes and documents the **USD list price** of a book on Google Play Books under the project's pricing model: **Google keeps 48% (ค่า GP), the publisher keeps 52% net**, and it writes the result into `sale.md` section 4.

## 1. The Model

| Party | Share | Formula |
|---|---|---|
| Google (ค่า GP) | **48%** | `GP = price × 0.48` |
| Publisher (สุทธิ) | **52%** | `Net = price × 0.52` |

**Where 48% comes from (official):** Google's *default* revenue split for Google Play Books is **52% of the list price** to the partner. Per Google's Revenue Split FAQ, that default applies to ebook sales in — among others — **Thailand**, Hong Kong, India, Indonesia, Japan, Malaysia, Philippines, Singapore, South Korea, Taiwan, and Vietnam, and to partners who have not accepted the updated (2019) Terms of Service.

Two official facts that change how you quote numbers:

1. **The split is paid on the list price, not the discounted price** — "Google pays revenue split on the list price" (Revenue Split FAQ #5). Promotions therefore do not shrink your per-copy share of the list price.
2. **A 70% split exists.** Partners who accepted the 2019 TOS earn **70% of list price** in 60+ eligible countries (US, UK, EU, Australia, Canada, and more — *not* Thailand). If the user's account is in that program, recompute with `--share 70`; otherwise stay on 48% GP / 52% net.

> Sources (verified 2026-10-26): [Revenue Split FAQs](https://support.google.com/books/partner/answer/9331459) · [Book prices](https://support.google.com/books/partner/answer/3238849) · [How to sell books on Google Play](https://support.google.com/books/partner/answer/1079107)

## 2. Platform Constraints (official)

- Price must be **between $0.05 and $200 USD** (limits are defined in USD; local currencies are converted).
- **USD is the anchor currency**: "price limits are set in US Dollars (USD)."
- Accounts created **after July 2014** have **currency conversion on by default** — one USD list price fans out to every territory automatically.
- Converted international prices are auto-"prettified" by **at most ±5%** (e.g. `$4.99` → a clean local price); publishers can opt out.
- Settings available per price: tax-inclusive (`Is tax included?`), fixed-price-law territories, and scheduled **effective dates** (`YYYY-MM-DD`).

## 3. Calculation

```text
Given a price:        GP   = price × 0.48        Net = price × 0.52
Given a target net:   min price = target_net ÷ 0.52  → round UP to a charm price
```

Always present money **rounded to the nearest cent** (matching how `sale.md` already reports it), and keep the price itself on a charm ending (`.99`, `.49`, `.00`).

### The calculator

```bash
node .agents/skills/play-books-pricing/scripts/price.js 3.99        # breakdown
node .agents/skills/play-books-pricing/scripts/price.js --table     # price ladder
node .agents/skills/play-books-pricing/scripts/price.js --target 3  # price earning ≥ $3 net
node .agents/skills/play-books-pricing/scripts/price.js --share 70 3.99   # 70% split markets
```

### Reference ladder (GP 48% / net 52%)

| List price | Google GP 48% | Net 52% |
|---|---|---|
| $0.99 | $0.48 | $0.51 |
| $1.99 | $0.96 | $1.03 |
| $2.99 | $1.44 | $1.55 |
| $3.99 | $1.92 | **$2.07** |
| $4.99 | $2.40 | **$2.59** |
| $5.99 | $2.88 | $3.11 |
| $6.99 | $3.36 | $3.63 |
| $7.99 | $3.84 | $4.15 |
| $9.99 | $4.80 | $5.19 |
| $12.99 | $6.24 | $6.75 |
| $14.99 | $7.20 | $7.79 |
| $19.99 | $9.60 | $10.39 |

## 4. Choosing the Price

Work from **both** directions and pick where they meet:

1. **Floor:** what net per copy do you need? `price ≥ target_net ÷ 0.52`.
2. **Ceiling:** what will the audience pay for this format?

Positioning bands for a professional/technical ebook:

| Band | Positioning |
|---|---|
| $0.99 – $1.99 | Impulse buy; low perceived value — use for short promos, not the standing price |
| **$2.99 – $4.99** | **Sweet spot for a short professional title (50-120 pages)** — low friction for developers |
| $5.99 – $9.99 | Substantial guide or reference with demonstrated depth |
| $10.99 – $19.99 | Comprehensive reference / course-grade material |
| Above $20 | Rare for ebooks; needs strong brand or niche monopoly |

Deciding factors: **page count** (82 pages sits in $2.99-$4.99), depth of examples, whether the audience buys individually or as a team, and launch strategy (launch low, raise after reviews — schedule with `Effective dates`).

## 5. Entering the Price in Partner Center

1. Sign in to [Partner Center](https://play.google.com/books/publish/) → select the book → **Pricing**.
2. **Add a price** → choose currency **USD** → enter the amount (must fall in `$0.05`–`$200`).
3. Select the countries/regions this price applies to (or rely on currency conversion for worldwide).
4. Review **Is tax included?**, fixed-price-law territories, and **Effective dates** if scheduling.
5. Confirm the **Effective prices** table — it shows country, list price, base price, **your revenue**, and effective dates. Your revenue column is the ground truth for the net share.

## 6. Output Convention

Write into `sale.md` → `## 4. การตั้งราคาขายบน Google Play Books (สกุลเงิน USD)`:

```markdown
เนื่องจาก Google Play Books หักส่วนแบ่งรายได้ (Google GP) ที่ **48%**
(ผู้เขียนจะได้รับส่วนแบ่งสุทธิ **52%**) การคำนวณราคาจึงต้องเผื่อสัดส่วนรายได้ที่ต้องการรับจริงครับ

* **ราคาขายแนะนำ (Retail Price):** **$X.XX USD**
* Google หักส่วนแบ่ง (48%): $G.GG USD
* **รายได้สุทธิที่คุณได้รับ (52%):** **$N.NN USD** ต่อเล่ม
```

Rules:

- Show **list price, GP cut, and net** for every option (at least the recommended price and one alternative).
- The GP and net figures must come from `price.js` — do not hand-compute.
- State the recommendation band for the book, and note the 70% split only if the account actually qualifies.

## 7. Final QA

- [ ] Split is 48% GP / 52% net (or `--share 70` explicitly requested and justified)
- [ ] Price sits within the official `$0.05`–`$200` USD range
- [ ] All money figures produced by `price.js`, rounded to the nearest cent
- [ ] Net figures match the ladder (e.g. `$3.99` → GP `$1.92`, net `$2.07`)
- [ ] Price uses a charm ending and matches the book's length/positioning
- [ ] Split stated as being **on list price**, not the sale price
- [ ] `sale.md` section 4 updated; sections 1-3 untouched
