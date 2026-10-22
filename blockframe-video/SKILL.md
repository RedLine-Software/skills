---
name: blockframe-video
description: Make a vertical BlockFrame knowledge short in the current directory with HyperFrames — a brief becomes 3 key points, a 5-scene film, Thai or English narration, a storyboard that stops for approval, then build, check and render. Use for any short/reel/video that should look like the BlockFrame system in FRAME.md (4px black borders, hard shadows, pastel grounds, yellow CTA), especially Thai social clips.
metadata:
  opencode/slash: "true"
---

# BlockFrame video

Turn a one-line subject into a 45–60 s vertical film that looks like **FRAME.md** — the BlockFrame
system. The design system is not negotiable here: 4 px black borders coupled to 8 px hard shadows
(3 px↔4 px for chrome), square corners, pastel grounds cycling per scene, yellow reserved for the CTA,
Inter display over Space Grotesk label-pills. Distilled rules and the 9:16 re-step numbers are in
[references/blockframe.md](references/blockframe.md).

HyperFrames does the rendering; this skill is the pipeline around it. Read `/hyperframes` first if you
have not — the composition contract lives there and [references/scene-contract.md](references/scene-contract.md)
only repeats what BlockFrame changes.

## Two gates. Both are hard stops.

1. **Storyboard gate.** After the stills exist and you have looked at every one, stop and ask.
   The film is not built yet — only posed. Nothing animates before the person picks or amends a shot.
2. **Render gate.** After `check` is clean and the Studio preview is up. No MP4 before approval.

If the person's message is a question, a loose idea or "don't change anything", answer or propose.
Do not start a film.

## The work loop

Full steps, commands and the file shapes: [references/pipeline.md](references/pipeline.md).

1. **Brief** — subject, audience, duration, language, where narration comes from. Ask only what the
   film cannot be written without.
2. **Three points + 5 scenes** — Hook, three knowledge points, Call to Action. Present before any file.
3. **Scaffold** — `npx hyperframes init <slug> --resolution portrait --non-interactive`, or work in
   place when the current directory already holds a `hyperframes.json`.
4. **Narration first.** Synthesise the voice before posing anything: the voice is the clock, and every
   beat start is timed to its anchor word. Posing against estimated durations wastes a whole pass.
   [references/media.md](references/media.md).
5. **SPEC.md** — write it from FRAME.md plus the shot table. Includes a BANNED list.
6. **Storyboard** — pose every shot in the real compositions, `snapshot` the key moments, look at every
   still yourself, write `boards/storyboard.html` and `STORYBOARD.md`. Stop.
7. **Build** — animate onto the approved poses. One paused GSAP timeline per scene.
8. **Check → review → render.** `npm run check` with zero errors, then look at frames at the times you
   changed, then `snapshot --review`, then the Studio preview. Stop for the render gate.

## Five things this pipeline learned the hard way

These are the failures that cost a rebuild. Do not rediscover them.

- **Kokoro (the offline TTS) has no Thai.** Its languages are EN/ES/FR/HI/IT/JA/PT/ZH. Thai goes through
  Gemini TTS via the `/media-use` audio engine when `GEMINI_API_KEY` is set; a missing credential is a
  stop, not a silent downgrade to an English voice.
- **Inter and Space Grotesk have no Thai glyphs.** Thai needs `Noto Sans Thai`, fetched and served with
  `@font-face` from `assets/fonts/`. Stack it *after* the Latin face so Latin comes from Inter and Thai
  falls through: `"Inter", "Noto Sans Thai", sans-serif`.
- **Thai has no case.** The uppercase display signal disappears, so the identity has to come from
  borders, hard shadows, tilts and decoration. Push those; do not compensate by inventing fake caps.
- **A highlighter behind Thai clips tone marks.** `line-height: 0.95` display type puts ้ ็ ่ above the
  line box that a background paints. Vertical padding on the highlight span paints outward without
  moving the line box: `padding: 0.19em 0.13em` with `box-decoration-break: clone`.
- **The bottom third reads as broken when it is empty.** On 9:16 the band from y=1330 to the canvas
  bottom takes texture only, but it still has to be *filled*. Every scene gets a footer: a stripe block
  across y≈1440 and one tilted pastel rect bleeding a bottom corner.

## Hard rules

- **Never invent a figure.** No statistic, percentage, revenue, user count or time-saving claim the
  script does not supply. A missing number renders as `— figure —`. This matters most for AI and
  business topics, where a plausible invented number is the easiest way to ship something false.
- **No sixth pastel.** The five in FRAME.md plus black, white and offwhite, which cycle as full-bleed
  grounds. No gradients, no texture, no grain, no vignette.
- **Nothing readable under 28 px**, no word above y=168, no word below y=1330, no text under the
  right-hand action rail (x>890 while y>700).
- **Screen complements the voice.** On-screen words are headlines and numbers, not a transcript — the
  same line twice is wasted, and a screen full of identical fade-ins reads as a broken slide deck.
