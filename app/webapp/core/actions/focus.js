sap.ui.define(["z2fiori/core/ControlUtil"], (ControlUtil) => {
  "use strict";
  return {
    FOCUS: (id) => ControlUtil.find(id).focus(),
    SCROLL: (id) => ControlUtil.find(id).getDomRef().scrollIntoView({ behavior: "smooth", block: "center" }),
  };
});
