import type { ActionContext } from "../../types/Action";

export const clipboardHandlers = {
  CLIPBOARD_WRITE: (payload: string) => {
    void navigator.clipboard.writeText(payload);
  },

  CLIPBOARD_READ: async (payload: string, ctx: ActionContext) => {
    try {
      const text = await navigator.clipboard.readText();
      await ctx.dispatch({ event: payload, args: [text] });
    } catch {
      await ctx.dispatch({ event: payload, args: [""] });
    }
  }
};
