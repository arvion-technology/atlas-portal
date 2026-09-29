#!/usr/bin/env node
/**
 * Turn the static Next export (out/) into the gallery demo (demo/).
 *
 * The exported pages are server-rendered HTML that expects to be served from a
 * domain root. The gallery serves them from a subfolder (and from nested route
 * folders), so every page gets a <base> pointing at the demo root, Next's
 * absolute /_next/ URLs lose their leading slash, internal links become
 * relative, and the hydration scripts are removed. A small vanilla app.js
 * provides the demo's interactions; the real interactions live in the React
 * client components of the Next app.
 */
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const PROJECT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ROOT = resolve(PROJECT, "../..");
const OUT = join(PROJECT, "out");
const DEMO = join(PROJECT, "demo");

if (!existsSync(join(OUT, "index.html"))) {
  console.error("out/index.html is missing. Run npm run build first.");
  process.exit(1);
}

rmSync(DEMO, { recursive: true, force: true });
mkdirSync(DEMO, { recursive: true });
cpSync(OUT, DEMO, { recursive: true });

// The gallery's asset checks expect these files next to every demo. They are not
// loaded by the portal (its theme is paper), but they keep the shared checks and
// screenshot tooling working across projects.
cpSync(join(ROOT, "_factory/brand/arvion.css"), join(DEMO, "arvion.css"));
cpSync(join(ROOT, "_factory/brand/arvion.js"), join(DEMO, "arvion.js"));
cpSync(join(ROOT, "_factory/brand/fonts"), join(DEMO, "fonts"), { recursive: true });

const BANNER = `
  <div class="demo-banner" style="position:fixed;right:16px;bottom:16px;z-index:80;display:flex;align-items:center;gap:10px;padding:8px 14px;border-radius:999px;background:rgba(38,33,24,0.92);color:#f3ecdf;border:1px solid rgba(255,255,255,0.16);backdrop-filter:blur(10px);font:500 12px/1.3 ui-sans-serif,system-ui,sans-serif;box-shadow:0 16px 40px -20px rgba(0,0,0,0.5)">
    <span style="display:grid;place-items:center;width:20px;height:20px;border-radius:6px;background:#f3ecdf;color:#262118;font-weight:700">A</span>
    <span>Arvion Labs</span>
    <span style="width:1px;height:14px;background:rgba(255,255,255,0.24)"></span>
    <a href="https://arvion-technology.github.io/labs/" style="color:#f0c9a8;font-weight:600;text-decoration:none">All projects</a>
    <span style="width:1px;height:14px;background:rgba(255,255,255,0.24)"></span>
    <a href="https://github.com/arvion-technology/atlas-portal" style="color:#f0c9a8;font-weight:600;text-decoration:none">source</a>
  </div>
  <script src="app.js" defer></script>
</body>`;

const HEAD_EXTRA = `<!-- gallery asset hooks: arvion.css, arvion.js, app.js are kept in demo/ for the shared checks -->
    <base href="__BASE__">
    <style>.shot .demo-banner{display:none!important}</style>
    <script>if (location.search.includes("shot=1")) document.documentElement.classList.add("shot");</script>`;

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function depthOf(file) {
  const rel = relative(DEMO, dirname(file));
  if (!rel) return 0;
  return rel.split(sep).filter(Boolean).length;
}

let pages = 0;
for (const file of walk(DEMO)) {
  if (!file.endsWith(".html")) continue;
  const depth = depthOf(file);
  const base = depth === 0 ? "./" : "../".repeat(depth);
  let html = readFileSync(file, "utf8");

  // Hydration is removed on purpose: the gallery has no Next server, and the
  // pages are already complete server-rendered HTML.
  html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  html = html.replace(/<link\b[^>]*\bas="script"[^>]*>/gi, "");

  // Absolute export paths become relative to the demo folder. The <base> tag
  // makes the same relative URL resolve correctly from nested route pages.
  html = html.replaceAll("/_next/", "_next/");
  html = html.replace(/href="\/([^"]*)"/g, (_match, rest) => `href="${rest || "."}"`);

  html = html.replace("<head>", `<head>${HEAD_EXTRA.replace("__BASE__", base)}`);
  html = html.replace("</body>", BANNER);

  // Guard against absolute URLs sneaking back in through future Next versions.
  if (html.includes('"/_next/')) console.warn(`warning: absolute /_next/ path left in ${relative(PROJECT, file)}`);

  writeFileSync(file, html);
  pages += 1;
}

// The interaction mirror and the recorder script travel with the demo.
cpSync(join(PROJECT, "scripts/mirror-app.js"), join(DEMO, "app.js"));
cpSync(join(PROJECT, "scripts/demo-record.json"), join(DEMO, "record.json"));

console.log(`demo/: ${pages} HTML pages, relative assets, scripts removed`);
