import express from "express";
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const initPath = path.resolve(rootDir, "output/init.mjs");
if (!fs.existsSync(initPath)) {
  console.log("⚙️  Transpiling ABAP code...");
  execSync("npx abap_transpile abaplint-transpiler.json", { cwd: rootDir, stdio: "inherit" });
}

const { initializeABAP } = await import(pathToFileURL(path.resolve(rootDir, "output/init.mjs")).href);
await initializeABAP();

let cl_express_icf_shim;
try {
  const shimModule = await import(pathToFileURL(path.resolve(rootDir, "output/cl_express_icf_shim.clas.mjs")).href);
  cl_express_icf_shim = shimModule.cl_express_icf_shim;
} catch {
  console.error("❌ Error: cl_express_icf_shim not found in output/. Ensure express-icf-shim is present in deps/.");
  process.exit(1);
}

// Register zcl_abaplit_lp_handler shim dynamically so src/ remains untouched
if (!abap.Classes["ZCL_ABAPLIT_LP_HANDLER"]) {
  class zcl_abaplit_lp_handler {
    async constructor_() {
      return this;
    }
    async if_http_extension$handle_request(INPUT) {
      await abap.Classes["ZCL_ABAPLIT_HTTP_HANDLER"].factory_onprem({ server: INPUT.server });
    }
  }
  abap.Classes["ZCL_ABAPLIT_LP_HANDLER"] = zcl_abaplit_lp_handler;
}

const PORT = parseInt(process.env.PORT, 10) || 3000;
const HANDLER_CLASS = process.env.HANDLER_CLASS || "ZCL_ABAPLIT_LP_HANDLER";

const app = express();
app.disable("x-powered-by");
app.set("etag", false);

// 1. Raw body parsing for ABAP ICF requests
app.use(express.raw({ type: "*/*", limit: "10mb" }));

// 2. ICF handler logic
const handleIcf = async (req, res) => {
  if (!req.body) {
    req.body = Buffer.alloc(0);
  }
  try {
    await cl_express_icf_shim.run({
      req,
      res,
      class: HANDLER_CLASS,
      base: new abap.types.String().set("/sap/bc/abaplit")
    });
  } catch (err) {
    console.error("❌ Error processing ICF request:", err);
    if (!res.headersSent) {
      res.status(500).send("Internal Server Error in ABAP ICF Handler");
    }
  }
};

// 3. ICF handler routes
app.all(/^\/sap\/bc\/(http\/sap\/)?abaplit/, handleIcf);
app.all("/", handleIcf);

export const server = app.listen(PORT, () => {
  console.log(`\n=============================================================`);
  console.log(`🚀 abaplit Dev Server is RUNNING at http://localhost:${PORT}`);
  console.log(`📡 ICF Backend Handler: ${HANDLER_CLASS.toUpperCase()} -> /sap/bc/abaplit`);
  console.log(`=============================================================`);
  console.log(`\nReady-to-use Demos:`);
  console.log(`  🔹 Demo 000 (Hub Dashboard):         http://localhost:${PORT}/?app=zcl_abaplit_demo_000`);
  console.log(`  🔹 Demo 001 (Charts & Analytics):    http://localhost:${PORT}/?app=zcl_abaplit_demo_001`);
  console.log(`  🔹 Demo 002 (Forms & Controls):      http://localhost:${PORT}/?app=zcl_abaplit_demo_002`);
  console.log(`  🔹 Demo 003 (Business DataFrames):   http://localhost:${PORT}/?app=zcl_abaplit_demo_003`);
  console.log(`  🔹 Demo 004 (AI Chat Assistant):    http://localhost:${PORT}/?app=zcl_abaplit_demo_004`);
  console.log(`  🔹 Demo 005 (Tabs & Progress):       http://localhost:${PORT}/?app=zcl_abaplit_demo_005`);
  console.log(`\n=============================================================\n`);
});

server.on("error", (err) => {
  console.error("❌ Failed to start server:", err.message);
  process.exit(1);
});
