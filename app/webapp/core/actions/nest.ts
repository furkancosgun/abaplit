import Controller from "sap/ui/core/mvc/Controller";
import XMLView from "sap/ui/core/mvc/XMLView";
import Control from "sap/ui/core/Control";
import ControlUtil from "../ControlUtil";
import type { NestViewDisplayAction, NestViewDestroyAction, ActionContext } from "../../types/Action";

class NestedViewController extends Controller {
  constructor(sId = "z2fiori.dynamic.controller") {
    super(sId);
  }

  onEvent(event: string, ...args: unknown[]): void {
    void import("../Dispatcher").then(({ default: Dispatcher }) => {
      void Dispatcher.send({ event, args });
    });
  }
}

export const nestHandlers = {
  NEST_VIEW_DISPLAY: async (payload: NestViewDisplayAction["PAYLOAD"], ctx: ActionContext) => {
    const target = ControlUtil.find(payload.ID) as Control & Record<string, (c: XMLView) => void>;
    const child = await XMLView.create({
      definition: payload.XML,
      controller: new NestedViewController()
    });
    child.setModel(ctx.model);
    target[payload.METHOD_INSERT](child);
    target.invalidate();
  },

  NEST_VIEW_DESTROY: (payload: NestViewDestroyAction["PAYLOAD"]) => {
    const target = ControlUtil.find(payload.ID) as Control & Record<string, () => void>;
    target[payload.METHOD_DESTROY]();
    target.invalidate();
  }
};
