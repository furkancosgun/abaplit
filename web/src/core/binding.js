import { BindingError } from './errors.js';

export function getBoundValue(val, state) {
  if (val === undefined || val === null || typeof val !== 'string') return val;
  const res = resolveBinding(val, state);
  if (res.error) return val;
  if (res.isBound) return res.value;
  return val;
}

export function safeResolveBinding(val, state) {
  const res = resolveBinding(val, state);
  if (res.error) {
    return { isBound: false, key: null, value: val, error: null, rawError: res.error };
  }
  return res;
}

export function isBindingExpression(val) {
  if (typeof val !== 'string') return false;
  const trimmed = val.trim();
  return trimmed.startsWith('{') && trimmed.endsWith('}') && trimmed.length > 2;
}

export function normalizeBindingPath(raw) {
  if (typeof raw !== 'string') return '';
  let path = raw.trim();
  if (path.startsWith('{') && path.endsWith('}')) {
    path = path.slice(1, -1).trim();
  }
  if (path.startsWith('/')) {
    path = path.slice(1);
  }
  path = path.replace(/\//g, '.');
  if (/^[A-Za-z0-9_]+-[A-Za-z0-9_]+(-[A-Za-z0-9_]+)*$/.test(path)) {
    path = path.replace(/-/g, '.');
  }
  return path.replace(/\.+/g, '.').replace(/^\.|\.$/g, '');
}

function findCaseInsensitiveKey(obj, targetKey) {
  if (!obj || typeof obj !== 'object') return null;
  if (Object.prototype.hasOwnProperty.call(obj, targetKey)) return targetKey;
  const lower = targetKey.toLowerCase();
  for (const k of Object.keys(obj)) {
    if (k.toLowerCase() === lower) return k;
  }
  return null;
}

export function resolveBinding(val, state) {
  if (!isBindingExpression(val)) {
    return { isBound: false, key: null, value: val, error: null };
  }

  const normalizedPath = normalizeBindingPath(val);
  if (!normalizedPath) {
    return { isBound: false, key: null, value: val, error: null };
  }

  const segments = normalizedPath.split('.');
  let current = state;
  const traversed = [];

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];

    if (current === null || typeof current !== 'object') {
      const error = new BindingError({
        path: normalizedPath,
        missingKey: seg,
        parentPath: traversed.join('.'),
        availableKeys: [],
      });
      return { isBound: true, key: normalizedPath, value: undefined, error };
    }

    const matchedKey = findCaseInsensitiveKey(current, seg);
    if (matchedKey === null || current[matchedKey] === undefined) {
      const error = new BindingError({
        path: normalizedPath,
        missingKey: seg,
        parentPath: traversed.join('.'),
        availableKeys: Object.keys(current),
      });
      return { isBound: true, key: normalizedPath, value: undefined, error };
    }

    current = current[matchedKey];
    traversed.push(matchedKey);
  }

  return { isBound: true, key: traversed.join('.'), value: current, error: null };
}

export function setBindingValue(state, path, newValue) {
  const normalizedPath = normalizeBindingPath(path);
  if (!normalizedPath) return state;

  const segments = normalizedPath.split('.');
  const rootClone = Array.isArray(state) ? [...state] : { ...state };
  let currentTarget = rootClone;
  let currentSource = state;

  for (let i = 0; i < segments.length - 1; i++) {
    const seg = segments[i];
    const existingKey = currentSource ? findCaseInsensitiveKey(currentSource, seg) : null;
    const keyToUse = existingKey || seg;
    const nextSource = existingKey ? currentSource[existingKey] : undefined;

    const nextTarget =
      nextSource && typeof nextSource === 'object'
        ? Array.isArray(nextSource)
          ? [...nextSource]
          : { ...nextSource }
        : {};

    currentTarget[keyToUse] = nextTarget;
    currentTarget = nextTarget;
    currentSource = nextSource;
  }

  const lastSeg = segments[segments.length - 1];
  const lastKey = currentSource ? findCaseInsensitiveKey(currentSource, lastSeg) : null;
  currentTarget[lastKey || lastSeg] = newValue;

  return rootClone;
}
