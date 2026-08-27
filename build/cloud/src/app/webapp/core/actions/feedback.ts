import MessageToast from "sap/m/MessageToast";
import MessageBox from "sap/m/MessageBox";
import type { ToastAction, MessageBoxAction, ActionContext } from "../../types/Action";

export const feedbackHandlers = {
  TOAST: (payload: ToastAction["PAYLOAD"]) => {
    MessageToast.show(payload.TEXT, { duration: parseInt(payload.DURATION, 10) || 3000 });
  },

  MESSAGE_BOX: (payload: MessageBoxAction["PAYLOAD"], ctx: ActionContext) => {
    const type = (payload.LEVEL || payload.TYPE || "information").toLowerCase();
    const text = payload.TEXT;
    if (!payload.CONFIRM_EVENT && !payload.CANCEL_EVENT) {
      const fn = (MessageBox as unknown as Record<string, (t: string, o: unknown) => void>)[type];
      return fn ? fn(text, { title: payload.TITLE }) : MessageBox.information(text, { title: payload.TITLE });
    }
    MessageBox.show(text, {
      title: payload.TITLE,
      actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
      emphasizedAction: MessageBox.Action.OK,
      onClose: (action: string) => {
        void ctx.dispatch({
          event: action === MessageBox.Action.OK ? payload.CONFIRM_EVENT : payload.CANCEL_EVENT
        });
      }
    } as never);
  },

  TITLE: (payload: string) => {
    document.title = payload;
  },

  FAVICON: (payload: string) => {
    const link =
      (document.querySelector("link[rel*='icon']") as HTMLLinkElement) ||
      Object.assign(document.createElement("link"), { rel: "shortcut icon" }) as HTMLLinkElement;
    link.href = payload;
    document.head.appendChild(link);
  }
};
