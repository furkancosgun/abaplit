import { resolveBinding, getBoundValue } from './binding';

export function parseOptions(options, state) {
  const resolved = state ? getBoundValue(options, state) : options;
  if (!resolved) return [];
  if (Array.isArray(resolved)) return resolved;
  return String(resolved)
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

export async function copyToClipboard(text) {
  const content = String(text ?? '');
  if (navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(content);
      return true;
    } catch {
      return fallbackCopyToClipboard(content);
    }
  }
  return fallbackCopyToClipboard(content);
}

function fallbackCopyToClipboard(text) {
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    return successful;
  } catch {
    return false;
  }
}

export function navigateToInternalUrl(url) {
  if (!url) return;
  window.history.pushState(null, '', url);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function resolveDataset(data, state) {
  const bound = resolveBinding(data, state);
  const rawData = bound.error ? data : (bound.isBound ? bound.value : data);
  const isErrorFallback = Boolean(bound.error && typeof rawData === 'string');

  return {
    data: rawData,
    bindingPath: bound.key,
    isErrorFallback,
  };
}

export function resolveNodeText(node, state, fallback = '') {
  if (!node) return fallback;
  const raw = node.text ?? node.body ?? node.val ?? node.label ?? fallback;
  return getBoundValue(raw, state) ?? fallback;
}
