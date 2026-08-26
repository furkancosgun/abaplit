import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");

function run(cmd) {
  console.log(`> ${cmd}`);
  return execSync(cmd, { cwd: ROOT_DIR, stdio: "inherit" });
}

function getOutput(cmd) {
  return execSync(cmd, { cwd: ROOT_DIR, encoding: "utf-8" }).trim();
}

console.log("=== Building Distribution Packages ===");
run("node scripts/build_dist.mjs");

console.log("\n=== Staging Distribution Trees ===");
run("git add build/standard build/cloud");

const currentCommit = getOutput("git rev-parse --short HEAD");

console.log("\n=== Deploying Standard (On-Premise) Branch ===");
const stdTree = getOutput("git write-tree --prefix=build/standard");
const stdCommit = getOutput(`git commit-tree ${stdTree} -p HEAD -m "deploy(standard): distribution build for ${currentCommit}"`);
run(`git update-ref refs/heads/standard ${stdCommit}`);
run("git push origin standard --force");
console.log(`[abap2fiori] Standard branch deployed (${stdCommit.substring(0, 7)})`);

console.log("\n=== Deploying Cloud Branch ===");
const cldTree = getOutput("git write-tree --prefix=build/cloud");
const cldCommit = getOutput(`git commit-tree ${cldTree} -p HEAD -m "deploy(cloud): distribution build for ${currentCommit}"`);
run(`git update-ref refs/heads/cloud ${cldCommit}`);
run("git push origin cloud --force");
console.log(`[abap2fiori] Cloud branch deployed (${cldCommit.substring(0, 7)})`);

console.log("\n=== Deployment Complete ===");
