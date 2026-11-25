#!/usr/bin/env node
// Rank blog posts on https://blog.redlinesoft.net against a query.
// Zero dependencies (Node 18+, built-in fetch).
//
// Usage:
//   node rank.mjs "<query>" [--top N] [--md] [--json]
//
//   --top N   number of results to print (default 5)
//   --md      fetch and print the raw Markdown source of the top hit
//   --json    print machine-readable JSON instead of text
//
// Exit codes: 0 = results found, 2 = no matching posts, 3 = network/index error.

const SITE = 'https://blog.redlinesoft.net';
const INDEX_URL = `${SITE}/search.json`;

const args = process.argv.slice(2);
const flags = {
  top: 5,
  md: false,
  json: false,
};
const queryParts = [];

for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--top') {
    const n = Number(args[++i]);
    if (!Number.isInteger(n) || n < 1) {
      console.error('--top requires a positive integer');
      process.exit(1);
    }
    flags.top = n;
  } else if (a === '--md') {
    flags.md = true;
  } else if (a === '--json') {
    flags.json = true;
  } else if (a.startsWith('--')) {
    console.error(`Unknown flag: ${a}`);
    process.exit(1);
  } else {
    queryParts.push(a);
  }
}

const query = queryParts.join(' ').trim();
if (!query) {
  console.error('Usage: node rank.mjs "<query>" [--top N] [--md] [--json]');
  process.exit(1);
}

const normalize = (s) => (s || '').toLowerCase();
const tokenize = (s) => normalize(s).split(/[^a-z0-9+#.]+/).filter(Boolean);

async function fetchText(url) {
  const res = await fetch(url, { headers: { accept: '*/*' } });
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  return res.text();
}

async function main() {
  let posts;
  try {
    const raw = await fetchText(INDEX_URL);
    posts = JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to load index: ${err.message}`);
    console.error(`Fallback: fetch ${SITE}/llms.txt and match titles manually.`);
    process.exitCode = 3;
    return;
  }

  const qTokens = tokenize(query);
  const qNorm = normalize(query);
  const hasPhrase = query.length > 3;

  const scored = posts.map((post) => {
    const title = normalize(post.title);
    const desc = normalize(post.description);
    const tags = (post.tags || []).map(normalize);
    const tagStr = tags.join(' ');
    let score = 0;

    if (hasPhrase && title.includes(qNorm)) score += 50;
    for (const t of qTokens) {
      if (title.includes(t)) score += 10;
      if (tags.some((tag) => tag === t)) score += 8;
      else if (tagStr.includes(t)) score += 4;
      if (desc.includes(t)) score += 3;
    }
    if (qTokens.length > 1 && tags.some((tag) => qTokens.includes(tag))) score += 6;

    return {
      score,
      title: post.title,
      slug: post.slug,
      tags: post.tags || [],
      description: post.description,
      html: `${SITE}/posts/${post.slug}`,
      markdown: `${SITE}/posts/${post.slug}.md`,
    };
  });

  const results = scored
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, flags.top);

  if (results.length === 0) {
    if (flags.json) console.log(JSON.stringify({ query, results: [] }, null, 2));
    else console.error(`No posts matched "${query}". Try fewer/different keywords, or browse ${SITE}/tags`);
    process.exitCode = 2;
    return;
  }

  let topMarkdown = null;
  if (flags.md) {
    try {
      topMarkdown = await fetchText(results[0].markdown);
    } catch (err) {
      console.error(`Could not fetch markdown for top hit: ${err.message}`);
    }
  }

  if (flags.json) {
    console.log(JSON.stringify({ query, results, topMarkdown }, null, 2));
    return;
  }

  console.log(`Query: "${query}" — ${results.length} result(s)\n`);
  results.forEach((r, i) => {
    console.log(`${i + 1}. [${r.score}] ${r.title}`);
    console.log(`   tags: ${r.tags.join(', ') || '-'}`);
    console.log(`   html: ${r.html}`);
    console.log(`   md:   ${r.markdown}`);
    console.log(`   ${r.description}\n`);
  });

  if (flags.md) {
    if (topMarkdown) {
      console.log('--- TOP HIT RAW MARKDOWN ---\n');
      console.log(topMarkdown);
    } else {
      console.log('--- TOP HIT RAW MARKDOWN UNAVAILABLE ---');
    }
  }
}

main().catch((err) => {
  console.error(`Unexpected error: ${err.message}`);
  process.exitCode = 3;
});
