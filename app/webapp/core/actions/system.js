sap.ui.define(["z2fiori/core/State", "z2fiori/core/ShortcutManager"], (State, ShortcutManager) => {
  "use strict";
  return {
    OPEN_URL: (url) => window.open(url, "_blank", "noopener,noreferrer"),
    RELOAD: () => location.reload(),
    DIRTY: (flag) => State.setDirty(flag),
    SHORTCUTS: (p) => ShortcutManager.register(p),
    SCRIPT: (src) => document.head.appendChild(Object.assign(document.createElement("script"), { src, defer: true })),
    STYLE: (href) =>
      document.head.appendChild(Object.assign(document.createElement("link"), { href, rel: "stylesheet" })),
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
});
