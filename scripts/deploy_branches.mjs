import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const ONPREM_BUILD = path.join(ROOT_DIR, "build", "standard");
const CLOUD_BUILD = path.join(ROOT_DIR, "build", "cloud");

function run(cmd, cwd = ROOT_DIR) {
  console.log(`> ${cmd}`);
  return execSync(cmd, { cwd, stdio: "inherit" });
}

function getOutput(cmd, cwd = ROOT_DIR) {
  return execSync(cmd, { cwd, encoding: "utf-8" }).trim();
}

console.log("=== Step 1: Running Master Tests & Lint ===");
run("npm test");

console.log("\n=== Step 2: Building Distribution Packages (with Downport) ===");
run("node scripts/build_dist.mjs");

console.log("\n=== Step 3: Validating Standard (On-Premise 7.02) Syntax ===");
const stdConfigPath = path.join(ONPREM_BUILD, "abaplint-check.json");
fs.writeFileSync(stdConfigPath, JSON.stringify({
  global: {
    files: "/src/**/*.*",
    noIssues: ["/src/vendor/*", "z2fiori_cl_xml_view_builder.clas.abap"]
  },
  dependencies: [
    { folder: "/deps/open-abap-core", files: "/src/**/*.*" }
  ],
  syntax: {
    version: "v702",
    errorNamespace: "^(Z|Y|LCL_|TY_|LIF_)"
  },
  rules: {
    parser_error: true,
    unknown_types: true,
    obsolete_statement: true
  }
}, null, 2), "utf-8");

try {
  run(`npx abaplint "${stdConfigPath}"`, ONPREM_BUILD);
} finally {
  if (fs.existsSync(stdConfigPath)) fs.unlinkSync(stdConfigPath);
}

console.log("\n=== Step 4: Running Unit Tests on Standard (7.02 Downported) Build ===");
const stdTranspilerPath = path.join(ROOT_DIR, ".temp_transpile_std.json");
const stdOutDir = path.join(ROOT_DIR, "output_std");
if (fs.existsSync(stdOutDir)) fs.rmSync(stdOutDir, { recursive: true, force: true });

fs.writeFileSync(stdTranspilerPath, JSON.stringify({
  input_folder: "build/standard/src/",
  output_folder: "output_std/",
  libs: [
    { folder: "/deps/open-abap-core" },
    { folder: "/deps/express-icf-shim" }
  ],
  write_unit_tests: true,
  options: {
    addFilenames: true,
    addCommonJS: true,
    unknownTypes: "compileError"
  }
}, null, 2), "utf-8");

try {
  run(`npx abap_transpile .temp_transpile_std.json`);
  run(`node --expose-gc output_std/index.mjs`);
} finally {
  if (fs.existsSync(stdTranspilerPath)) fs.unlinkSync(stdTranspilerPath);
  if (fs.existsSync(stdOutDir)) fs.rmSync(stdOutDir, { recursive: true, force: true });
}

console.log("\n=== Step 5: Validating Cloud (ABAP Cloud) Syntax ===");
const cldConfigPath = path.join(CLOUD_BUILD, "abaplint-check.json");
fs.writeFileSync(cldConfigPath, JSON.stringify({
  global: {
    files: "/src/**/*.*",
    exclude: ["webapp"],
    noIssues: ["/src/vendor/*", "z2fiori_cl_xml_view_builder.clas.abap"]
  },
  dependencies: [
    { folder: "/deps/open-abap-core", files: "/src/**/*.*" }
  ],
  syntax: {
    version: "Cloud",
    errorNamespace: "^(Z|Y|LCL_|TY_|LIF_)"
  },
  rules: {
    parser_error: true,
    unknown_types: true,
    cloud_types: true,
    obsolete_statement: true
  }
}, null, 2), "utf-8");

try {
  run(`npx abaplint "${cldConfigPath}"`, CLOUD_BUILD);
} finally {
  if (fs.existsSync(cldConfigPath)) fs.unlinkSync(cldConfigPath);
}

console.log("\n=== Step 6: Running Unit Tests on Cloud Build ===");
const cldTranspilerPath = path.join(ROOT_DIR, ".temp_transpile_cld.json");
const cldOutDir = path.join(ROOT_DIR, "output_cld");
if (fs.existsSync(cldOutDir)) fs.rmSync(cldOutDir, { recursive: true, force: true });

fs.writeFileSync(cldTranspilerPath, JSON.stringify({
  input_folder: "build/cloud/src/",
  output_folder: "output_cld/",
  exclude_filter: ["webapp"],
  libs: [
    { folder: "/deps/open-abap-core" },
    { folder: "/deps/express-icf-shim" }
  ],
  write_unit_tests: true,
  options: {
    addFilenames: true,
    addCommonJS: true,
    unknownTypes: "compileError"
  }
}, null, 2), "utf-8");

try {
  run(`npx abap_transpile .temp_transpile_cld.json`);
  run(`node --expose-gc output_cld/index.mjs`);
} finally {
  if (fs.existsSync(cldTranspilerPath)) fs.unlinkSync(cldTranspilerPath);
  if (fs.existsSync(cldOutDir)) fs.rmSync(cldOutDir, { recursive: true, force: true });
}

console.log("\n=== Step 7: Staging and Deploying Branches ===");
run("git add build/standard build/cloud");

const currentCommit = getOutput("git rev-parse --short HEAD");

console.log("\n--- Deploying Standard (On-Premise) Branch ---");
const stdTree = getOutput("git write-tree --prefix=build/standard");
const stdCommit = getOutput(`git commit-tree ${stdTree} -p HEAD -m "deploy(standard): distribution build for ${currentCommit}"`);
run(`git update-ref refs/heads/standard ${stdCommit}`);
run("git push origin standard --force");
console.log(`[abap2fiori] Standard branch deployed (${stdCommit.substring(0, 7)})`);

console.log("\n--- Deploying Cloud Branch ---");
const cldTree = getOutput("git write-tree --prefix=build/cloud");
const cldCommit = getOutput(`git commit-tree ${cldTree} -p HEAD -m "deploy(cloud): distribution build for ${currentCommit}"`);
run(`git update-ref refs/heads/cloud ${cldCommit}`);
run("git push origin cloud --force");
console.log(`[abap2fiori] Cloud branch deployed (${cldCommit.substring(0, 7)})`);

console.log("\n🎉 All tests passed across all branches! Distribution deployed successfully.");
