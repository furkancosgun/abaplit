sap.ui.define(["sap/m/MessageToast", "sap/m/MessageBox"], (MessageToast, MessageBox) => {
  "use strict";
  return {
    TOAST: ({ TEXT, DURATION }) => MessageToast.show(TEXT, { duration: parseInt(DURATION, 10) || 3000 }),
    MESSAGE_BOX: (p, { dispatch }) => {
      if (!p.CONFIRM_EVENT && !p.CANCEL_EVENT) {
        const fn = MessageBox[p.LEVEL || p.TYPE || "information"];
        return (fn || MessageBox.information).call(MessageBox, p.TEXT, { title: p.TITLE });
      }
      MessageBox.show(p.TEXT, {
        title: p.TITLE,
        actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
        emphasizedAction: MessageBox.Action.OK,
        onClose: (a) => dispatch({ event: a === MessageBox.Action.OK ? p.CONFIRM_EVENT : p.CANCEL_EVENT }),
      });
    },
    TITLE: (title) => {
      document.title = title || "";
    },
    FAVICON: (url) => {
      const link =
        document.querySelector("link[rel*='icon']") ||
        Object.assign(document.createElement("link"), { rel: "shortcut icon" });
      link.href = url;
      document.head.appendChild(link);
    },
  };
});
