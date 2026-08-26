import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const WEBAPP_DIR = path.join(ROOT_DIR, "app", "webapp");
const BUILD_DIR = path.join(ROOT_DIR, "build");
const ONPREM_BUILD = path.join(BUILD_DIR, "standard");
const CLOUD_BUILD = path.join(BUILD_DIR, "cloud");

function getAllFiles(dir, base = "") {
  let results = [];
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

function buildOnprem() {
  const srcDir = path.join(ONPREM_BUILD, "src");
  const backendDir = path.join(srcDir, "backend");
  const frontendDir = path.join(srcDir, "frontend");

  fs.rmSync(ONPREM_BUILD, { recursive: true, force: true });
  fs.mkdirSync(backendDir, { recursive: true });
  fs.mkdirSync(frontendDir, { recursive: true });

  // .abapgit.xml
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

  // package.devc.xml
  const devcRootXml = `<?xml version="1.0" encoding="utf-8"?>
<abapGit version="v1.0.0" serializer="LCL_OBJECT_DEVC" serializer_version="v1.0.0">
 <asx:abap xmlns:asx="http://www.sap.com/abapxml" version="1.0">
  <asx:values>
   <DEVC>
    <CTEXT>abap2fiori Standard Root</CTEXT>
    <PARENTCL></PARENTCL>
   </DEVC>
  </asx:values>
 </asx:abap>
</abapGit>
`;
  fs.writeFileSync(path.join(srcDir, "package.devc.xml"), devcRootXml, "utf-8");

  const devcBackendXml = `<?xml version="1.0" encoding="utf-8"?>
<abapGit version="v1.0.0" serializer="LCL_OBJECT_DEVC" serializer_version="v1.0.0">
 <asx:abap xmlns:asx="http://www.sap.com/abapxml" version="1.0">
  <asx:values>
   <DEVC>
    <CTEXT>abap2fiori Backend</CTEXT>
   </DEVC>
  </asx:values>
 </asx:abap>
</abapGit>
`;
  fs.writeFileSync(path.join(backendDir, "package.devc.xml"), devcBackendXml, "utf-8");

  const devcFrontendXml = `<?xml version="1.0" encoding="utf-8"?>
<abapGit version="v1.0.0" serializer="LCL_OBJECT_DEVC" serializer_version="v1.0.0">
 <asx:abap xmlns:asx="http://www.sap.com/abapxml" version="1.0">
  <asx:values>
   <DEVC>
    <CTEXT>abap2fiori Frontend</CTEXT>
   </DEVC>
  </asx:values>
 </asx:abap>
</abapGit>
`;
  fs.writeFileSync(path.join(frontendDir, "package.devc.xml"), devcFrontendXml, "utf-8");

  // z2fiori_cl_lp_handler
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
  <asx:values>
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
    </ICFHANDLER>
   </ICFHANDLER_TABLE>
  </asx:values>
 </asx:abap>
</abapGit>
`;

  fs.writeFileSync(path.join(backendDir, "z2fiori_cl_lp_handler.clas.abap"), lpHandlerAbap, "utf-8");
  fs.writeFileSync(path.join(backendDir, "z2fiori_cl_lp_handler.clas.xml"), lpHandlerXml, "utf-8");
  fs.writeFileSync(path.join(backendDir, "z2fiori          aba643b150c02b2e28e7a7e17.sicf.xml"), sicfXml, "utf-8");

  // WAPA BSP for Frontend
  const files = getAllFiles(WEBAPP_DIR);
  const pagesXml = [];

  for (const { relPath, fullPath } of files) {
    const pageKey = relPath.toUpperCase();
    const pageName = relPath;
    const wapaFileName = `z2fiori.wapa.${relPath.replace(/\//g, "_-").toLowerCase()}`;
    const outPath = path.join(frontendDir, wapaFileName);

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
  fs.writeFileSync(path.join(frontendDir, "z2fiori.wapa.xml"), wapaXml, "utf-8");
  console.log(`[abap2fiori] Standard (On-Premise) build created in ${ONPREM_BUILD}`);
}

function buildCloud() {
  const srcDir = path.join(CLOUD_BUILD, "src");
  const backendDir = path.join(srcDir, "backend");
  const frontendDir = path.join(srcDir, "frontend");

  fs.rmSync(CLOUD_BUILD, { recursive: true, force: true });
  fs.mkdirSync(backendDir, { recursive: true });
  fs.mkdirSync(frontendDir, { recursive: true });

  // .abapgit.xml
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

  // package.devc.xml
  const devcRootXml = `<?xml version="1.0" encoding="utf-8"?>
<abapGit version="v1.0.0" serializer="LCL_OBJECT_DEVC" serializer_version="v1.0.0">
 <asx:abap xmlns:asx="http://www.sap.com/abapxml" version="1.0">
  <asx:values>
   <DEVC>
    <CTEXT>abap2fiori Cloud Root</CTEXT>
    <PARENTCL></PARENTCL>
   </DEVC>
  </asx:values>
 </asx:abap>
</abapGit>
`;
  fs.writeFileSync(path.join(srcDir, "package.devc.xml"), devcRootXml, "utf-8");

  const devcBackendXml = `<?xml version="1.0" encoding="utf-8"?>
<abapGit version="v1.0.0" serializer="LCL_OBJECT_DEVC" serializer_version="v1.0.0">
 <asx:abap xmlns:asx="http://www.sap.com/abapxml" version="1.0">
  <asx:values>
   <DEVC>
    <CTEXT>abap2fiori Backend</CTEXT>
   </DEVC>
  </asx:values>
 </asx:abap>
</abapGit>
`;
  fs.writeFileSync(path.join(backendDir, "package.devc.xml"), devcBackendXml, "utf-8");

  const devcFrontendXml = `<?xml version="1.0" encoding="utf-8"?>
<abapGit version="v1.0.0" serializer="LCL_OBJECT_DEVC" serializer_version="v1.0.0">
 <asx:abap xmlns:asx="http://www.sap.com/abapxml" version="1.0">
  <asx:values>
   <DEVC>
    <CTEXT>abap2fiori Frontend</CTEXT>
   </DEVC>
  </asx:values>
 </asx:abap>
</abapGit>
`;
  fs.writeFileSync(path.join(frontendDir, "package.devc.xml"), devcFrontendXml, "utf-8");

  // z2fiori_cl_lp_handler (Cloud)
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

  fs.writeFileSync(path.join(backendDir, "z2fiori_cl_lp_handler.clas.abap"), lpHandlerCloudAbap, "utf-8");
  fs.writeFileSync(path.join(backendDir, "z2fiori_cl_lp_handler.clas.xml"), lpHandlerCloudXml, "utf-8");

  // Copy frontend webapp to cloud with URL rewrite in manifest.json
  const cloudWebappDest = path.join(frontendDir, "webapp");
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
