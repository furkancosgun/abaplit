import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");

export function downportDirectory(targetDir = path.join(ROOT_DIR, "build", "standard")) {
  const configPath = path.join(targetDir, "abaplint-downport.json");
  const downportConfig = {
    global: {
      files: "/src/**/*.*",
      noIssues: [
        "/src/vendor/*",
        "z2fiori_cl_xml_view_builder.clas.abap"
      ]
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
      downport: true
    }
  };

  fs.writeFileSync(configPath, JSON.stringify(downportConfig, null, 2), "utf-8");

  try {
    execSync(`npx abaplint --fix "${configPath}"`, { cwd: targetDir, stdio: "inherit" });
  } finally {
    if (fs.existsSync(configPath)) {
      fs.unlinkSync(configPath);
    }
  }
}
