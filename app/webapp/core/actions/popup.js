sap.ui.define(["z2fiori/core/PopupManager"], (PopupManager) => {
  "use strict";
  return {
    POPUP: (xml, ctx) => PopupManager.open(xml, ctx.controller, ctx.model),
    POPUP_CLOSE: () => PopupManager.close(),
    POPUPS_CLOSE_ALL: () => PopupManager.closeAll(),
  };
});
