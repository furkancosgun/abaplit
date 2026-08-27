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

const distPath = path.resolve(rootDir, "dist");
if (!fs.existsSync(distPath) || !fs.existsSync(path.resolve(distPath, "Component.js"))) {
  console.log("⚙️  Building UI5 frontend...");
  execSync("npm run build:ui", { cwd: rootDir, stdio: "inherit" });
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

// Register z2fiori_cl_lp_handler shim dynamically so src/ remains untouched
if (!abap.Classes["Z2FIORI_CL_LP_HANDLER"]) {
  class z2fiori_cl_lp_handler {
    async constructor_() {
      return this;
    }
    async if_http_extension$handle_request(INPUT) {
      await abap.Classes["Z2FIORI_CL_HTTP_HANDLER"].factory_onprem({ server: INPUT.server });
    }
  }
  abap.Classes["Z2FIORI_CL_LP_HANDLER"] = z2fiori_cl_lp_handler;
}

const PORT = parseInt(process.env.PORT, 10) || 3000;
const HANDLER_CLASS = process.env.HANDLER_CLASS || "Z2FIORI_CL_LP_HANDLER";

const app = express();
app.disable("x-powered-by");
app.set("etag", false);

// 1. Root redirect if app query is missing
app.get("/", (req, res, next) => {
  if (!req.query.app && !req.query["app"]) {
    return res.redirect("/?app=z2fiori_cl_demo_002");
  }
  next();
});

// 2. Static UI5 Frontend
app.use(express.static(distPath));

// 3. Raw body parsing for ABAP ICF requests
app.use(express.raw({ type: "*/*", limit: "10mb" }));

// 4. ICF handler route
app.all(/^\/sap\/bc\/(http\/sap\/)?z2fiori/, async (req, res) => {
  if (!req.body) {
    req.body = Buffer.alloc(0);
  }
  try {
    await cl_express_icf_shim.run({
      req,
      res,
      class: HANDLER_CLASS,
      base: new abap.types.String().set("/sap/bc/z2fiori")
    });
  } catch (err) {
    console.error("❌ Error processing ICF request:", err);
    if (!res.headersSent) {
      res.status(500).send("Internal Server Error in ABAP ICF Handler");
    }
  }
});

export const server = app.listen(PORT, () => {
  console.log(`\n=============================================================`);
  console.log(`🚀 abap2fiori Dev Server is RUNNING at http://localhost:${PORT}`);
  console.log(`📡 ICF Backend Handler: ${HANDLER_CLASS.toUpperCase()} -> /sap/bc/z2fiori`);
  console.log(`=============================================================`);
  console.log(`\nReady-to-use Demos:`);
  console.log(`  🔹 Demo 001 (Basic Form & Counter):  http://localhost:${PORT}/?app=z2fiori_cl_demo_001`);
  console.log(`  🔹 Demo 002 (All 6 Popups Showcase): http://localhost:${PORT}/?app=z2fiori_cl_demo_002`);
  console.log(`\n=============================================================\n`);
});

server.on("error", (err) => {
  console.error("❌ Failed to start server:", err.message);
  process.exit(1);
});
