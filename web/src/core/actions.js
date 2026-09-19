export function dispatchActions(actions, handlers = {}) {
  if (!actions || !Array.isArray(actions)) return;

  for (const action of actions) {
    if (!action) continue;
    const type = (action.type || action.TYPE || '').toUpperCase();
    const payload = action.payload ?? action.PAYLOAD;

    switch (type) {
      case 'TOAST': {
        const text = typeof payload === 'object' && payload !== null
          ? (payload.text || payload.TEXT || '')
          : String(payload || '');

        const duration = typeof payload === 'object' && payload !== null
          ? (parseInt(payload.duration || payload.DURATION, 10) || 3000)
          : 3000;

        if (handlers.addToast) {
          handlers.addToast({ text, duration });
        }
        break;
      }

      case 'TITLE': {
        const titleText = typeof payload === 'object' && payload !== null
          ? (payload.title || payload.TITLE || '')
          : String(payload || '');

        if (titleText) {
          document.title = titleText;
        }
        break;
      }

      case 'CLIPBOARD_WRITE': {
        const textToCopy = typeof payload === 'object' && payload !== null
          ? (payload.text || payload.TEXT || '')
          : String(payload || '');

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(textToCopy).catch((err) => {
            console.error('Clipboard write error:', err);
          });
        } else {
          const ta = document.createElement('textarea');
          ta.value = textToCopy;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
        break;
      }

      case 'OPEN_NEW_TAB': {
        const url = typeof payload === 'object' && payload !== null
          ? (payload.url || payload.URL || '')
          : String(payload || '');

        if (url) {
          window.open(url, '_blank', 'noopener,noreferrer');
        }
        break;
      }

      case 'FILE_DOWNLOAD': {
        if (!payload || typeof payload !== 'object') break;
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
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } catch (err) {
          console.error('File download processing failed:', err);
        }
        break;
      }

      default:
        console.warn(`Unrecognized backend action type: ${type}`);
        break;
    }
  }
}
