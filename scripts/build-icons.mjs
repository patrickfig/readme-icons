// Build script: reads ./icons/*.svg and writes ./src/icons.json
import fs from "node:fs";
import path from "node:path";

const ICONS_DIR = path.resolve("icons");
const OUT = path.resolve("src/icons.json");

const files = fs.readdirSync(ICONS_DIR).filter(f => f.toLowerCase().endsWith(".svg"));
if (files.length === 0) {
  console.error("No SVGs found in ./icons. Add your files (e.g., react.svg) and re-run.");
  process.exit(1);
}

const map = {};
for (const file of files) {
  const id = path.basename(file, ".svg")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9_-]/g, "");
  const svg = fs.readFileSync(path.join(ICONS_DIR, file), "utf8").trim();
  map[id] = svg;
  console.log("Added", id);
}

fs.writeFileSync(OUT, JSON.stringify(map, null, 2), "utf8");
console.log("Wrote", OUT, "with", Object.keys(map).length, "icons.");
