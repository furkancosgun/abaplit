sap.ui.define(["sap/ui/core/Element"], (Element) => {
  "use strict";
  return {
    find(id) {
      return (
        Element.getElementById(id) || [...Element.registry.values()].find((c) => c.getId().endsWith(`--${id}`)) || null
      );
    },
    blurActive() {
      document.activeElement?.blur();
    },
  };
});
