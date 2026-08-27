import type { PopupAction, ActionContext } from "../../types/Action";
import PopupManager from "../PopupManager";

export const popupHandlers = {
  POPUP: (payload: PopupAction["PAYLOAD"], ctx: ActionContext) => PopupManager.open(payload, ctx.controller, ctx.model),
  POPUP_CLOSE: () => PopupManager.close(),
  POPUPS_CLOSE_ALL: () => PopupManager.closeAll(),
  POPUP_CLOSE_ALL: () => PopupManager.closeAll()
};
