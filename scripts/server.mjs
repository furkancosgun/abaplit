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

// Register zcl_abaplit_lp_handler shim dynamically
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

// JSON body parser for modern API
app.use(express.json({ limit: "10mb" }));

// Serve embedded Streamlit frontend on root
app.get("/", async (req, res) => {
  const distHtml = path.resolve(rootDir, "web/dist/index.html");
  if (fs.existsSync(distHtml)) {
    return res.sendFile(distHtml);
  }
  const AssetsClass = abap.Classes["ZCL_ABAPLIT_WEB_ASSETS"];
  if (AssetsClass) {
    const html = (await AssetsClass.get_html()).get();
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.send(html);
  }
  res.send("abaplit web assets not built. Run: npm run bundle:abap");
});

// Direct REST endpoint for ABAPlit app runner
app.post("/api/run", async (req, res) => {
  try {
    const Runner = abap.Classes["ZCL_ABAPLIT_APP_RUNNER"];
    if (!Runner) {
      return res.status(500).json({ success: false, message: "ZCL_ABAPLIT_APP_RUNNER not found" });
    }

    const httpReq = new abap.types.Structure({
      app: new abap.types.String().set(req.body.app || ""),
      event: new abap.types.String().set(req.body.event || ""),
      event_args: new abap.types.Table(new abap.types.String()),
      check_init: new abap.types.Character(1).set(req.body.check_init ? "X" : " "),
      check_navigated: new abap.types.Character(1).set(req.body.check_navigated ? "X" : " "),
      check_nav_stack: new abap.types.Character(1).set(req.body.check_nav_stack ? "X" : " "),
      state: new abap.types.String().set(typeof req.body.state === "string" ? req.body.state : JSON.stringify(req.body.state || {})),
      nav_prev_arg: new abap.types.String().set(req.body.nav_prev_arg || "")
    });

    if (Array.isArray(req.body.event_args)) {
      for (const arg of req.body.event_args) {
        httpReq.get().event_args.append(new abap.types.String().set(String(arg)));
      }
    }

    const result = await Runner.run({ req: httpReq });
    const resData = result.get();

    res.json({
      success: resData.success.get() === "X",
      app: resData.app.get(),
      view: resData.view.get(),
      state: resData.state.get(),
      message: resData.message.get()
    });
  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Raw body parsing for ABAP ICF requests
app.use(express.raw({ type: "*/*", limit: "10mb" }));

// ICF handler route: /sap/bc/abaplit
app.all(/^\/sap\/bc\/(http\/sap\/)?abaplit/, async (req, res) => {
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
});

export const server = app.listen(PORT, () => {
  console.log(`\n=============================================================`);
  console.log(`🚀 abaplit Dev Server is RUNNING at http://localhost:${PORT}`);
  console.log(`📡 ICF Backend Handler: ${HANDLER_CLASS.toUpperCase()} -> /sap/bc/abaplit`);
  console.log(`📡 Direct REST API: POST http://localhost:${PORT}/api/run`);
  console.log(`=============================================================\n`);
});

server.on("error", (err) => {
  console.error("❌ Failed to start server:", err.message);
  process.exit(1);
});
