sap.ui.define([], () => {
  "use strict";
  return {
    CLIPBOARD_WRITE: (text) => navigator.clipboard.writeText(text || ""),
    CLIPBOARD_READ: async (event, { dispatch }) => {
      try {
        const text = await navigator.clipboard.readText();
        dispatch({ event, args: [text] });
      } catch {
        dispatch({ event, args: [""] });
      }
    },
  };
});
