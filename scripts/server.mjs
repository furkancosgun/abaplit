import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const initPath = path.resolve(rootDir, "output/init.mjs");
if (!fs.existsSync(initPath)) {
  console.error("âŒ Error: Transpiled ABAP output not found. Please run 'npm run build' first.");
  process.exit(1);
}

const { initializeABAP } = await import(pathToFileURL(path.resolve(rootDir, "output/init.mjs")).href);
await initializeABAP();

let cl_express_icf_shim;
try {
  const shimModule = await import(pathToFileURL(path.resolve(rootDir, "output/cl_express_icf_shim.clas.mjs")).href);
  cl_express_icf_shim = shimModule.cl_express_icf_shim;
} catch {
  console.error("âŒ Error: cl_express_icf_shim not found in output/. Ensure express-icf-shim is present in deps/.");
  process.exit(1);
}

const PORT = parseInt(process.env.PORT, 10) || 3000;
const HANDLER_CLASS = process.env.HANDLER_CLASS || "z2fiori_cl_icf_handler";

const app = express();
app.disable("x-powered-by");
app.set("etag", false);
app.use(express.raw({ type: "*/*", limit: "10mb" }));

const webappDir = path.resolve(rootDir, "app", "webapp");
app.use("/webapp", express.static(webappDir));

app.use(async (req, res) => {
  if (!req.body) {
    req.body = Buffer.alloc(0);
  }
  try {
    await cl_express_icf_shim.run({ req, res, class: HANDLER_CLASS });
  } catch (err) {
    console.error("âŒ Error processing ICF request:", err);
    if (!res.headersSent) {
      res.status(500).send("Internal Server Error in ABAP ICF Handler");
    }
  }
});

export const server = app.listen(PORT, () => {
  console.log(`ğŸš€ abap2fiori ICF Server running on http://localhost:${PORT}`);
  console.log(`ğŸ“¡ Handler Class: ${HANDLER_CLASS.toUpperCase()}`);
});

server.on("error", (err) => {
  console.error("âŒ Failed to start server:", err.message);
  process.exit(1);
});
