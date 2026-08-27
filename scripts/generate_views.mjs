import fs from 'fs';
import path from 'path';

const CONFIG = {
    libraries: [
        'sap/m',
        'sap/ui/core',
        'sap/ui/layout',
        'sap/ui/table'
    ],
    nsPrefixMap: {
        'sap.m': '',
        'sap.ui.core': 'core',
        'sap.ui.core.mvc': 'mvc',
        'sap.ui.layout': 'l',
        'sap.ui.layout.form': 'form',
        'sap.ui.table': 'table'
    },
    outputFile: './src/core/z2fiori_cl_xml_view_builder.clas.abap'
};

const IGNORED_EVENTS = new Set([
    'validationSuccess',
    'validationError',
    'parseError',
    'formatError',
    'modelContextChange',
    'validateFieldGroup'
]);

function getSymbolPriority(sym) {
    const pkg = sym.name.substring(0, sym.name.lastIndexOf('.'));
    if (pkg === 'sap.m') return 0;
    if (pkg === 'sap.ui.core') return 10;
    if (pkg === 'sap.ui.layout') return 20;
    if (pkg === 'sap.ui.layout.form') return 30;
    if (pkg === 'sap.ui.table') return 40;
    if (pkg.startsWith('sap.m.')) return 100 + pkg.split('.').length;
    if (pkg.startsWith('sap.ui.core.')) return 200 + pkg.split('.').length;
    return 500;
}

function getLibPrefix(fullPkg) {
    if (fullPkg.startsWith('sap.ui.table')) return 'ui_';
    if (fullPkg.startsWith('sap.ui.core')) return 'core_';
    if (fullPkg.startsWith('sap.ui.layout.form')) return 'form_';
    if (fullPkg.startsWith('sap.ui.layout')) return 'layout_';
    if (fullPkg === 'sap.m.table') return 'table_';
    if (fullPkg.startsWith('sap.m.')) {
        const parts = fullPkg.split('.');
        return `${parts[parts.length - 1]}_`;
    }
    return 'ext_';
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
    const param = toSnakeCase(name);
    return param.length > 30 ? param.substring(0, 30) : param;
}

function cleanDoc(str) {
    if (!str) return '';
    return str
        .replace(/<[^>]+>/g, '')
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#39;/g, "'")
        .replace(/[\r\n]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function formatParamDoc(paramName, meta = {}) {
    const padName = paramName.padEnd(28);
    const typeStr = meta.type ? `(${meta.type}) ` : '';
    let desc = meta.description ? cleanDoc(meta.description) : '';
    if (desc.length > 95) {
        desc = desc.substring(0, 92) + '...';
    }
    const defaultStr = (meta.defaultValue !== undefined && meta.defaultValue !== null && meta.defaultValue !== '')
        ? ` Default: ${meta.defaultValue}.`
        : '';
    return `    "! @parameter ${padName} | ${typeStr}${desc}${defaultStr}\n`;
}

function getInheritedFeatures(sym, symbolMap) {
    const propMap = new Map();
    const eventMap = new Map();
    const aggMap = new Map();
    let defaultAggregation = null;

    let curr = sym;
    while (curr) {
        const ui5Meta = curr['ui5-metadata'] || {};

        if (!defaultAggregation && ui5Meta.defaultAggregation) {
            defaultAggregation = ui5Meta.defaultAggregation;
        }

        const props = [...(ui5Meta.properties || []), ...(curr.properties || [])];
        const events = [...(ui5Meta.events || []), ...(curr.events || [])];
        const aggregations = [...(ui5Meta.aggregations || []), ...(curr.aggregations || [])];

        props.forEach(p => {
            if (p?.name && !propMap.has(p.name) && !p.deprecated) {
                propMap.set(p.name, p);
            }
        });
        events.forEach(e => {
            if (e?.name && !eventMap.has(e.name) && !e.deprecated && !IGNORED_EVENTS.has(e.name)) {
                eventMap.set(e.name, e);
            }
        });
        aggregations.forEach(a => {
            if (a?.name && !aggMap.has(a.name) && !a.deprecated) {
                aggMap.set(a.name, a);
            }
        });

        if (curr.extends && symbolMap.has(curr.extends)) {
            curr = symbolMap.get(curr.extends);
        } else {
            break;
        }
    }

    return {
        properties: Array.from(propMap.values()),
        events: Array.from(eventMap.values()),
        aggregations: Array.from(aggMap.values()),
        defaultAggregation
    };
}

function isUI5Element(sym, symbolMap) {
    if (sym.name === 'sap.ui.core.Element' || sym.name === 'sap.ui.core.Control') {
        return true;
    }
    let curr = sym;
    while (curr && curr.extends) {
        if (
            curr.extends === 'sap.ui.core.Element' ||
            curr.extends === 'sap.ui.core.Control' ||
            curr.extends === 'sap.ui.core.ComponentContainer'
        ) {
            return true;
        }
        if (symbolMap.has(curr.extends)) {
            curr = symbolMap.get(curr.extends);
        } else {
            break;
        }
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
            (data.symbols || []).forEach(s => {
                if (s.kind === 'class') {
                    allSymbols.push(s);
                    symbolMap.set(s.name, s);
                }
            });
        } catch (err) {
            console.warn(`⚠️ Failed to download metadata for ${lib}: ${err.message}`);
        }
    }

    return { allSymbols, symbolMap };
}

async function generate() {
    console.log('🚀 Fetching UI5 api.json metadata...');
    const { allSymbols, symbolMap } = await fetchSymbols();

    allSymbols.sort((a, b) => getSymbolPriority(a) - getSymbolPriority(b));

    let methodsDef = '';
    let methodsImpl = '';
    const registeredMethods = new Set();
    const allAggregations = new Set();

    for (const sym of allSymbols) {
        if (
            sym.name.includes('.smart') ||
            sym.name.includes('.internal.') ||
            sym.abstract ||
            !isUI5Element(sym, symbolMap)
        ) {
            continue;
        }

        const fullPkg = sym.name.substring(0, sym.name.lastIndexOf('.'));
        const originalBasename = sym.basename;
        const baseMethodName = toSnakeCase(originalBasename);

        let finalName = baseMethodName.length > 30 ? baseMethodName.substring(0, 30) : baseMethodName;

        if (registeredMethods.has(finalName)) {
            const libPrefix = getLibPrefix(fullPkg);
            const prefixed = `${libPrefix}${baseMethodName}`;
            finalName = prefixed.length > 30 ? prefixed.substring(0, 30) : prefixed;
        }

        let counter = 1;
        while (registeredMethods.has(finalName)) {
            const suffix = `_${counter}`;
            finalName = finalName.substring(0, 30 - suffix.length) + suffix;
            counter++;
        }

        const methodName = finalName;
        registeredMethods.add(methodName);

        const { properties, events, aggregations, defaultAggregation } = getInheritedFeatures(sym, symbolMap);

        aggregations
            .filter(a => a?.name && (!a.visibility || a.visibility === 'public') && !a.name.startsWith('_'))
            .forEach(a => allAggregations.add(a.name));

        const defaultNs = CONFIG.nsPrefixMap[fullPkg] ?? '';
        const isContainer = Boolean(defaultAggregation && !defaultAggregation.startsWith('_'));

        const paramMap = new Map();
        paramMap.set('id', { type: 'string', description: 'Unique control identifier' });
        paramMap.set('class', { type: 'string', description: 'CSS class names' });

        properties
            .filter(p => !p.visibility || p.visibility === 'public')
            .forEach(p => paramMap.set(p.name, { ...p, type: p.type || 'string' }));

        aggregations
            .filter(a => a?.name && (!a.visibility || a.visibility === 'public') && !a.name.startsWith('_'))
            .forEach(a => {
                if (!paramMap.has(a.name)) {
                    paramMap.set(a.name, { ...a, type: 'aggregation' });
                }
            });

        events
            .filter(e => !e.visibility || e.visibility === 'public')
            .forEach(e => paramMap.set(e.name, { ...e, type: 'event' }));

        let paramDefs = '';
        let delegateCalls = '';
        let paramDoc = '';

        for (const [rawP, meta] of paramMap.entries()) {
            const safeParam = sanitizeParamName(rawP);
            paramDefs += `        ${safeParam.padEnd(28)} TYPE clike OPTIONAL\n`;
            paramDoc += formatParamDoc(safeParam, meta);

            delegateCalls += `    IF ${safeParam} IS SUPPLIED.\n`;
            if (meta.type === 'boolean') {
                delegateCalls += `      mo_builder->a( n = '${rawP}' v = boolean( ${safeParam} ) ).\n`;
            } else {
                delegateCalls += `      mo_builder->a( n = '${rawP}' v = ${safeParam} ).\n`;
            }
            delegateCalls += `    ENDIF.\n`;
        }

        let docComment = `    "! <p class="shorttext synchronized" lang="en">${sym.name}</p>\n`;
        docComment += `    "! https://ui5.sap.com/#/api/${sym.name}\n`;
        if (sym.description) {
            const desc = cleanDoc(sym.description);
            if (desc) {
                const shortDesc = desc.length > 120 ? desc.substring(0, 117) + '...' : desc;
                docComment += `    "! ${shortDesc}\n`;
            }
        }
        docComment += paramDoc;
        docComment += `    "! @parameter result                       | (REF TO z2fiori_cl_xml_view_builder) Reference to builder\n`;

        const candidateProps = ['text', 'value', 'title', 'src', 'state', 'header_text', 'headerText'];
        let prefParam = null;
        for (const cand of candidateProps) {
            const safe = sanitizeParamName(cand);
            if (paramMap.has(cand) || paramMap.has(safe)) {
                prefParam = safe;
                break;
            }
        }
        if (!prefParam && defaultAggregation) {
            const safe = sanitizeParamName(defaultAggregation);
            if (paramMap.has(defaultAggregation) || paramMap.has(safe)) {
                prefParam = safe;
            }
        }

        const prefParamStr = prefParam ? `        PREFERRED PARAMETER ${prefParam}\n` : '';

        methodsDef += `${docComment}    METHODS ${methodName}\n`;
        if (paramDefs) {
            methodsDef += `      IMPORTING\n${paramDefs}${prefParamStr}`;
        }
        methodsDef += `      RETURNING\n        VALUE(result) TYPE REF TO z2fiori_cl_xml_view_builder.\n\n`;

        methodsImpl += `  METHOD ${methodName}.\n`;
        if (isContainer) {
            methodsImpl += `    mo_builder = mo_builder->ele( n = '${originalBasename}' ns = '${defaultNs}' ).\n`;
        } else {
            methodsImpl += `    mo_builder->tag( n = '${originalBasename}' ns = '${defaultNs}' ).\n`;
        }
        methodsImpl += delegateCalls;
        methodsImpl += `    result = me.\n`;
        methodsImpl += `  ENDMETHOD.\n\n`;
    }

    for (const rawAgg of Array.from(allAggregations).sort()) {
        let aggMethod = toSnakeCase(rawAgg);
        if (aggMethod.length > 30) {
            aggMethod = aggMethod.substring(0, 30);
        }
        if (registeredMethods.has(aggMethod)) {
            aggMethod = `agg_${aggMethod}`;
            if (aggMethod.length > 30) aggMethod = aggMethod.substring(0, 30);
        }
        if (registeredMethods.has(aggMethod)) continue;
        registeredMethods.add(aggMethod);

        let aggDoc = `    "! <p class="shorttext synchronized" lang="en">Aggregation: ${rawAgg}</p>\n`;
        aggDoc += `    "! Slot / child aggregation: &lt;${rawAgg}&gt;\n`;
        aggDoc += `    "! @parameter result                       | (REF TO z2fiori_cl_xml_view_builder) Reference to builder\n`;

        methodsDef += `${aggDoc}    METHODS ${aggMethod}\n`;
        methodsDef += `      RETURNING\n        VALUE(result) TYPE REF TO z2fiori_cl_xml_view_builder.\n\n`;

        methodsImpl += `  METHOD ${aggMethod}.\n`;
        methodsImpl += `    mo_builder = mo_builder->ele( n = '${rawAgg}' ).\n`;
        methodsImpl += `    result = me.\n`;
        methodsImpl += `  ENDMETHOD.\n\n`;
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

${methodsDef}
  PRIVATE SECTION.
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
    result->mo_builder->a( n = 'xmlns:mvc' v = 'sap.ui.core.mvc' ).
    result->mo_builder->a( n = 'xmlns:core' v = 'sap.ui.core' ).
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
      result = 'true'.
    ELSEIF val = abap_false OR val = 'false'.
      result = 'false'.
    ELSE.
      result = val.
    ENDIF.
  ENDMETHOD.

${methodsImpl}
ENDCLASS.`;

    const dir = path.dirname(CONFIG.outputFile);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(CONFIG.outputFile, abapClass, 'utf8');
    console.log(`✨ Completed! ${registeredMethods.size} controls and aggregations generated -> ${CONFIG.outputFile}`);
}

generate();
