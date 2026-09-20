import { copyToClipboard } from './utils';

function extractPayloadString(payload, propertyName) {
  if (typeof payload === 'object' && payload !== null) {
    const uppercaseKey = propertyName.toUpperCase();
    return payload[propertyName] || payload[uppercaseKey] || '';
  }
  return String(payload || '');
}

function handleToast(payload, handlers) {
  if (!handlers.addToast) return;
  const text = extractPayloadString(payload, 'text');
  const duration =
    typeof payload === 'object' && payload !== null
      ? parseInt(payload.duration || payload.DURATION, 10) || 3000
      : 3000;
  handlers.addToast({ text, duration });
}

function handleTitle(payload) {
  const titleText = extractPayloadString(payload, 'title');
  if (titleText) {
    document.title = titleText;
  }
}

function handleClipboardWrite(payload) {
  const textToCopy = extractPayloadString(payload, 'text');
  copyToClipboard(textToCopy);
}

function handleOpenNewTab(payload) {
  const url = extractPayloadString(payload, 'url');
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

function handleFileDownload(payload) {
  if (!payload || typeof payload !== 'object') return;
  const filename = payload.filename || payload.FILENAME || 'download.txt';
  const base64 = payload.base64 || payload.BASE64 || '';
  const mime = payload.type || payload.TYPE || 'application/octet-stream';

  try {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('File download processing failed:', err);
  }
}

function handleRerun(payload, handlers) {
  if (!handlers.rerun) return;
  const interval =
    typeof payload === 'object' && payload !== null
      ? parseInt(payload.interval || payload.INTERVAL, 10) || 2000
      : parseInt(payload, 10) || 2000;
  handlers.rerun(interval);
}

const ACTION_HANDLERS = {
  TOAST: handleToast,
  TITLE: handleTitle,
  CLIPBOARD_WRITE: handleClipboardWrite,
  OPEN_NEW_TAB: handleOpenNewTab,
  FILE_DOWNLOAD: handleFileDownload,
  RERUN: handleRerun,
};

export function dispatchActions(actions, handlers = {}) {
  if (!Array.isArray(actions)) return;

  for (const action of actions) {
    if (!action) continue;
    const type = (action.type || action.TYPE || '').toUpperCase();
    const payload = action.payload ?? action.PAYLOAD;
    const handler = ACTION_HANDLERS[type];

    if (handler) {
      handler(payload, handlers);
    } else {
      console.warn(`Unrecognized backend action type: ${type}`);
    }
  }
}
