import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");

export function downportDirectory(targetDir) {
  // Config for downporting via abaplint --fix
  const downportConfig = {
    global: {
      files: `${targetDir}/**/*.*`,
      noIssues: ["**/vendor/*", "**/z2fiori_cl_xml_view_builder.clas.abap"]
    },
    dependencies: [
      {
        folder: "/deps/open-abap-core",
        files: "/src/**/*.*"
      }
    ],
    syntax: {
      version: "v702",
      errorNamespace: "^(Z|Y|LCL_|TY_|LIF_)"
    },
    rules: {
      downport: true,
      parser_error: false
    }
  };

  const configPath = path.join(ROOT_DIR, ".temp_downport_config.json");
  fs.writeFileSync(configPath, JSON.stringify(downportConfig, null, 2), "utf-8");

  try {
    // Run downport fix passes
    for (let i = 0; i < 3; i++) {
      try {
        execSync(`npx abaplint --fix ${configPath}`, { cwd: ROOT_DIR, stdio: "pipe" });
      } catch {
        // abaplint may exit with code 1 if issues remain after pass
      }
    }
  } finally {
    if (fs.existsSync(configPath)) {
      fs.unlinkSync(configPath);
    }
  }
}
