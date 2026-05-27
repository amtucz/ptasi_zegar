import { readFileSync } from "node:fs";
import { exit } from "node:process";
import { Script } from "node:vm";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const credits = readFileSync(new URL("../dzwieki/CREDITS.txt", import.meta.url), "utf8");
const script = html.match(/<script>([\s\S]*)<\/script>/)?.[1] ?? "";

let scriptParses = false;
try {
  new Script(script);
  scriptParses = true;
} catch (error) {
  console.error(error);
}

const checks = [
  ["main HTML uses UTF-8", html.includes('<meta charset="UTF-8"/>')],
  ["background is loaded from tlo.jpg", html.includes('background:url("tlo.jpg")')],
  ["visitor badge is not embedded", !html.includes("visitorbadge.io") && !html.includes("visit-counter")],
  ["tab buttons expose ARIA roles", (html.match(/role="tab"/g) || []).length === 3],
  ["tab panels expose ARIA roles", (html.match(/role="tabpanel"/g) || []).length === 3],
  ["inline JavaScript parses", scriptParses],
  ["bird timing disclaimer exists", html.includes("Godziny są orientacyjne")],
  ["insect quiet-species note exists", html.includes("Etykieta „cichy”")],
  ["amphibian voice disclaimer exists", html.includes("głosach godowych")],
  ["keyboard handlers exist for list items", html.includes('e.key==="Enter"||e.key===" "')],
  ["risky WAVs are not wired in page data", !html.includes('audioFile:"dzwieki/zaba_trawna') && !html.includes('audioFile:"dzwieki/zaba_jeziorkowa') && !html.includes('audioFile:"dzwieki/ropucha_szara')],
  ["credits mark unattributed WAVs as unused", (credits.match(/NIEUŻYWANE/g) || []).length >= 3],
];

const failed = checks.filter(([, ok]) => !ok);
if (failed.length) {
  for (const [name] of failed) console.error(`FAIL ${name}`);
  exit(1);
}

for (const [name] of checks) console.log(`OK ${name}`);
