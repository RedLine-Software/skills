#!/usr/bin/env node
/**
 * loop-bgm.mjs — stretch a generated music bed to the film's length.
 *
 * The audio engine seeds the bed to the length of the *voice*, so it stops before the film does and
 * the closing seconds go silent. Loop it forward and fade both ends.
 *
 * Run from the project root, after wait-bgm.mjs has finished:
 *
 *   node scripts/loop-bgm.mjs --in assets/bgm/track.wav \
 *     --out assets/bgm/track-film.wav --length 49.5
 *
 * Then point the root <audio> at --out and keep it under the voice (data-volume="0.12").
 *
 * The loop seam is audible in principle. Choose the film's structure so the bed's own length lands on
 * a scene cut — a CTA transition or a whoosh masks it completely.
 *
 * Requires ffmpeg on PATH.
 */
import { spawnSync } from "node:child_process";
import { statSync } from "node:fs";
import path from "node:path";

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const input = arg("in", "assets/bgm/track.wav");
const output = arg("out", "assets/bgm/track-film.wav");
const length = Number(arg("length", "0"));
const fadeIn = arg("fade-in", "0.4");
const fadeOut = arg("fade-out", "1.5");

if (!length || !Number.isFinite(length) || length <= 0) {
  console.error("--length <seconds> is required and must be a positive number");
  process.exit(1);
}

const inPath = path.resolve(process.cwd(), input);
const outPath = path.resolve(process.cwd(), output);

if (!statSync(inPath).isFile()) {
  console.error(`no such file: ${input}`);
  process.exit(1);
}

const fadeOutStart = Math.max(0, length - Number(fadeOut));
const filter =
  `afade=t=in:st=0:d=${fadeIn},` +
  `afade=t=out:st=${fadeOutStart.toFixed(3)}:d=${fadeOut}`;

const res = spawnSync(
  "ffmpeg",
  [
    "-y",
    "-stream_loop", "-1",
    "-i", inPath,
    "-t", String(length),
    "-af", filter,
    "-c:a", "pcm_s16le",
    "-ar", "44100",
    "-ac", "2",
    outPath,
  ],
  { stdio: ["ignore", "ignore", "pipe"] },
);

if (res.status !== 0) {
  console.error(res.stderr?.toString().split("\n").slice(-12).join("\n"));
  console.error("ffmpeg failed — is it on PATH? `ffmpeg -version`");
  process.exit(res.status ?? 1);
}

console.log(
  `wrote ${output} — ${length}s, fade-in ${fadeIn}s, fade-out ${fadeOut}s from ${fadeOutStart.toFixed(1)}s`,
);
console.log(`point the root <audio> at it and keep it under the voice`);
