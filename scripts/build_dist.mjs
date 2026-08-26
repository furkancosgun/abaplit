import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { downportDirectory } from "./downport.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const SRC_DIR = path.join(ROOT_DIR, "src");
const WEBAPP_DIR = path.join(ROOT_DIR, "app", "webapp");
const BUILD_DIR = path.join(ROOT_DIR, "build");
const ONPREM_BUILD = path.join(BUILD_DIR, "standard");
const CLOUD_BUILD = path.join(BUILD_DIR, "cloud");

function getAllFiles(dir, base = "") {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const relPath = base ? `${base}/${file}` : file;
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(filePath, relPath));
    } else {
      results.push({ relPath, fullPath: filePath });
    }
  }
  return results;
}

function copyDirRecursive(src, dest, transformFile = null) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath, transformFile);
    } else {
      if (transformFile) {
        transformFile(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

function ensureCloudLanguageVersion(xmlContent) {
  if (xmlContent.includes("<ABAP_LANGU_VERSION>")) {
    return xmlContent;
  }
  return xmlContent.replace(
    "</UNICODE>",
    `</UNICODE>\n    <ABAP_LANGU_VERSION>5</ABAP_LANGU_VERSION>`
  );
}

function buildOnprem() {
  const destSrcDir = path.join(ONPREM_BUILD, "src");
  const srvDir = path.join(destSrcDir, "srv");
  const appDir = path.join(destSrcDir, "app");

  fs.rmSync(ONPREM_BUILD, { recursive: true, force: true });
  fs.mkdirSync(srvDir, { recursive: true });
  fs.mkdirSync(appDir, { recursive: true });

  // 1. Copy Core ABAP packages (core, http, vendor)
  for (const folder of ["core", "http", "vendor"]) {
    const sourceFolder = path.join(SRC_DIR, folder);
    const destFolder = path.join(destSrcDir, folder);
    if (fs.existsSync(sourceFolder)) {
      copyDirRecursive(sourceFolder, destFolder);
    }
  }

  // 2. Root .abapgit.xml
  const abapgitXml = `<?xml version="1.0" encoding="utf-8"?>
<asx:abap xmlns:asx="http://www.sap.com/abapxml" version="1.0">
 <asx:values>
  <DATA>
   <NAME>Z2FIORI_STANDARD</NAME>
   <MASTER_LANGUAGE>E</MASTER_LANGUAGE>
   <STARTING_FOLDER>/src/</STARTING_FOLDER>
   <FOLDER_LOGIC>PREFIX</FOLDER_LOGIC>
  </DATA>
 </asx:values>
</asx:abap>
`;
  fs.writeFileSync(path.join(ONPREM_BUILD, ".abapgit.xml"), abapgitXml, "utf-8");

  // 3. package.devc.xml (root)
  const devcRootXml = `<?xml version="1.0" encoding="utf-8"?>
<abapGit version="v1.0.0" serializer="LCL_OBJECT_DEVC" serializer_version="v1.0.0">
 <asx:abap xmlns:asx="http://www.sap.com/abapxml" version="1.0">
  <asx:values>
   <DEVC>
    <CTEXT>abap2fiori Standard Root</CTEXT>
   </DEVC>
  </asx:values>
 </asx:abap>
</abapGit>
`;
  fs.writeFileSync(path.join(destSrcDir, "package.devc.xml"), devcRootXml, "utf-8");

  // 4. package.devc.xml (srv)
  const devcSrvXml = `<?xml version="1.0" encoding="utf-8"?>
<abapGit version="v1.0.0" serializer="LCL_OBJECT_DEVC" serializer_version="v1.0.0">
 <asx:abap xmlns:asx="http://www.sap.com/abapxml" version="1.0">
  <asx:values>
   <DEVC>
    <CTEXT>abap2fiori Service</CTEXT>
   </DEVC>
  </asx:values>
 </asx:abap>
</abapGit>
`;
  fs.writeFileSync(path.join(srvDir, "package.devc.xml"), devcSrvXml, "utf-8");

  // 5. package.devc.xml (app)
  const devcAppXml = `<?xml version="1.0" encoding="utf-8"?>
<abapGit version="v1.0.0" serializer="LCL_OBJECT_DEVC" serializer_version="v1.0.0">
 <asx:abap xmlns:asx="http://www.sap.com/abapxml" version="1.0">
  <asx:values>
   <DEVC>
    <CTEXT>abap2fiori Application</CTEXT>
   </DEVC>
  </asx:values>
 </asx:abap>
</abapGit>
`;
  fs.writeFileSync(path.join(appDir, "package.devc.xml"), devcAppXml, "utf-8");

  // 6. z2fiori_cl_lp_handler (On-Premise)
  const lpHandlerAbap = `CLASS z2fiori_cl_lp_handler DEFINITION
  PUBLIC FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES if_http_extension.
ENDCLASS.


CLASS z2fiori_cl_lp_handler IMPLEMENTATION.
  METHOD if_http_extension~handle_request.
    z2fiori_cl_http_handler=>factory_onprem( server ).
  ENDMETHOD.
ENDCLASS.
`;

  const lpHandlerXml = `<?xml version="1.0" encoding="utf-8"?>
<abapGit version="v1.0.0" serializer="LCL_OBJECT_CLAS" serializer_version="v1.0.0">
 <asx:abap xmlns:asx="http://www.sap.com/abapxml" version="1.0">
  <asx:values>
   <VSEOCLASS>
    <CLSNAME>Z2FIORI_CL_LP_HANDLER</CLSNAME>
    <LANGU>E</LANGU>
    <DESCRIPT>abap2fiori Launchpad HTTP Handler</DESCRIPT>
    <STATE>1</STATE>
    <CLSCCINCL>X</CLSCCINCL>
    <FIXPT>X</FIXPT>
    <UNICODE>X</UNICODE>
   </VSEOCLASS>
  </asx:values>
 </asx:abap>
</abapGit>
`;

  const sicfXml = `<?xml version="1.0" encoding="utf-8"?>
<abapGit version="v1.0.0" serializer="LCL_OBJECT_SICF" serializer_version="v1.0.0">
 <asx:abap xmlns:asx="http://www.sap.com/abapxml" version="1.0">
  <URL>/sap/bc/z2fiori/</URL>
  <ICFSERVICE>
   <ICF_NAME>Z2FIORI</ICF_NAME>
   <ORIG_NAME>z2fiori</ORIG_NAME>
  </ICFSERVICE>
  <ICFDOCU>
   <ICF_NAME>Z2FIORI</ICF_NAME>
   <ICF_LANGU>E</ICF_LANGU>
   <ICF_DOCU>abap2fiori HTTP Service</ICF_DOCU>
  </ICFDOCU>
  <ICFHANDLER_TABLE>
   <ICFHANDLER>
    <ICF_NAME>Z2FIORI</ICF_NAME>
    <ICFORDER>01</ICFORDER>
    <ICFHANDLER>Z2FIORI_CL_LP_HANDLER</ICFHANDLER>
   </ICFHANDLER_TABLE>
  </asx:values>
 </asx:abap>
</abapGit>
`;

  fs.writeFileSync(path.join(srvDir, "z2fiori_cl_lp_handler.clas.abap"), lpHandlerAbap, "utf-8");
  fs.writeFileSync(path.join(srvDir, "z2fiori_cl_lp_handler.clas.xml"), lpHandlerXml, "utf-8");
  const sicfFileName = "z2fiori".padEnd(15, " ") + "aba643b150c02b2e28e7a7e17.sicf.xml";
  fs.writeFileSync(path.join(srvDir, sicfFileName), sicfXml, "utf-8");

  // 7. WAPA BSP for Frontend Application
  const files = getAllFiles(WEBAPP_DIR);
  const pagesXml = [];

  for (const { relPath, fullPath } of files) {
    const pageKey = relPath.toUpperCase();
    const pageName = relPath;
    const wapaFileName = `z2fiori.wapa.${relPath.replace(/\//g, "_-").toLowerCase()}`;
    const outPath = path.join(appDir, wapaFileName);

    let content = fs.readFileSync(fullPath, "utf-8");
    if (relPath === "manifest.json") {
      // Ensure on-premise endpoint
      content = content.replace(/\/sap\/bc\/http\/sap\/z2fiori/g, "/sap/bc/z2fiori");
    }
    fs.writeFileSync(outPath, content, "utf-8");

    pagesXml.push(`    <item>
     <ATTRIBUTES>
      <APPLNAME>Z2FIORI</APPLNAME>
      <PAGEKEY>${pageKey}</PAGEKEY>
      <PAGENAME>${pageName}</PAGENAME>
      <PAGETYPE>X</PAGETYPE>
      <LAYOUTLANGU>E</LAYOUTLANGU>
      <VERSION>A</VERSION>
      <LANGU>E</LANGU>
     </ATTRIBUTES>
    </item>`);
  }

  const wapaXml = `<?xml version="1.0" encoding="utf-8"?>
<abapGit version="v1.0.0" serializer="LCL_OBJECT_WAPA" serializer_version="v1.0.0">
 <asx:abap xmlns:asx="http://www.sap.com/abapxml" version="1.0">
  <asx:values>
   <ATTRIBUTES>
    <APPLNAME>Z2FIORI</APPLNAME>
    <APPLCLAS>/UI5/CL_UI5_BSP_APPLICATION</APPLCLAS>
    <APPLEXT>Z2FIORI</APPLEXT>
    <SECURITY>X</SECURITY>
    <ORIGLANG>E</ORIGLANG>
    <MODIFLANG>E</MODIFLANG>
    <TEXT>abap2fiori UI5 Frontend</TEXT>
   </ATTRIBUTES>
   <PAGES>
${pagesXml.join("\n")}
   </PAGES>
  </asx:values>
 </asx:abap>
</abapGit>
`;
  fs.writeFileSync(path.join(appDir, "z2fiori.wapa.xml"), wapaXml, "utf-8");

  // 8. Frontend BSP & UI5 SICF nodes
  const bspSicfXml = `<?xml version="1.0" encoding="utf-8"?>
<abapGit version="v1.0.0" serializer="LCL_OBJECT_SICF" serializer_version="v1.0.0">
 <asx:abap xmlns:asx="http://www.sap.com/abapxml" version="1.0">
  <URL>/sap/bc/bsp/sap/z2fiori/</URL>
  <ICFSERVICE>
   <ICF_NAME>Z2FIORI</ICF_NAME>
   <ORIG_NAME>z2fiori</ORIG_NAME>
  </ICFSERVICE>
  <ICFDOCU>
   <ICF_NAME>Z2FIORI</ICF_NAME>
   <ICF_LANGU>E</ICF_LANGU>
   <ICF_DOCU>abap2fiori BSP Application</ICF_DOCU>
  </ICFDOCU>
 </asx:abap>
</abapGit>
`;

  const ui5SicfXml = `<?xml version="1.0" encoding="utf-8"?>
<abapGit version="v1.0.0" serializer="LCL_OBJECT_SICF" serializer_version="v1.0.0">
 <asx:abap xmlns:asx="http://www.sap.com/abapxml" version="1.0">
  <URL>/sap/bc/ui5_ui5/sap/z2fiori/</URL>
  <ICFSERVICE>
   <ICF_NAME>Z2FIORI</ICF_NAME>
   <ORIG_NAME>z2fiori</ORIG_NAME>
  </ICFSERVICE>
  <ICFDOCU>
   <ICF_NAME>Z2FIORI</ICF_NAME>
   <ICF_LANGU>E</ICF_LANGU>
   <ICF_DOCU>abap2fiori UI5 Application</ICF_DOCU>
  </ICFDOCU>
 </asx:abap>
</abapGit>
`;

  const bspSicfFileName = "z2fiori".padEnd(15, " ") + "cc3e0011031e2f3f4be478dc5.sicf.xml";
  const ui5SicfFileName = "z2fiori".padEnd(15, " ") + "0ec96042f38e7e75ceadd96a5.sicf.xml";

  fs.writeFileSync(path.join(appDir, bspSicfFileName), bspSicfXml, "utf-8");
  fs.writeFileSync(path.join(appDir, ui5SicfFileName), ui5SicfXml, "utf-8");

  // 9. Downport entire standard ABAP package to 7.02
  downportDirectory(destSrcDir);

  console.log(`[abap2fiori] Standard (On-Premise) build created in ${ONPREM_BUILD}`);
}

function buildCloud() {
  const destSrcDir = path.join(CLOUD_BUILD, "src");
  const srvDir = path.join(destSrcDir, "srv");
  const appDir = path.join(destSrcDir, "app");

  fs.rmSync(CLOUD_BUILD, { recursive: true, force: true });
  fs.mkdirSync(srvDir, { recursive: true });
  fs.mkdirSync(appDir, { recursive: true });

  // 1. Copy Core ABAP packages (core, http, vendor) with Cloud language version
  for (const folder of ["core", "http", "vendor"]) {
    const sourceFolder = path.join(SRC_DIR, folder);
    const destFolder = path.join(destSrcDir, folder);
    if (fs.existsSync(sourceFolder)) {
      copyDirRecursive(sourceFolder, destFolder, (srcFile, destFile) => {
        let content = fs.readFileSync(srcFile, "utf-8");
        if (srcFile.endsWith(".clas.xml")) {
          content = ensureCloudLanguageVersion(content);
        }
        fs.writeFileSync(destFile, content, "utf-8");
      });
    }
  }

  // 2. Root .abapgit.xml
  const abapgitXml = `<?xml version="1.0" encoding="utf-8"?>
<asx:abap xmlns:asx="http://www.sap.com/abapxml" version="1.0">
 <asx:values>
  <DATA>
   <NAME>Z2FIORI_CLOUD</NAME>
   <MASTER_LANGUAGE>E</MASTER_LANGUAGE>
   <STARTING_FOLDER>/src/</STARTING_FOLDER>
   <FOLDER_LOGIC>PREFIX</FOLDER_LOGIC>
  </DATA>
 </asx:values>
</asx:abap>
`;
  fs.writeFileSync(path.join(CLOUD_BUILD, ".abapgit.xml"), abapgitXml, "utf-8");

  // 3. package.devc.xml (root)
  const devcRootXml = `<?xml version="1.0" encoding="utf-8"?>
<abapGit version="v1.0.0" serializer="LCL_OBJECT_DEVC" serializer_version="v1.0.0">
 <asx:abap xmlns:asx="http://www.sap.com/abapxml" version="1.0">
  <asx:values>
   <DEVC>
    <CTEXT>abap2fiori Cloud Root</CTEXT>
   </DEVC>
  </asx:values>
 </asx:abap>
</abapGit>
`;
  fs.writeFileSync(path.join(destSrcDir, "package.devc.xml"), devcRootXml, "utf-8");

  // 4. package.devc.xml (srv)
  const devcSrvXml = `<?xml version="1.0" encoding="utf-8"?>
<abapGit version="v1.0.0" serializer="LCL_OBJECT_DEVC" serializer_version="v1.0.0">
 <asx:abap xmlns:asx="http://www.sap.com/abapxml" version="1.0">
  <asx:values>
   <DEVC>
    <CTEXT>abap2fiori Service</CTEXT>
   </DEVC>
  </asx:values>
 </asx:abap>
</abapGit>
`;
  fs.writeFileSync(path.join(srvDir, "package.devc.xml"), devcSrvXml, "utf-8");

  // Note: No package.devc.xml under app/ for Cloud distribution.

  // 5. z2fiori_cl_lp_handler (Cloud)
  const lpHandlerCloudAbap = `CLASS z2fiori_cl_lp_handler DEFINITION
  PUBLIC FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES if_http_service_extension.
ENDCLASS.


CLASS z2fiori_cl_lp_handler IMPLEMENTATION.
  METHOD if_http_service_extension~handle_request.
    z2fiori_cl_http_handler=>factory_cloud( request  = request
                                            response = response ).
  ENDMETHOD.
ENDCLASS.
`;

  const lpHandlerCloudXml = `<?xml version="1.0" encoding="utf-8"?>
<abapGit version="v1.0.0" serializer="LCL_OBJECT_CLAS" serializer_version="v1.0.0">
 <asx:abap xmlns:asx="http://www.sap.com/abapxml" version="1.0">
  <asx:values>
   <VSEOCLASS>
    <CLSNAME>Z2FIORI_CL_LP_HANDLER</CLSNAME>
    <LANGU>E</LANGU>
    <DESCRIPT>abap2fiori Cloud HTTP Handler</DESCRIPT>
    <STATE>1</STATE>
    <CLSCCINCL>X</CLSCCINCL>
    <FIXPT>X</FIXPT>
    <UNICODE>X</UNICODE>
    <WITH_UNIT_TESTS>X</WITH_UNIT_TESTS>
    <ABAP_LANGU_VERSION>5</ABAP_LANGU_VERSION>
   </VSEOCLASS>
  </asx:values>
 </asx:abap>
</abapGit>
`;

  fs.writeFileSync(path.join(srvDir, "z2fiori_cl_lp_handler.clas.abap"), lpHandlerCloudAbap, "utf-8");
  fs.writeFileSync(path.join(srvDir, "z2fiori_cl_lp_handler.clas.xml"), lpHandlerCloudXml, "utf-8");

  // 6. Copy frontend webapp to cloud with URL rewrite in manifest.json
  const cloudWebappDest = path.join(appDir, "webapp");
  copyDirRecursive(WEBAPP_DIR, cloudWebappDest, (src, dest) => {
    let content = fs.readFileSync(src, "utf-8");
    if (src.endsWith("manifest.json")) {
      // Rewrite endpoint to Cloud HTTP Service path
      content = content.replace(/\/sap\/bc\/z2fiori/g, "/sap/bc/http/sap/z2fiori");
    }
    fs.writeFileSync(dest, content, "utf-8");
  });

  console.log(`[abap2fiori] Cloud build created in ${CLOUD_BUILD}`);
}

// Clean previous result/dist directories
if (fs.existsSync(path.join(ROOT_DIR, "result"))) {
  fs.rmSync(path.join(ROOT_DIR, "result"), { recursive: true, force: true });
}
if (fs.existsSync(path.join(ROOT_DIR, "dist"))) {
  fs.rmSync(path.join(ROOT_DIR, "dist"), { recursive: true, force: true });
}

buildOnprem();
buildCloud();
