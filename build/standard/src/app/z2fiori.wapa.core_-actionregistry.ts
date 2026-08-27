import type { Action, ActionContext } from "../types/Action";
import { popupHandlers } from "./actions/popup";
import { nestHandlers } from "./actions/nest";
import { feedbackHandlers } from "./actions/feedback";
import { focusHandlers } from "./actions/focus";
import { clipboardHandlers } from "./actions/clipboard";
import { deviceHandlers } from "./actions/device";
import { systemHandlers } from "./actions/system";
import { navigationHandlers } from "./actions/navigation";

type ActionHandler<P> = (payload: P, ctx: ActionContext) => unknown | Promise<unknown>;

const registry: Record<string, ActionHandler<any>> = {
  ...popupHandlers,
  ...nestHandlers,
  ...feedbackHandlers,
  ...focusHandlers,
  ...clipboardHandlers,
  ...deviceHandlers,
  ...systemHandlers,
  ...navigationHandlers
};

const ActionRegistry = {
  register(type: string, handlerFn: ActionHandler<any>): void {
    registry[type] = handlerFn;
  },

  async execute(action: Action, context: ActionContext): Promise<void> {
    const fn = registry[action.TYPE];
    await (fn as ActionHandler<any>)(action.PAYLOAD as unknown, context);
  }
};

export default ActionRegistry;
