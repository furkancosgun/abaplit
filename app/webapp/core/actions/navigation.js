sap.ui.define(["z2fiori/core/NavigationManager"], (NavigationManager) => {
  "use strict";
  return {
    NAV_CALL: (payload) => NavigationManager.callApp(payload),
    NAV_LEAVE: (payload) => NavigationManager.leaveApp(payload),
  };
});
