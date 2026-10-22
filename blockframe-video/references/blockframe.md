# BlockFrame, distilled

The system lives in `FRAME.md` at the project root — read it when it is there, since the person's copy
is the authority. This is the load-bearing subset plus the numbers a 1080×1920 canvas needs.

## Atoms — coupled and scale-aware

Every border and shadow is a **pair**. A border of one size is always accompanied by a shadow of its
partner size, always solid, always black, always 0 blur. Change the pair together or not at all.

| Role | Border | Shadow | In `cqw` at 1080 |
|---|---|---|---|
| Primary (cards, frames) | 4 px | 8 px | `0.37cqw` / `0.74cqw` |
| Chrome (pills, small cards, stripes) | 3 px | 4 px | `0.28cqw` / `0.37cqw` |
| Close-frame only | 4 px white | **12 px yellow** | `0.37cqw` / `1.11cqw` |

`cqw` is not decoration — it is how the coupling survives a resize. Put `container-type: size` on the
scene root and express borders, shadows, type and padding in `cqw`; 1 cqw = 1% of the frame width.
At 1080 px wide, 1 cqw = 10.8 px.

**Radius is 0 everywhere** with exactly two exceptions: the label-pill (`9999px`) and the stat-deco dot
(a circle). Shadows are never blurred, never coloured, never offset diagonally — except the close-frame,
which is the only frame permitted a coloured shadow.

## Colour

```
black #000000   white #ffffff   offwhite #FFFDF5
pink  #FE90E8   blue  #C0F7FE   green   #99E885
yellow #F7CB46  cream #FFDC8B
```

Five pastels plus the three neutrals. **No sixth pastel, no gradient, no texture, no grain, no
vignette** — grounds are flat full-bleed fills.

- **Grounds** cycle through the neutrals and pastels, one per scene, ending on black for the close.
- **Cards** are white. Always.
- **Yellow is the CTA colour** — the call to action, the close-frame's shadow, and at most one
  highlighted word per frame. Nothing else.
- Shadows are black. The single exception is the 12 px yellow shadow on the close-frame.

## Type

| Role | Face | Weight | Tracking | Notes |
|---|---|---|---|---|
| Display | Inter | 900 | −0.03em | headings, hero words, close title |
| Sub-display | Inter | 800 | −0.02em | scene headlines |
| Body | Inter | 500 | normal | sentence case, line-height 1.6 |
| Label chrome | Space Grotesk | 600 | **+0.08em** | uppercase, label-pills only |

Label-pills are the only place a pill shape and Space Grotesk appear. A label-pill never carries a
sentence — it names, it does not explain.

**Thai drops the uppercase signal.** Thai script has no case, so `text-transform: uppercase` does
nothing for the display face's main identity cue. Compensate with weight, border, shadow and tilt —
not with fake caps, and not by adding a sixth typeface.

### Type ramp at 1080×1920

`cqw` and the px it resolves to. The legibility floor is 28 px; FRAME.md's 1.4 cqw is a landscape
number and is too small for a phone, so it is re-stepped here.

| Role | `cqw` | px | Share of frame height |
|---|---|---|---|
| Hook title | 11 cqw | 119 | ~6.2% |
| Scene headline | 8.6 cqw | 93 | ~4.8% |
| Hero card title | 6.4 cqw | 69 | — |
| Check-card title | 5.2 cqw | 56 | — |
| Button | 4.1 cqw | 44 | — |
| Row / bubble text | 3.7 cqw | 40 | — |
| Body | 3.4 cqw | 37 | — |
| Label-pill | 2.6 cqw | 28 | floor |

Titles should run 3–6× the size of their neighbours. If a hero and a body line are within 2×, one of
them is wrong.

## Vertical safe zones (1080×1920)

| Band | Contents |
|---|---|
| 0–168 px | nothing — platform status area |
| 168–1330 px | **every word and the product** |
| 1330–1920 px | texture and decoration only |
| x>890 while y>700 | right-hand action rail — no text |

Bleeding decoration is allowed anywhere; the bands constrain *text*. Content starts at x=60 (5.56 cqw)
and the text column runs to x=890, so anything below y=700 stays inside 830 px of width.

## The footer band

The most common failure on a vertical frame is a bottom third that is simply empty. It reads as
unfinished, not as breathing room. Every scene fills 1330–1920 with texture:

- a **stripe block** across the width at y≈1440 — 45° black-and-pastel diagonals, 3 px border, no
  shadow. Give it the ground's complement, never the ground colour itself.
- **one tilted pastel rect** bleeding a bottom corner at y≈1600, 4 px border, 8 px shadow, rotated
  7–9°.
- a **dot grid** across the full frame at ~30% opacity where the ground needs grain.

Alternate which corner the rect bleeds from, or the five scenes stop reading as a system.

## Components

| Component | Definition |
|---|---|
| `label-pill` | 3 px black border, 4 px black shadow, `9999px` radius, Space Grotesk 600 uppercase +0.08em, pastel or white fill |
| `feature-card` | 4 px border, 8 px shadow, 0 radius, white, optional pastel bar across the top edge, optional icon square |
| `stat-card` | feature-card tilted ±2°, one **stat-deco-dot** (the only circle in the system), no number when the script supplies none |
| `quote-frame` | `card-elevated`, 4 px padding, may sit at −1°, one paragraph or a stack of rows |
| `button-primary` | yellow fill, 3 px black border, 4 px black shadow, 0 radius, Inter 700 |
| `close-frame` | black ground, white 4 px border, 12 px **yellow** shadow, centred, ~50% silence |
| `stripe-block` | 45° black + pastel diagonals, 3 px border |
| `star-burst` | 10-point `clip-path` star, pastel fill, 3 px border — one or more puncturing a frame edge |
| `bg-dot-grid` | full-frame dots at 20–30% opacity |

At least one decoration — tilt, star, stripe or dots — per frame. **Empty corners read as broken.**

## Composition rhythm

- **Lean left.** Titles left, decoration right. Nothing is centred except the close-frame.
- **One hero per shot**, filling at least 40% of the frame's height or width.
- **Puncture the grid.** Star-bursts and tilted blocks bleed off two or three edges. Nothing should
  look like it could be nudged back inside a margin and improve.
- **The close breathes.** Black ground, one frame, silence for around half the band.
