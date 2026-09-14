// One-off link checker: crawls internal links from the homepage and verifies
// every page, static asset and referenced file returns a success status.
const BASE = process.argv[2] ?? "http://localhost:3100";

const seen = new Set();
const queue = ["/"];
const failures = [];
const ok = [];

function resolve(href) {
  if (!href) return null;
  if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) return null;
  if (!href.startsWith("/")) return null;
  // strip query/hash for status check but keep ?example= pages distinct
  return href.split("#")[0];
}

async function check(url) {
  try {
    const res = await fetch(BASE + url, { redirect: "follow" });
    if (!res.ok) failures.push(`${res.status} ${url}`);
    else ok.push(url);
  } catch (e) {
    failures.push(`ERR ${url} (${e.message})`);
  }
}

while (queue.length) {
  const path = queue.shift();
  const checkPath = path.split("?")[0] || "/";
  if (seen.has(checkPath)) continue;
  seen.add(checkPath);

  let html;
  try {
    const res = await fetch(BASE + path);
    if (!res.ok) {
      failures.push(`${res.status} ${path}`);
      continue;
    }
    ok.push(path);
    html = await res.text();
  } catch (e) {
    failures.push(`ERR ${path} (${e.message})`);
    continue;
  }

  // hrefs + src + manifest + og:url etc.
  const attrs = [...html.matchAll(/(?:href|src|content)=["']([^"']+)["']/g)].map((m) => m[1]);
  for (const raw of attrs) {
    const url = resolve(raw);
    if (!url || seen.has(url.split("?")[0])) continue;
    // static assets: just check status, don't crawl
    if (/\.(css|js|png|jpg|svg|ico|webmanifest|json|xml|txt|woff2?)$/.test(url.split("?")[0])) {
      seen.add(url.split("?")[0]);
      await check(url);
    } else {
      queue.push(url);
    }
  }
}

// Explicit known routes sanity check
const known = [
  "/", "/calculators", "/guides", "/about", "/contact", "/privacy", "/terms",
  "/cookies", "/disclaimer", "/calculators/flat-rate-calculator",
  "/calculators/flat-rate-calculator?example=fan-install",
  "/manifest.webmanifest", "/sitemap.xml", "/robots.txt",
];
for (const k of known) if (!seen.has(k.split("?")[0])) await check(k);

console.log(`Checked ${ok.length + failures.length} URLs — ${ok.length} OK, ${failures.length} failed`);
for (const f of failures) console.log("FAIL:", f);
if (failures.length) process.exit(1);
