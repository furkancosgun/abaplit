import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");

function run(cmd, cwd = ROOT_DIR) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { stdio: "inherit", cwd });
}

// 1. Frontend typecheck (app/tsconfig.json)
run("npm run typecheck", ROOT_DIR);

// 2. abaplint (all configs) - positional arg is config file (abaplint <config>)
const configs = [
  { file: "abaplint.json", cmd: "npx abaplint" },
  { file: "abaplint-cloud.json", cmd: "npx abaplint abaplint-cloud.json" },
  { file: "abaplint-downport.json", cmd: "npx abaplint abaplint-downport.json" },
];
for (const { file, cmd } of configs) {
  if (fs.existsSync(path.join(ROOT_DIR, file))) {
    try {
      run(cmd, ROOT_DIR);
    } catch (_e) {
      console.error(`[check] abaplint failed for ${file}`);
      process.exit(1);
    }
  }
}

console.log("\n[check] All checks passed");
