import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const vendorDir = path.join(rootDir, 'src', 'vendor');
const tempCloneDir = path.join(rootDir, '.temp_ajson_clone');

console.log('ğŸ”„ Fetching latest sbcgua/ajson repository...');

if (fs.existsSync(tempCloneDir)) {
  fs.rmSync(tempCloneDir, { recursive: true, force: true });
}

execSync('git clone --depth 1 https://github.com/sbcgua/ajson.git ' + tempCloneDir, { stdio: 'inherit' });

if (!fs.existsSync(vendorDir)) {
  fs.mkdirSync(vendorDir, { recursive: true });
} else {
  const existingFiles = fs.readdirSync(vendorDir);
  for (const file of existingFiles) {
    fs.unlinkSync(path.join(vendorDir, file));
  }
}

const sourceFolders = [
  path.join(tempCloneDir, 'src', 'core'),
  path.join(tempCloneDir, 'src', 'libs')
];

const renameMap = [
  ['zcl_ajson_ref_initializer_lib', 'z2fiori_cl_ajson_ref_init_lib'],
  ['ZCL_AJSON_REF_INITIALIZER_LIB', 'Z2FIORI_CL_AJSON_REF_INIT_LIB'],
  ['zif_ajson_ref_initializer', 'z2fiori_if_ajson_ref_init'],
  ['ZIF_AJSON_REF_INITIALIZER', 'Z2FIORI_IF_AJSON_REF_INIT'],
  ['zcl_ajson', 'z2fiori_cl_ajson'],
  ['zif_ajson', 'z2fiori_if_ajson'],
  ['zcx_ajson', 'z2fiori_cx_ajson'],
  ['ZCL_AJSON', 'Z2FIORI_CL_AJSON'],
  ['ZIF_AJSON', 'Z2FIORI_IF_AJSON'],
  ['ZCX_AJSON', 'Z2FIORI_CX_AJSON']
];

for (const folder of sourceFolders) {
  if (!fs.existsSync(folder)) continue;
  const files = fs.readdirSync(folder);

  for (const file of files) {
    if (file === 'package.devc.xml' || file.includes('.testclasses.')) {
      continue;
    }

    const srcFile = path.join(folder, file);
    let content = fs.readFileSync(srcFile, 'utf8');

    for (const [oldName, newName] of renameMap) {
      content = content.replaceAll(oldName, newName);
    }

    if (file.endsWith('.xml')) {
      content = content.replace(/<WITH_UNIT_TESTS>X<\/WITH_UNIT_TESTS>/g, '');
    }

    // abap2fiori contract: keep struct component names UPPERCASE in JSON output
    if (file.includes('ajson.clas.locals_imp.abap')) {
      content = content.replace(
        /ls_next_prefix-name = to_lower\( <c>-name \)\./g,
        'ls_next_prefix-name = <c>-name.'
      );
    }

    // Fix table expression inside ASSIGN for transpiler compatibility
    if (file.includes('ajson_mapping.clas.locals_imp.abap')) {
      content = content.replace(
        /ASSIGN mt_rename_map\[ KEY by_name\s+from = cv_name \]\s+TO <r>\./g,
        'READ TABLE mt_rename_map WITH KEY by_name COMPONENTS from = cv_name ASSIGNING <r>.'
      );
      content = content.replace(
        /ASSIGN mt_rename_map\[ KEY by_name\s+from = lv_full_path \]\s+TO <r>\./g,
        'READ TABLE mt_rename_map WITH KEY by_name COMPONENTS from = lv_full_path ASSIGNING <r>.'
      );
    }

    let targetFileName = file;
    for (const [oldName, newName] of renameMap) {
      if (targetFileName.startsWith(oldName)) {
        targetFileName = targetFileName.replace(oldName, newName);
        break;
      }
    }

    const destFile = path.join(vendorDir, targetFileName);
    fs.writeFileSync(destFile, content, 'utf8');
  }
}

const devcXml = `<?xml version="1.0" encoding="utf-8"?>
<abapGit version="v1.0.0" serializer="LCL_OBJECT_DEVC" serializer_version="v1.0.0">
 <asx:abap xmlns:asx="http://www.sap.com/abapxml" version="1.0">
  <asx:values>
   <DEVC>
    <CTEXT>abap2fiori - Vendored ajson Library</CTEXT>
   </DEVC>
  </asx:values>
 </asx:abap>
</abapGit>
`;
fs.writeFileSync(path.join(vendorDir, 'package.devc.xml'), devcXml, 'utf8');

fs.rmSync(tempCloneDir, { recursive: true, force: true });
console.log('âœ… ajson successfully pulled and renamed to z2fiori_* in src/vendor/');
