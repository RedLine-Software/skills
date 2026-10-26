#!/usr/bin/env node
"use strict";

/**
 * price.js — Google Play Books USD price calculator (project default: GP 48% / net 52%).
 *
 *   node price.js 3.99                  breakdown of a list price
 *   node price.js --table                charm-price ladder
 *   node price.js --target 3             smallest charm price earning at least $3 net
 *   node price.js --share 70 3.99        use another partner revenue share (e.g. 70%)
 *   node price.js --help
 *
 * Official constraints (Google Play Books Partner Center, verified 2026-10-26):
 *   - list price must be between $0.05 and $200 USD
 *   - revenue share is paid on the LIST price, not a discounted price
 *   - default partner share is 52% (i.e. Google keeps 48%); 70% available for
 *     partners who accepted the 2019 TOS in eligible countries
 */

const MIN_PRICE = 0.05;
const MAX_PRICE = 200;
const DEFAULT_SHARE = 52; // partner net share in percent (Google GP = 48%)

const argv = process.argv.slice(2);

function usage() {
  console.log(
    [
      "Google Play Books price calculator (USD)",
      "",
      "Usage:",
      "  node price.js <price>              Break down a list price into GP cut and net",
      "  node price.js --table [from] [to]   Print the charm-price ladder (default 0.99-19.99)",
      "  node price.js --target <net>        Smallest charm price earning at least <net> USD",
      "  node price.js --share <pct> [...]   Partner net share in percent (default 52 => Google GP 48%)",
      "  node price.js --help                Show this help",
      "",
      "Examples:",
      "  node price.js 3.99",
      "  node price.js --target 3",
      "  node price.js --table 0.99 9.99",
      "  node price.js --share 70 3.99",
    ].join("\n")
  );
}

function money(n) {
  return "$" + n.toFixed(2);
}

function exact(n) {
  return "$" + n.toFixed(4);
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

function validatePrice(price, share) {
  if (!Number.isFinite(price)) return "price must be a number";
  if (price + 1e-9 < MIN_PRICE || price - 1e-9 > MAX_PRICE) {
    return `list price must be between $${MIN_PRICE.toFixed(2)} and $${MAX_PRICE.toFixed(2)} USD (got ${money(price)})`;
  }
  if (!Number.isFinite(share) || share <= 0 || share >= 100) {
    return "share must be a percentage between 1 and 99 (e.g. 52 or 70)";
  }
  return null;
}

function breakdown(price, share) {
  const err = validatePrice(price, share);
  if (err) {
    console.error("Error: " + err);
    process.exit(1);
  }
  const net = price * (share / 100);
  const gp = price - net;
  console.log("Google Play Books price breakdown (USD)");
  console.log("---------------------------------------");
  console.log(`List price            : ${money(price)}`);
  console.log(`Google cut (GP)       : ${money(round2(gp))}  (${exact(gp)}, ${(100 - share).toFixed(0)}%)`);
  console.log(`Your net revenue      : ${money(round2(net))}  (${exact(net)}, ${share.toFixed(0)}%)`);
  console.log("");
  console.log(`Effective prices row  : list ${money(price)} -> your revenue ${money(round2(net))}`);
}

function charmCandidates(from, to) {
  const out = [];
  for (let whole = 0; whole <= Math.floor(to); whole++) {
    for (const ending of [".00", ".49", ".99"]) {
      const price = Number(`${whole}${ending}`);
      if (price + 1e-9 >= from && price - 1e-9 <= to && price >= MIN_PRICE) out.push(price);
    }
  }
  return out;
}

function ladder(from, to, share) {
  const rows = charmCandidates(from, to);
  console.log(`Price ladder (partner share ${share.toFixed(0)}% / Google GP ${(100 - share).toFixed(0)}%)`);
  console.log("List price   Google GP   Your net");
  console.log("---------    ---------    --------");
  for (const price of rows) {
    const net = price * (share / 100);
    console.log(
      `${money(price).padEnd(12)}${money(round2(price - net)).padEnd(11)}${money(round2(net))}`
    );
  }
}

function target(netTarget, share) {
  if (!Number.isFinite(netTarget) || netTarget <= 0) {
    console.error("Error: --target needs a positive number of USD");
    process.exit(1);
  }
  const candidates = charmCandidates(MIN_PRICE, MAX_PRICE);
  const hit = candidates.find((p) => p * (share / 100) >= netTarget - 1e-9);
  if (!hit) {
    console.error(`Error: no charm price up to $${MAX_PRICE} earns ${money(netTarget)} net at ${share}%`);
    process.exit(1);
  }
  console.log(`Smallest charm price earning at least ${money(netTarget)} net (share ${share.toFixed(0)}%)`);
  console.log("");
  const idx = candidates.indexOf(hit);
  const options = candidates.slice(Math.max(0, idx - 1), idx + 3);
  console.log("List price   Google GP   Your net    Note");
  console.log("---------    ---------    --------    ----");
  for (const price of options) {
    const net = price * (share / 100);
    const note =
      price === hit
        ? "<- minimum"
        : net - netTarget >= 1
          ? "comfortable margin"
          : "";
    console.log(
      `${money(price).padEnd(12)}${money(round2(price - net)).padEnd(11)}${money(round2(net)).padEnd(12)}${note}`
    );
  }
}

function parseArgs(args) {
  const opts = { share: DEFAULT_SHARE, table: false, help: false, target: null, positional: [] };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--help" || a === "-h") opts.help = true;
    else if (a === "--table") opts.table = true;
    else if (a === "--share") opts.share = Number(args[++i]);
    else if (a === "--target") opts.target = Number(args[++i]);
    else opts.positional.push(a);
  }
  return opts;
}

const opts = parseArgs(argv);

if (opts.help || argv.length === 0) {
  usage();
  process.exit(argv.length === 0 ? 1 : 0);
}

if (opts.table) {
  const from = Number(opts.positional[0] ?? 0.99);
  const to = Number(opts.positional[1] ?? 19.99);
  if (!Number.isFinite(from) || !Number.isFinite(to) || from > to) {
    console.error("Error: --table takes an optional [from] [to] price range, e.g. --table 0.99 9.99");
    process.exit(1);
  }
  ladder(from, to, opts.share);
} else if (opts.target !== null) {
  target(opts.target, opts.share);
} else if (opts.positional.length === 1) {
  breakdown(Number(opts.positional[0]), opts.share);
} else {
  usage();
  process.exit(1);
}
