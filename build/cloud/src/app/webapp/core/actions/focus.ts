import Control from "sap/ui/core/Control";
import ControlUtil from "../ControlUtil";

export const focusHandlers = {
  FOCUS: (payload: string) => {
    const el = ControlUtil.find(payload) as Control & { focus: () => void };
    el.focus();
  },

  SCROLL: (payload: string) => {
    const el = ControlUtil.find(payload) as Control & { getDomRef: () => HTMLElement };
    el.getDomRef()!.scrollIntoView({ behavior: "smooth", block: "center" });
  }
};
