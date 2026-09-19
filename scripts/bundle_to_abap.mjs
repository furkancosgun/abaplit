import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const webDir = path.join(rootDir, 'web');
const distHtmlPath = path.join(webDir, 'dist', 'index.html');
const abapClassPath = path.join(rootDir, 'src', 'http', 'zcl_abaplit_web_assets.clas.abap');
const abapClassXmlPath = path.join(rootDir, 'src', 'http', 'zcl_abaplit_web_assets.clas.xml');

console.log('📦 Building web frontend with Vite SingleFile...');
execSync('npm run build', { cwd: webDir, stdio: 'inherit' });

if (!fs.existsSync(distHtmlPath)) {
  console.error('❌ Error: web/dist/index.html not found after build.');
  process.exit(1);
}

console.log('🔄 Encoding HTML to Base64 and embedding into zcl_abaplit_web_assets.clas.abap...');
const htmlContent = fs.readFileSync(distHtmlPath, 'utf8');
const base64Content = Buffer.from(htmlContent, 'utf8').toString('base64');

// Split base64 into safe chunks (180 chars each, pure alphanumeric)
const CHUNK_SIZE = 180;
const chunks = [];
for (let i = 0; i < base64Content.length; i += CHUNK_SIZE) {
  chunks.push(base64Content.substring(i, i + CHUNK_SIZE));
}

let abapLines = [];
abapLines.push('CLASS zcl_abaplit_web_assets DEFINITION');
abapLines.push('  PUBLIC FINAL');
abapLines.push('  CREATE PRIVATE.');
abapLines.push('');
abapLines.push('  PUBLIC SECTION.');
abapLines.push('    CLASS-METHODS get_html');
abapLines.push('      RETURNING');
abapLines.push('        VALUE(result) TYPE string.');
abapLines.push('ENDCLASS.');
abapLines.push('');
abapLines.push('CLASS zcl_abaplit_web_assets IMPLEMENTATION.');
abapLines.push('  METHOD get_html.');
abapLines.push('    DATA lt_b64 TYPE string_table.');
abapLines.push('');

for (const chunk of chunks) {
  abapLines.push(`    APPEND '${chunk}' TO lt_b64.`);
}

abapLines.push('');
abapLines.push('    DATA(lv_b64) = concat_lines_of( lt_b64 ).');
abapLines.push('    result = zcl_abaplit_util=>base64_to_string( lv_b64 ).');
abapLines.push('  ENDMETHOD.');
abapLines.push('ENDCLASS.');

fs.writeFileSync(abapClassPath, abapLines.join('\n'), 'utf8');

const xmlContent = `<?xml version="1.0" encoding="utf-8"?>
<abapGit version="v1.0.0" serializer="LCL_OBJECT_CLAS" serializer_version="v1.0.0">
 <asx:abap xmlns:asx="http://www.sap.com/abapxml" version="1.0">
  <asx:values>
   <VSEOCLASS>
    <CLSNAME>ZCL_ABAPLIT_WEB_ASSETS</CLSNAME>
    <LANGU>E</LANGU>
    <DESCRIPT>abaplit - Embedded Single-Class Streamlit UI Bundle</DESCRIPT>
    <STATE>1</STATE>
    <CLSCCINCL>X</CLSCCINCL>
    <FIXPT>X</FIXPT>
    <UNICODE>X</UNICODE>
   </VSEOCLASS>
  </asx:values>
 </asx:abap>
</abapGit>
`;
fs.writeFileSync(abapClassXmlPath, xmlContent, 'utf8');

console.log(`✅ Success! Web UI embedded into ${abapClassPath} (${chunks.length} base64 chunks)`);
