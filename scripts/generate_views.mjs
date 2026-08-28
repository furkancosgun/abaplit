import fs from 'fs';
import path from 'path';

const CONFIG = {
  libraries: ['sap/m', 'sap/ui/core', 'sap/ui/layout', 'sap/ui/table'],
  nsPrefixMap: {
    'sap.m': '',
    'sap.ui.core': 'core',
    'sap.ui.core.mvc': 'mvc',
    'sap.ui.layout': 'l',
    'sap.ui.layout.form': 'form',
    'sap.ui.table': 'table',
  },
  outputFile: './src/core/z2fiori_cl_xml_view_builder.clas.abap',
};

const IGNORED_EVENTS = new Set([
  'validationSuccess',
  'validationError',
  'parseError',
  'formatError',
  'modelContextChange',
  'validateFieldGroup',
]);

const PREFERRED_PARAMS = ['text', 'value', 'title', 'src', 'state', 'header_text', 'headerText'];

function getPackage(sym) {
  return sym.name.substring(0, sym.name.lastIndexOf('.'));
}

function getSymbolPriority(sym) {
  const pkg = getPackage(sym);
  if (pkg === 'sap.m') return 0;
  if (pkg === 'sap.ui.core') return 10;
  if (pkg === 'sap.ui.layout') return 20;
  if (pkg === 'sap.ui.layout.form') return 30;
  if (pkg === 'sap.ui.table') return 40;
  if (pkg.startsWith('sap.m.')) return 100 + pkg.split('.').length;
  if (pkg.startsWith('sap.ui.core.')) return 200 + pkg.split('.').length;
  return 500;
}

function toSnakeCase(str) {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_/, '');
}

function sanitizeParamName(name) {
  const snake = toSnakeCase(name);
  return snake.length > 30 ? snake.substring(0, 30) : snake;
}

function cleanDoc(str) {
  if (!str) return '';
  return str
    .replace(/<[^>]+>/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/{@link\s+[^}\s]+\s+([^}]+)}/g, '$1')
    .replace(/{@link\s+([^}]+)}/g, '$1')
    .replace(/{@[^\}]*\}/g, ' ')
    .replace(/[{}@#]/g, ' ')
    .replace(/topic:[a-f0-9]+\s*/gi, ' ')
    .replace(/module:/g, ' ')
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function wrapText(text, width = 75) {
  if (!text) return [''];
  const words = text.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    const candidate = cur ? `${cur} ${w}` : w;
    if (candidate.length > width) {
      if (cur) lines.push(cur);
      if (w.length > width) {
        for (let i = 0; i < w.length; i += width) lines.push(w.slice(i, i + width));
        cur = '';
      } else {
        cur = w;
      }
    } else {
      cur = candidate;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function formatParamDoc(paramName, meta = {}) {
  const padName = paramName.padEnd(28);
  const typeStr = meta.type ? `(${meta.type}) ` : '';
  const rawDesc = meta.description ? cleanDoc(meta.description) : '';
  const defaultStr =
    meta.defaultValue !== undefined && meta.defaultValue !== null && meta.defaultValue !== ''
      ? ` Default: ${cleanDoc(String(meta.defaultValue))}.`
      : '';
  const full = `${typeStr}${rawDesc}${defaultStr}`.trim().replace(/\s+/g, ' ');
  if (!full) return `    "! @parameter ${padName} |\n`;
  const chunks = wrapText(full, 75);
  const continuationIndent = '    "!                         ';
  let out = `    "! @parameter ${padName} | ${chunks[0]}\n`;
  for (let i = 1; i < chunks.length; i++) {
    out += `${continuationIndent}${chunks[i]}\n`;
  }
  return out;
}

function getInheritedFeatures(sym, symbolMap) {
  const propMap = new Map();
  const eventMap = new Map();
  const aggMap = new Map();
  let defaultAggregation = null;
  let current = sym;
  while (current) {
    const ui5 = current['ui5-metadata'] || {};
    if (!defaultAggregation && ui5.defaultAggregation) {
      defaultAggregation = ui5.defaultAggregation;
    }
    const props = [...(ui5.properties || []), ...(current.properties || [])];
    const events = [...(ui5.events || []), ...(current.events || [])];
    const aggs = [...(ui5.aggregations || []), ...(current.aggregations || [])];
    props.forEach((p) => {
      if (p?.name && !propMap.has(p.name) && !p.deprecated) propMap.set(p.name, p);
    });
    events.forEach((e) => {
      if (e?.name && !eventMap.has(e.name) && !e.deprecated && !IGNORED_EVENTS.has(e.name)) {
        eventMap.set(e.name, e);
      }
    });
    aggs.forEach((a) => {
      if (a?.name && !aggMap.has(a.name) && !a.deprecated) aggMap.set(a.name, a);
    });
    if (current.extends && symbolMap.has(current.extends)) {
      current = symbolMap.get(current.extends);
    } else {
      break;
    }
  }
  return {
    properties: [...propMap.values()],
    events: [...eventMap.values()],
    aggregations: [...aggMap.values()],
    defaultAggregation,
  };
}

function isUI5Element(sym, symbolMap) {
  if (sym.name === 'sap.ui.core.Element' || sym.name === 'sap.ui.core.Control') return true;
  let cur = sym;
  while (cur && cur.extends) {
    if (
      cur.extends === 'sap.ui.core.Element' ||
      cur.extends === 'sap.ui.core.Control' ||
      cur.extends === 'sap.ui.core.ComponentContainer'
    ) {
      return true;
    }
    if (symbolMap.has(cur.extends)) cur = symbolMap.get(cur.extends);
    else break;
  }
  return false;
}

async function fetchSymbols() {
  const allSymbols = [];
  const symbolMap = new Map();
  for (const lib of CONFIG.libraries) {
    const url = `https://ui5.sap.com/test-resources/${lib}/designtime/api.json`;
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const data = await res.json();
      (data.symbols || []).forEach((s) => {
        if (s.kind === 'class') {
          allSymbols.push(s);
          symbolMap.set(s.name, s);
        }
      });
    } catch (err) {
      console.warn(`Failed ${lib}: ${err.message}`);
    }
  }
  return { allSymbols, symbolMap };
}

function getAllowedNsTokens() {
  const seen = new Set();
  const tokens = [];
  for (const prefix of Object.values(CONFIG.nsPrefixMap)) {
    const t = prefix === '' ? "''" : `'${prefix}'`;
    if (!seen.has(t)) {
      seen.add(t);
      tokens.push(t);
    }
  }
  return tokens.join(', ');
}

function getNsLegend() {
  const inv = new Map();
  for (const [pkg, prefix] of Object.entries(CONFIG.nsPrefixMap)) {
    const key = prefix === '' ? "''" : `'${prefix}'`;
    if (!inv.has(key)) inv.set(key, []);
    inv.get(key).push(pkg);
  }
  return [...inv.entries()].map(([tok, pkgs]) => `${tok} = ${pkgs.join('/')}`).join(', ');
}

function buildNsDescriptionForDuplicate(list) {
  const allowed = getAllowedNsTokens();
  const hints = list
    .map((e) => {
      if (e.type === 'view') return `${e.sym.name} ('${e.defaultNs}')`;
      return `aggregation:${e.aggName} ('')`;
    })
    .join(' | ');
  return `Namespace prefix. Allowed ${allowed} ('' is sap.m default). Variants: ${hints}. Pass prefix directly.`;
}

function buildAttributeLine(rawName, safeName, meta) {
  if (meta.type === 'boolean') {
    return `      mo_builder->a( n = '${rawName}' v = boolean( ${safeName} ) ).\n`;
  }
  return `      mo_builder->a( n = '${rawName}' v = ${safeName} ).\n`;
}

function buildMethodHeaderDoc(sym) {
  let doc = `    "! <p class="shorttext synchronized" lang="en">${sym.name}</p>\n`;
  doc += `    "! https://ui5.sap.com/#/api/${sym.name}\n`;
  if (sym.description) {
    const d = cleanDoc(sym.description);
    if (d) {
      const lines = wrapText(d, 80);
      for (const l of lines) doc += `    "! ${l}\n`;
    }
  }
  return doc;
}

function resolvePreferredParam(paramMap, isContainer, sym, symbolMap) {
  for (const cand of PREFERRED_PARAMS) {
    const safe = sanitizeParamName(cand);
    if (paramMap.has(cand) || paramMap.has(safe)) return safe;
  }
  if (isContainer) {
    const { defaultAggregation } = getInheritedFeatures(sym, symbolMap);
    if (defaultAggregation) {
      const safe = sanitizeParamName(defaultAggregation);
      if (paramMap.has(defaultAggregation)) return safe;
    }
  }
  return null;
}

async function generate() {
  console.log('Fetching UI5 api.json metadata...');
  const { allSymbols, symbolMap } = await fetchSymbols();
  allSymbols.sort((a, b) => getSymbolPriority(a) - getSymbolPriority(b));

  const baseMap = new Map();
  const allAggs = new Set();

  for (const sym of allSymbols) {
    if (sym.name.includes('.smart') || sym.name.includes('.internal.') || sym.abstract) continue;
    if (!isUI5Element(sym, symbolMap)) continue;

    const fullPkg = getPackage(sym);
    const truncated = (() => {
      const s = toSnakeCase(sym.basename);
      return s.length > 30 ? s.substring(0, 30) : s;
    })();

    const { properties, events, aggregations, defaultAggregation } = getInheritedFeatures(sym, symbolMap);

    aggregations
      .filter((a) => a?.name && (!a.visibility || a.visibility === 'public') && !a.name.startsWith('_'))
      .forEach((a) => allAggs.add(a.name));

    const defaultNs = CONFIG.nsPrefixMap[fullPkg] ?? '';
    const isContainer = Boolean(defaultAggregation && !defaultAggregation.startsWith('_'));

    const paramMap = new Map();
    paramMap.set('id', { type: 'string', description: 'Unique control identifier' });
    paramMap.set('class', { type: 'string', description: 'CSS class names' });

    properties
      .filter((p) => !p.visibility || p.visibility === 'public')
      .forEach((p) => paramMap.set(p.name, { ...p, type: p.type || 'string' }));

    aggregations
      .filter((a) => a?.name && (!a.visibility || a.visibility === 'public') && !a.name.startsWith('_'))
      .forEach((a) => {
        if (!paramMap.has(a.name)) paramMap.set(a.name, { ...a, type: 'aggregation' });
      });

    events
      .filter((e) => !e.visibility || e.visibility === 'public')
      .forEach((e) => paramMap.set(e.name, { ...e, type: 'event' }));

    if (!baseMap.has(truncated)) baseMap.set(truncated, []);
    baseMap.get(truncated).push({
      type: 'view',
      sym,
      fullPkg,
      basename: sym.basename,
      baseMethodName: truncated,
      defaultNs,
      isContainer,
      paramMap,
    });
  }

  for (const rawAgg of [...allAggs].sort()) {
    const base = (() => {
      const s = toSnakeCase(rawAgg);
      return s.length > 30 ? s.substring(0, 30) : s;
    })();
    if (!baseMap.has(base)) baseMap.set(base, []);
    baseMap.get(base).push({
      type: 'aggregation',
      sym: null,
      fullPkg: '_agg',
      basename: rawAgg,
      baseMethodName: base,
      defaultNs: '',
      isContainer: false,
      paramMap: new Map(),
      aggName: rawAgg,
    });
  }

  let methodsDef = '';
  let methodsImpl = '';
  const registered = new Set();

  for (const [base, list] of [...baseMap.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    if (list.length === 1) {
      const entry = list[0];

      if (entry.type === 'aggregation') {
        const name = entry.baseMethodName;
        if (registered.has(name)) continue;
        registered.add(name);
        let doc = `    "! <p class="shorttext synchronized" lang="en">Aggregation: ${entry.aggName}</p>\n`;
        doc += `    "! Slot / child aggregation: <${entry.aggName}>\n`;
        doc += `    "! @parameter result                       | (REF TO z2fiori_cl_xml_view_builder) Reference to builder\n`;
        methodsDef += `${doc}    METHODS ${name}\n      RETURNING\n        VALUE(result) TYPE REF TO z2fiori_cl_xml_view_builder.\n\n`;
        methodsImpl += `  METHOD ${name}.\n    mo_builder = mo_builder->ele( n = '${entry.aggName}' ).\n    result = me.\n  ENDMETHOD.\n\n`;
        continue;
      }

      const name = entry.baseMethodName;
      if (registered.has(name)) continue;
      registered.add(name);

      let paramDefs = '';
      let paramDoc = '';
      let delegate = '';

      for (const [raw, meta] of entry.paramMap.entries()) {
        const safe = sanitizeParamName(raw);
        paramDefs += `        ${safe.padEnd(28)} TYPE clike OPTIONAL\n`;
        paramDoc += formatParamDoc(safe, meta);
        delegate += `    IF ${safe} IS SUPPLIED.\n`;
        delegate += buildAttributeLine(raw, safe, meta);
        delegate += `    ENDIF.\n`;
      }

      let doc = buildMethodHeaderDoc(entry.sym);
      doc += paramDoc;
      doc += `    "! @parameter result                       | (REF TO z2fiori_cl_xml_view_builder) Reference to builder\n`;

      const pref = resolvePreferredParam(entry.paramMap, entry.isContainer, entry.sym, symbolMap);
      const prefStr = pref ? `        PREFERRED PARAMETER ${pref}\n` : '';

      methodsDef += `${doc}    METHODS ${name}\n`;
      if (paramDefs) methodsDef += `      IMPORTING\n${paramDefs}${prefStr}`;
      methodsDef += `      RETURNING\n        VALUE(result) TYPE REF TO z2fiori_cl_xml_view_builder.\n\n`;

      methodsImpl += `  METHOD ${name}.\n`;
      if (entry.isContainer) {
        methodsImpl += `    mo_builder = mo_builder->ele( n = '${entry.basename}' ns = '${entry.defaultNs}' ).\n`;
      } else {
        methodsImpl += `    mo_builder->tag( n = '${entry.basename}' ns = '${entry.defaultNs}' ).\n`;
      }
      methodsImpl += `${delegate}    result = me.\n  ENDMETHOD.\n\n`;
    } else {
      const name = base;
      if (registered.has(name)) continue;
      registered.add(name);

      const nsDesc = buildNsDescriptionForDuplicate(list);

      const union = new Map();
      union.set('ns', { type: 'string', description: nsDesc });
      for (const entry of list) {
        for (const [k, v] of entry.paramMap.entries()) {
          if (!union.has(k)) union.set(k, { ...v });
        }
      }

      let paramDefs = '';
      let paramDoc = '';
      for (const [raw, meta] of union.entries()) {
        const safe = sanitizeParamName(raw);
        const typeStr = raw === 'ns' ? 'string' : 'clike';
        paramDefs += `        ${safe.padEnd(28)} TYPE ${typeStr} OPTIONAL\n`;
        paramDoc += formatParamDoc(safe, meta);
      }

      let doc = `    "! <p class="shorttext synchronized" lang="en">Duplicate: ${base} (${list.length} variants) -> ns</p>\n`;
      for (const e of list) {
        if (e.type === 'view') doc += `    "! - ${e.sym.name} (ns='${e.defaultNs}')\n`;
        else doc += `    "! - Aggregation <${e.aggName}> (ns='')\n`;
      }
      doc += `    "! Namespace prefixes: ${getNsLegend()}\n`;
      doc += paramDoc;
      doc += `    "! @parameter result                       | (REF TO z2fiori_cl_xml_view_builder) Reference to builder\n`;

      methodsDef += `${doc}    METHODS ${name}\n      IMPORTING\n${paramDefs}      RETURNING\n        VALUE(result) TYPE REF TO z2fiori_cl_xml_view_builder.\n\n`;

      const primary = list.find((x) => x.type === 'view') || list[0];
      const nVal = primary.type === 'aggregation' ? primary.aggName : primary.basename;
      const useEle = list.some((x) => x.isContainer) || primary.isContainer;

      let delegate = '';
      for (const [raw, meta] of union.entries()) {
        if (raw === 'ns') continue;
        const safe = sanitizeParamName(raw);
        delegate += `    IF ${safe} IS SUPPLIED.\n`;
        delegate += buildAttributeLine(raw, safe, meta);
        delegate += `    ENDIF.\n`;
      }

      methodsImpl += `  METHOD ${name}.\n`;
      if (useEle) {
        methodsImpl += `    mo_builder = mo_builder->ele( n = '${nVal}' ns = ns ).\n`;
      } else {
        methodsImpl += `    mo_builder->tag( n = '${nVal}' ns = ns ).\n`;
      }
      methodsImpl += `${delegate}    result = me.\n  ENDMETHOD.\n\n`;
    }
  }

  const abapClass = `CLASS z2fiori_cl_xml_view_builder DEFINITION
  PUBLIC
  FINAL
  CREATE PRIVATE.

  PUBLIC SECTION.
    "! <p class="shorttext synchronized" lang="en">Factory for standard MVC View</p>
    CLASS-METHODS factory
      RETURNING
        VALUE(result) TYPE REF TO z2fiori_cl_xml_view_builder.

    "! <p class="shorttext synchronized" lang="en">Factory for Fragment / Popup Dialog</p>
    CLASS-METHODS factory_popup
      RETURNING
        VALUE(result) TYPE REF TO z2fiori_cl_xml_view_builder.

    "! <p class="shorttext synchronized" lang="en">Ascend to parent container</p>
    METHODS end
      RETURNING
        VALUE(result) TYPE REF TO z2fiori_cl_xml_view_builder.

    "! <p class="shorttext synchronized" lang="en">Ascend to root view</p>
    METHODS root
      RETURNING
        VALUE(result) TYPE REF TO z2fiori_cl_xml_view_builder.

    "! <p class="shorttext synchronized" lang="en">Render XML string</p>
    METHODS stringify
      RETURNING
        VALUE(result) TYPE string.

${methodsDef}  PRIVATE SECTION.
    DATA mo_builder TYPE REF TO z2fiori_cl_view_builder.

    METHODS constructor.

    METHODS boolean
      IMPORTING
        val           TYPE clike
      RETURNING
        VALUE(result) TYPE string.
ENDCLASS.

CLASS z2fiori_cl_xml_view_builder IMPLEMENTATION.
  METHOD factory.
    result = NEW #( ).
    result->mo_builder = result->mo_builder->ele( n = 'View' ns = 'mvc' ).
    result->mo_builder->a( n = 'displayBlock' v = 'true' ).
    result->mo_builder->a( n = 'height' v = '100%' ).
    result->mo_builder->a( n = 'xmlns' v = 'sap.m' ).
    result->mo_builder->a( n = 'xmlns:mvc' v = 'sap.ui.core.mvc' ).
    result->mo_builder->a( n = 'xmlns:core' v = 'sap.ui.core' ).
    result->mo_builder->a( n = 'xmlns:l' v = 'sap.ui.layout' ).
    result->mo_builder->a( n = 'xmlns:form' v = 'sap.ui.layout.form' ).
    result->mo_builder->a( n = 'xmlns:table' v = 'sap.ui.table' ).
  ENDMETHOD.

  METHOD factory_popup.
    result = NEW #( ).
    result->mo_builder = result->mo_builder->ele( n = 'FragmentDefinition' ns = 'core' ).
    result->mo_builder->a( n = 'xmlns' v = 'sap.m' ).
    result->mo_builder->a( n = 'xmlns:core' v = 'sap.ui.core' ).
    result->mo_builder->a( n = 'xmlns:mvc' v = 'sap.ui.core.mvc' ).
    result->mo_builder->a( n = 'xmlns:l' v = 'sap.ui.layout' ).
    result->mo_builder->a( n = 'xmlns:form' v = 'sap.ui.layout.form' ).
    result->mo_builder->a( n = 'xmlns:table' v = 'sap.ui.table' ).
  ENDMETHOD.

  METHOD constructor.
    mo_builder = z2fiori_cl_view_builder=>factory( ).
  ENDMETHOD.

  METHOD end.
    mo_builder = mo_builder->end( ).
    result = me.
  ENDMETHOD.

  METHOD root.
    mo_builder = mo_builder->root( ).
    result = me.
  ENDMETHOD.

  METHOD stringify.
    result = mo_builder->stringify( ).
  ENDMETHOD.

  METHOD boolean.
    IF val = abap_true OR val = 'true'.
      result = 'true';
    ELSEIF val = abap_false OR val = 'false'.
      result = 'false';
    ELSE.
      result = val;
    ENDIF.
  ENDMETHOD.

${methodsImpl}ENDCLASS.`;

  const dir = path.dirname(CONFIG.outputFile);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(CONFIG.outputFile, abapClass, 'utf8');
  console.log(`Completed! ${registered.size} methods generated -> ${CONFIG.outputFile}`);
}

generate();
