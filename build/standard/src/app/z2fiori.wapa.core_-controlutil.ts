import Element from "sap/ui/core/Element";
import Control from "sap/ui/core/Control";

const ControlUtil = {
  find(id: string): Control {
    const direct = Element.getElementById(id) as Control;
    if (direct) return direct;
    let matched: Control | null = null;
    const registry = (Element as typeof Element & { registry: Map<string, Control> }).registry;
    registry.forEach((item: Control) => {
      if (!matched && item.getId().endsWith("--" + id)) {
        matched = item;
      }
    });
    return matched!;
  },

  blurActive(): void {
    (document.activeElement as HTMLElement).blur();
  }
};

export default ControlUtil;
