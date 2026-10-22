# Voice, music and fonts

The three media steps, and the ones that fail silently if you skip them.

## Voice — the clock

**Generate the narration before posing a single shot.** Scene durations come from real audio lengths
and every beat start is timed to its anchor word. Posing against estimates means re-posing everything.

Budget ~2.2 words a second: a 10 s scene is about 19 words, a whole film 155 words or fewer. Write the
line as separate phrases so each has a cue point. A voiceover longer than its visuals makes the
visuals pad with idle drift — trim the script, never stretch the motion.

### Thai: Gemini, not Kokoro

`npx hyperframes tts` is Kokoro-82M running locally. **It has no Thai** — its languages are EN/ES/FR/
HI/IT/JA/PT/ZH, and Thai phonemisation is not in it either. For Thai, use the shared audio engine from
`/media-use` with `provider: "gemini"`, which needs `GEMINI_API_KEY` in the environment.

No credential is not a green light to silently substitute an English voice. Say so and stop for the
choice: sign in to HeyGen for its starfish voices, use Gemini if a key is available, or deliver the
film without narration.

One request, one file per line, plus the music bed in the same pass:

```json
{
  "provider": "gemini",
  "tts_model": "gemini-3.8-flash-tts",
  "voice": "Kore",
  "lang": "th",
  "style": "พูดภาษาไทยชัดเจน สบาย ๆ เป็นกันเอง เทมโป์ปานกลาง มีจังหวะหยุดสั้น ๆ ระหว่างประโยค",
  "lines": [
    { "id": "s1-hook",   "text": "…" },
    { "id": "s2-point1", "text": "…" }
  ],
  "bgm": { "mode": "auto", "prompt": "bright modern piano with synth pads, 108 bpm, no vocals" }
}
```

`lang` is a hint for transcription; Gemini infers the spoken language from the text, so the `text`
field is what actually decides. Keep the `style` free of anything you do not want read aloud — a
directive line in the style field can end up in the audio.

Run it from the project root with the audio engine that ships in the `media-use` skill
(`audio/scripts/audio.mjs`), with `--only tts,bgm`. It writes `assets/voice/<id>.wav` per line,
launches the music detached, and records everything in `audio_meta.json`.

Then read `audio_meta.json` for the real `duration_s` per line and lay the scenes out against it:

```
scene_start(n) = scene_start(n-1) + duration(n-1)    voice at scene_start + 0.5 s
```

Word timings come back empty unless the transcription pass runs alongside. That is only needed if the
film carries captions — a BlockFrame film normally does not, because its on-screen words are
headlines rather than a transcript.

## Music

The same engine generates the bed when there is no HeyGen credential: Lyria where available, otherwise
MusicGen, seeded from the mood prompt. It writes `assets/bgm/track.wav` to the length of the voice,
detached, and logs to `assets/bgm/bgm-<ts>.log`.

`audio_meta.json` carries `bgm_pending: true` and the pid. Wait for it before assembling:

```bash
node <media-use>/audio/scripts/wait-bgm.mjs --hyperframes . --out ./audio_meta.json
```

### Then loop it to the film's length

The generated bed is as long as the *voice*, so it stops before the film does and the last several
seconds go silent. Loop it to the root's `data-duration` with a fade in and out, and check the seam
lands on a scene cut so it is masked:

```bash
node scripts/loop-bgm.mjs --in assets/bgm/track.wav --out assets/bgm/track-film.wav \
  --length 49.5 --fade-in 0.4 --fade-out 1.5
```

Point the root `<audio>` at the looped file and keep it under the voice at `data-volume="0.12"`. A
music bed that competes with a voiceover is a mixed film, not a scored one.

## Fonts

Inter ships with HyperFrames. **Neither Inter nor Space Grotesk contains Thai glyphs** — without a
Thai face, Thai text falls back to whatever the render machine happens to have, and the 900 display
weight disappears. Fetch `Noto Sans Thai` and `Space Grotesk` once per project:

```bash
node scripts/fetch-fonts.mjs --out assets/fonts
```

It pulls the subsets from the Google Fonts CSS API with a browser user-agent, saves every `woff2`
locally and writes `assets/fonts/fonts.css` with the same `@font-face` rules rewritten to local paths.
Link it from the root `<head>`:

```html
<link rel="stylesheet" href="assets/fonts/fonts.css" />
```

Stack the Thai face **after** the Latin one so Latin glyphs come from Inter and Thai falls through:

```css
--font-disp:  "Inter", "Noto Sans Thai", sans-serif;
--font-label: "Space Grotesk", "Noto Sans Thai", sans-serif;
```

Re-run the script if new Thai characters are added late — these are full subsets rather than
text-subsetted, so it only needs redoing when the character set changes, not when words change.

### What the compiler reports

`check` prints `Fetched N font face(s) for "Inter" from Google Fonts (cached …)` and `Fonts: 15
loaded, 14 unused`. Loaded-but-unused faces are normal — a subset request returns one face per weight
per unicode range, and only the ones the film actually sets are used.
