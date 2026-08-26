sap.ui.define(["sap/ui/core/Element"], (Element) => {
  "use strict";

  return {
    find(id) {
      if (!id) return null;
      const direct = Element.getElementById(id);
      if (direct) return direct;

      let matched = null;
      Element.registry.forEach((item) => {
        if (!matched && item.getId()?.endsWith("--" + id)) {
          matched = item;
        }
      });
      return matched;
    },

    blurActive() {
      if (document.activeElement && typeof document.activeElement.blur === "function") {
        document.activeElement.blur();
      }
    }
  };
});
