import { execSync } from "node:child_process";
import fs from "node:fs";

function run(cmd, cwd = process.cwd()) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { stdio: "inherit", cwd });
}

const root = new URL("..", import.meta.url).pathname.replace(/\/$/, "");

// 1. Frontend typecheck
run("npm run ts-typecheck", `${root}/app`);

// 2. UI5 build (dry-run)
run("npm run build", `${root}/app`);

// 3. abaplint (all configs)
const configs = ["abaplint.json", "abaplint-cloud.json", "abaplint-downport.json"];
for (const cfg of configs) {
  if (fs.existsSync(`${root}/${cfg}`)) {
    try {
      run(`npx abaplint --config ${cfg}`, root);
    } catch (e) {
      console.error(`abaplint failed for ${cfg}`);
      process.exit(1);
    }
  }
}

console.log("\n[check] All checks passed");
