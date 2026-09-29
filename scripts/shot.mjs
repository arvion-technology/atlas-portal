#!/usr/bin/env node
// Screenshot the exported demo with headless Chromium.
//   node scripts/shot.mjs [width] [height] [output] [page]
// `page` is a path under demo/, e.g. invoices/inv-1001/.
import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { createServer as createNetServer } from "node:net";

const width = Number(process.argv[2] || 1440);
const height = Number(process.argv[3] || 900);
const out = process.argv[4] || "docs/screenshot.png";
const page = (process.argv[5] || "").replace(/^#/, "").replace(/^\/+/, "");
mkdirSync("docs", { recursive: true });

const chromium = ["chromium", "chromium-browser", "google-chrome"].find((bin) =>
  spawnSync("which", [bin], { stdio: "ignore" }).status === 0);
if (!chromium) { console.error("chromium not found"); process.exit(1); }

const port = await new Promise((resolve, reject) => {
  const probe = createNetServer();
  probe.on("error", reject);
  probe.listen(0, "127.0.0.1", () => {
    const assigned = probe.address().port;
    probe.close(() => resolve(assigned));
  });
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const server = spawn(process.execPath, ["scripts/serve.mjs", ".", String(port)], { stdio: "ignore" });
let ready = false;
for (let attempt = 0; attempt < 60 && !ready; attempt += 1) {
  try {
    const response = await fetch(`http://127.0.0.1:${port}/demo/index.html`);
    ready = response.ok;
  } catch { /* starting */ }
  if (!ready) await sleep(100);
}
if (!ready) {
  server.kill();
  console.error("demo server did not start");
  process.exit(1);
}

const route = page ? `${page.replace(/\/?$/, "/")}index.html` : "index.html";
const url = `http://127.0.0.1:${port}/demo/${route}?shot=1`;
const args = [
  "--headless=new", "--disable-gpu", "--no-sandbox", "--hide-scrollbars",
  "--force-device-scale-factor=1", `--window-size=${width},${height}`,
  `--screenshot=${out}`, "--virtual-time-budget=6000",
  `--user-data-dir=/tmp/atlas-chrome-${Date.now()}`,
  url,
];
const code = spawnSync(chromium, args, { stdio: "inherit" }).status;
server.kill();
if (code !== 0) { console.error("screenshot failed"); process.exit(1); }
if (!existsSync(out)) { console.error("no screenshot written"); process.exit(1); }
console.log(`wrote ${out} from ${route}`);
