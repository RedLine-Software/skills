# Scene contract, and what BlockFrame changes

The composition contract itself is in `/hyperframes` and `npx hyperframes docs compositions`. This
covers the shapes a BlockFrame film actually uses and the traps that cost a rebuild.

## Root

`index.html` holds **only** the scene hosts and the music — no design, no scene markup.

```html
<link rel="stylesheet" href="assets/fonts/fonts.css" />
<div id="root" data-composition-id="main" data-start="0" data-duration="49.5"
     data-width="1080" data-height="1920">
  <div id="s1" data-composition-id="s1-hook"
       data-composition-src="compositions/s1-hook.html"
       data-start="0" data-duration="9.4"
       data-track-index="1" data-track-kind="graphics"
       data-width="1080" data-height="1920"></div>
  <!-- …s2…s5, start-to-start, no gaps… -->
  <audio id="bgm" src="assets/bgm/track-film.wav"
         data-start="0" data-duration="49.5" data-volume="0.12"
         data-fade-in="0.4" data-fade-out="1.5"></audio>
</div>
<script>
  window.__timelines = window.__timelines || {};
  window.__timelines["main"] = gsap.timeline({ paused: true });
</script>
```

Every `<audio>` needs an `id` or it is left out of the mix. Asset paths are root-relative from the
project root, in sub-compositions too.

## Scene

Everything a scene owns lives inside `<template>`. The host id, the scene root's
`data-composition-id` and the timeline key are the same string.

```html
<template>
  <style>
    #root { position: absolute; inset: 0; container-type: size; overflow: hidden;
            background: var(--blue); color: var(--black); font-family: var(--font-disp); }
  </style>
  <div id="root" data-composition-id="s2-point1" data-width="1080" data-height="1920">
    …elements with stable ids…
    <audio id="s2-vo" src="assets/voice/s2-point1.wav"
           data-start="0.5" data-duration="8.68" data-volume="1"></audio>
  </div>
  <script>
    const tl = gsap.timeline({ paused: true });
    // …tweens first…
    window.__timelines["s2-point1"] = tl;   // …then register
  </script>
</template>
```

Narration inside a scene is **composition-local**: `data-start="0.5"` means half a second after the
scene starts, not after the film starts. The `nested_media_start_basis_ambiguous` warning says exactly
that and can be ignored when it is true.

## The atom block

Put this in the root `index.html` `<style>` so every mounted scene inherits it; scenes then carry only
their own layout. `--bd-1`/`--sh-1` and `--bd-2`/`--sh-2` are the coupled pairs — change them together.

```css
:root {
  --black:#000; --white:#fff; --offwhite:#FFFDF5;
  --pink:#FE90E8; --blue:#C0F7FE; --green:#99E885; --yellow:#F7CB46; --cream:#FFDC8B;
  --font-disp:"Inter","Noto Sans Thai",sans-serif;
  --font-label:"Space Grotesk","Noto Sans Thai",sans-serif;
  --bd-1:0.37cqw;  --sh-1:0.74cqw;   /* 4px border, 8px shadow */
  --bd-2:0.28cqw;  --sh-2:0.37cqw;   /* 3px border, 4px shadow */
  --pad:5.56cqw;                     /* 60px slide pad */
}
* { margin:0; padding:0; box-sizing:border-box; }
html, body { width:1080px; height:1920px; overflow:hidden; background:var(--black); }
#root { position:absolute; inset:0; width:1080px; height:1920px; }

.pill  { display:inline-block; border:var(--bd-2) solid var(--black); background:var(--white);
         box-shadow:var(--sh-2) var(--sh-2) 0 var(--black); border-radius:9999px;
         padding:0.55cqw 1.5cqw; font-family:var(--font-label); font-weight:600;
         text-transform:uppercase; letter-spacing:0.08em; font-size:2.59cqw;
         line-height:1.2; white-space:nowrap; }
.disp  { font-family:var(--font-disp); text-transform:uppercase; letter-spacing:-0.03em;
         line-height:0.95; font-weight:900; }
.head  { font-family:var(--font-disp); text-transform:uppercase; letter-spacing:-0.02em;
         line-height:1.1; font-weight:800; font-size:8.6cqw; }
.body  { font-family:var(--font-disp); font-weight:500; line-height:1.6; font-size:3.43cqw; }
.card    { background:var(--white); border:var(--bd-1) solid var(--black);
           box-shadow:var(--sh-1) var(--sh-1) 0 var(--black); border-radius:0; }
.card-sm { background:var(--white); border:var(--bd-2) solid var(--black);
           box-shadow:var(--sh-2) var(--sh-2) 0 var(--black); border-radius:0; }
.btn    { display:inline-block; background:var(--yellow); color:var(--black);
          border:var(--bd-2) solid var(--black); box-shadow:var(--sh-2) var(--sh-2) 0 var(--black);
          border-radius:0; font-family:var(--font-disp); font-weight:700;
          font-size:4.07cqw; padding:1.5cqw 2.6cqw; line-height:1.2; }
.star   { clip-path:polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,
                            21% 91%,32% 57%,2% 35%,39% 35%); }
.dotgrid{ background-image:radial-gradient(circle,var(--black) 1.2px,transparent 1.2px);
          background-size:24px 24px; }
.dots   { position:absolute; inset:0; z-index:1; opacity:.3; }
.stripe { background-image:repeating-linear-gradient(45deg,
            var(--black), var(--black) .37cqw,
            var(--stripe, var(--green)) .37cqw, var(--stripe, var(--green)) 1.1cqw);
          border:var(--bd-2) solid var(--black); }
/* the footer band — fills 1330–1920 with texture in every scene */
.foot-stripe { position:absolute; left:60px; top:1440px; width:960px; height:96px; z-index:3; }
.foot-rect   { position:absolute; width:430px; height:215px; z-index:2;
               border:var(--bd-1) solid var(--black); box-shadow:var(--sh-1) var(--sh-1) 0 var(--black); }

/* Thai tone marks sit above the line box; vertical padding paints the highlight
   outward without moving any line, so the marks stay inside the yellow */
.hl { background:var(--yellow); box-decoration-break:clone;
      -webkit-box-decoration-break:clone; padding:0.19em 0.13em; }
```

`.stripe` takes its pastel through a custom property — `style="--stripe: var(--pink)"`. On a green
ground a green stripe vanishes; always give it the ground's complement.

### Bleeding decoration

Stars and tilted blocks that run off the canvas are correct BlockFrame, and the layout linter will
say otherwise. Mark them and move on:

```html
<div id="s1-star" data-layout-allow-overflow class="star"></div>
```

Mark only the decoration. A `container_overflow` on a card or a word is a real bug.

### Tilt and GSAP do not mix in CSS

The posed stills may carry `transform: rotate(-2deg)` in CSS. **The moment a GSAP tween touches that
element, the CSS transform must go** — GSAP reads the computed transform once and will fight the
stylesheet. Either move the rotation into the tween (`rotation: -2` in the `fromTo`) or split the
element so the animated part has no CSS transform.

## Motion grammar

| | Easing | Duration |
|---|---|---|
| Enter (pop in, drop in, wipe in) | `expo.out` / `power4.out` | 0.35–0.55 s |
| Move (camera, flood) | `power2.inOut` | 0.4–0.65 s |
| Exit | `power3.in` | 0.18–0.28 s — 40–50% of the enter |

- Stagger: 60 ms cards, 70 ms words in a line, 80 ms check-list items.
- Overlap: the next element starts 35–45% before the previous finishes. Nothing lines up exactly.
- **Titles land and stop.** No drift, scale, float or breathe after landing.
- Use `fromTo`, not `from`, inside a scene — it reads the pre-tween state, which a seek does not.
- Never tween `display`, `visibility` or `autoAlpha` on a `.clip`; animate a child.
- No `Date.now()`, no unseeded `Math.random()`, no network fetches, no `repeat: -1`.

**Exits must end ON the scene boundary, not before it.** Time the exit from the scene's
`data-duration` backwards: start ≈ `duration − 0.28` and give it 0.22–0.28 s, so the last frame is
mid-flight into the cut. An exit that finishes early leaves the final 0.2–0.6 s of the scene as bare
ground — six to eighteen frames of an empty colour field, which reads as a glitch. This is invisible
to `npm run check` (there is nothing overlapping, nothing stretched, nothing off-canvas); it only
shows up in a snapshot taken one or two tenths of a second before each cut. Always snapshot
`scene_start + data_duration − 0.1` for every scene and look.

**Do not enter every scene the same way.** Fade-and-slide-up repeated per scene is the single most
common tell. Give each scene an entry that suits it — pop in, drop in, wipe left to right, split down
the middle, spring in.

## Reading a check

`npm run check` with zero errors is the floor, not the finish. Then snapshot the seconds you changed
and look. Verdicts for the warnings this pipeline produces:

| Warning | Verdict |
|---|---|
| `dead_stretch` | expected while posed; must be gone after building |
| `nested_media_start_basis_ambiguous` | informational when the start really is composition-local |
| `container_overflow` on `*-star`, `*-rect`, `*-foot2` | intended bleed, marked with `data-layout-allow-overflow` |
| `container_overflow` on anything else | reposition or shrink it |
| `clip_media_fit` | media shorter than its slot — loop the bed, do not let the music stop early |
