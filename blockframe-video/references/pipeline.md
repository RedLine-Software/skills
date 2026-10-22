# Pipeline

Eight steps, two gates. Steps 1–3 are conversation and setup; nothing is designed until step 5.

Timings below are for a 45–60 s film. A shorter film keeps every step and drops scenes from the table.

---

## 1. Brief

Ask for what the film cannot be written without, in one round:

| | |
|---|---|
| Subject | the one thing the film is about |
| Audience | who is watching, and what they already know |
| Duration | default 45–60 s for a knowledge short |
| Language | default Thai; changes TTS route and font route |
| Narration | voiceover, captions only, or silent |

If a design system exists in the current directory (`FRAME.md`, `design.md`), read it — it overrides
the generic defaults. If none exists, this skill is the wrong tool; use `/hyperframes` directly.

## 2. Three points, then five scenes

Deliver the three key points first — the thing the viewer can act on, each one concrete enough to
demonstrate. Then lay them on the mandated skeleton:

```
Hook  →  knowledge point 1  →  knowledge point 2  →  knowledge point 3  →  Call to Action
```

Write a one-line read per scene, a one-line handoff per scene (what leaves the frame), and a ground
colour per scene cycling through the pastels into black for the close. Only the close-frame gets black.

Present this and, if more than one storyline would work, offer them and let the person pick. Then
stop. The SPEC depends on the answer.

## 3. Scaffold

```bash
npx hyperframes init <slug> --resolution portrait --non-interactive --skill hyperframes
```

- `<slug>` is short, lowercase, hyphenated.
- Work in a subfolder unless the current directory **already contains** `hyperframes.json` — in that
  case it is the project and step 5's `SPEC.md` goes at its root.

Project shape the rest of the pipeline expects:

```
<project>/
  SPEC.md                      written in step 5, read before every later decision
  STORYBOARD.md                written in step 6, carries the times
  index.html                   root composition: scene hosts + music only
  compositions/s1-*.html …     one scene per sub-composition
  assets/voice/  assets/bgm/  assets/fonts/
  boards/                      stills, storyboard.html, .posed.html, .film.html
  scripts/fetch-fonts.mjs      copied from this skill
```

## 4. Narration first

**Generate the voice before posing anything.** Scene durations come from real audio lengths, not from
guesses — a scene is only as long as its line, and every beat start is timed to that line's anchor
word. Posing first means re-posing everything after the audio lands.

Write the lines as separate phrases so each has a cue point. Reveal each element when the voice names
it; anything on screen in the first quarter of a scene and then frozen reads as a slideshow.

Route, request shape and the font step: [media.md](media.md). Budget roughly 2.2 words a second — a
10 s scene is about 19 words.

Then lay the scenes out against the real durations and write them into the root hosts:

```
scene_start(n) = scene_start(n-1) + duration(n-1)     voice starts ≈ scene_start + 0.5 s
```

## 5. SPEC.md

One file at the project root, written before any markup. Shape:

```markdown
GOAL:    what changes for the viewer
OUTPUT:  resolution, frame rate, language
TIME:    total seconds × fps = frames, and the real voice duration
LOOK:    ground / ink / accent / cards — one line each, with hex
         display / body / label — family, weight, tracking
         type ramp in cqw with the px it resolves to
         depth: shadow colours and sizes, and which frame may use a coloured shadow
         safe zones for this ratio
OBJECTS: the named components this film uses, one line each
MOTION:  enter / move / exit easings and durations, stagger, overlap
SHOTS:   one line per scene: time range, ground, what's on screen, what's read,
         what's said, sound, handoff
BANNED:  everything this film will not do
QA:      a time and a question per scene, asked of a still
```

The BANNED list is the part that earns its keep. Include the generic defaults (dark void + floating
object, glow, purple-blue gradient, everything centred, everything fading together, fade-and-slide-up
repeated per scene, text drifting while it is being read) **plus** whatever the design system's own
tells are, **minus** anything the design system mandates. Frame one's reference wins on its own beat.

## 6. Storyboard — then stop

1. Before the first pose, `copy index.html boards/.film.html`.
2. Pose each shot in the compositions the project actually renders, at its key moment: real words, real
   fonts, real colours, the focal point big enough to read on a phone. The root mounts every scene at
   its planned start — a shot posed in its own file shows in no snapshot until it is mounted.
3. `npx hyperframes snapshot --at <every shot's seconds, in film order> --no-end --describe false -o boards/stills`
4. **Look at every still yourself.** A passing check does not show how it looks. Fix and re-snapshot
   until each one holds. The two questions per frame: what is this scene about, and can I read that on
   a phone? Anything that fails either is too small.
5. Write `boards/storyboard.html` (still images referenced by relative path, one caption block per
   shot: time range, title, read, sound, handoff) and `STORYBOARD.md` with the same shots as a table.
6. `copy index.html boards/.posed.html`, then `copy boards/.film.html index.html` back.
7. **Stop. Ask.** On "go", copy `boards/.posed.html` over `index.html` and animate from the approved
   stills.

## 7. Build

Animate onto the approved poses — do not redesign them. Motion grammar is in
[scene-contract.md](scene-contract.md). Reveal each element when the voice names it, across the back
half of the scene. Titles land and are still; the only permitted post-landing movement on text is the
documented highlighter wipe.

## 8. Check, review, render

```bash
npm run check        # zero errors required; every warning read, not just counted
```

Then look again — `npx hyperframes snapshot --at <the seconds you changed>`. A green check proves
nothing is broken; it proves nothing looks right.

Common warnings and what they actually mean:

| Warning | Verdict |
|---|---|
| `dead_stretch` | correct on posed stills; must be gone once animated |
| `nested_media_start_basis_ambiguous` | narration inside a sub-composition is composition-local by default — informational, keep it |
| `container_overflow` / `panel_out_of_canvas` on decoration | intended bleed; mark `data-layout-allow-overflow` |
| `container_overflow` on a card or a word | a real bug — reposition or shrink it |
| `clip_media_fit` | media shorter than its slot; loop the bed rather than letting it end early |

**The audio mix blocks the render on old ffmpeg.** HyperFrames calls the `setts` bitstream filter,
which only exists in ffmpeg ≥ 4.4. On 4.3.x the render dies in `Processing audio tracks` with
`audio_processing_failed` and `Error parsing bitstream filter sequence 'setts=…'`, and the CLI only
suggests `--docker`. Check the version first — `ffmpeg -version` — and if it is 4.3 or older, put a
current build ahead of it on `PATH` for the render command only. Nothing in the project is at fault;
every source asset can be the right length and it still fails.

Then `npx hyperframes snapshot --review` for `REVIEW.md`, then the preview:

```bash
npx hyperframes preview --background
npx hyperframes preview --status     # verify it is listening
npx hyperframes preview --stop       # when review is finished
```

**Stop for the render gate.** After approval, `npm run render`. If it fails, fix and re-render —
correctness before polish, never a partial render.

## If the person asks for a change after the build

Change the script and the storyboard, re-pose and re-approve that shot, then re-time the beats to the
new audio. Never retime visuals to fit audio that has not been regenerated, and never stretch motion
to cover a voiceover that ran long — trim the script.
