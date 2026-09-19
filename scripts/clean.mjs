import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");

const CLEAN_TARGETS = [
  "output",
  "build",
  "dist",
];

for (const target of CLEAN_TARGETS) {
  const fullPath = path.join(ROOT_DIR, target);
  if (fs.existsSync(fullPath)) {
    fs.rmSync(fullPath, { recursive: true, force: true });
    console.log(`[clean] removed ${target}`);
  }
}
console.log("[clean] done");
