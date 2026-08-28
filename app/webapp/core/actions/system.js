sap.ui.define(
  ["sap/m/MessageBox", "z2fiori/core/State", "z2fiori/core/ShortcutManager"],
  (MessageBox, State, ShortcutManager) => {
    "use strict";
    return {
      OPEN_URL: (url) => window.open(url, "_blank", "noopener,noreferrer"),
      RELOAD: () => location.reload(),
      DIRTY: (flag) => State.setDirty(flag),
      SHORTCUTS: (p) => ShortcutManager.register(p),
      SCRIPT: (src) => {
        const el = Object.assign(document.createElement("script"), { src, defer: true });
        el.onerror = () => MessageBox.error(`Script failed to load: ${src}`);
        document.head.appendChild(el);
      },
      STYLE: (href) => {
        const el = Object.assign(document.createElement("link"), { href, rel: "stylesheet" });
        el.onerror = () => MessageBox.error(`Stylesheet failed to load: ${href}`);
        document.head.appendChild(el);
      },
      DOWNLOAD: ({ BASE64, TYPE, FILENAME }) => {
        const a = Object.assign(document.createElement("a"), {
          href: `data:${TYPE || "application/octet-stream"};base64,${BASE64}`,
          download: FILENAME || "download",
        });
        document.body.appendChild(a);
        a.click();
        a.remove();
      },
      FOLLOW_UP: ({ EVENT, EVENT_ARGS, DELAY_MS }, { dispatch }) => {
        setTimeout(() => dispatch({ event: EVENT, args: EVENT_ARGS || [] }), DELAY_MS || 0);
      },
    };
  },
);
