import State from "../State";
import ShortcutManager from "../ShortcutManager";
import type { DownloadAction, FollowUpAction, ActionContext } from "../../types/Action";

export const systemHandlers = {
  OPEN_URL: (payload: string) => {
    window.open(payload, "_blank", "noopener,noreferrer");
  },

  RELOAD: () => {
    location.reload();
  },

  DIRTY: (payload: boolean) => {
    State.setDirty(payload);
  },

  SHORTCUTS: (payload: import("../../types/Action").ShortcutPayload) => {
    ShortcutManager.register(payload);
  },

  SCRIPT: (payload: string) => {
    document.head.appendChild(Object.assign(document.createElement("script"), { src: payload, defer: true }));
  },

  STYLE: (payload: string) => {
    document.head.appendChild(Object.assign(document.createElement("link"), { href: payload, rel: "stylesheet" }));
  },

  DOWNLOAD: (payload: DownloadAction["PAYLOAD"]) => {
    const a = Object.assign(document.createElement("a"), {
      href: `data:${payload.TYPE || "application/octet-stream"};base64,${payload.BASE64}`,
      download: payload.FILENAME || "download"
    }) as HTMLAnchorElement;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  },

  FOLLOW_UP: (payload: FollowUpAction["PAYLOAD"], ctx: ActionContext) => {
    setTimeout(() => {
      void ctx.dispatch({ event: payload.EVENT, args: payload.EVENT_ARGS });
    }, payload.DELAY_MS || 0);
  }
};
