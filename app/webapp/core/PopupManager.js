sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/mvc/XMLView",
  "sap/ui/core/Fragment",
  "sap/m/Dialog"
], (Controller, XMLView, Fragment, Dialog) => {
  "use strict";

  const PopupController = Controller.extend("z2fiori.controller.Popup", {
    onEvent(event, ...args) {
      sap.ui.require(["z2fiori/core/Dispatcher"], (Dispatcher) => {
        Dispatcher.send({ event, args });
      });
    }
  });

  const stack = [];

  return {
    async open(xml, controller, model) {
      if (!xml) throw new Error("Popup XML definition is required.");

      const popupCtrl = new PopupController();
      let dialog;
      let view;

      if (xml.includes("FragmentDefinition")) {
        dialog = await Fragment.load({ definition: xml, controller: popupCtrl });
        if (Array.isArray(dialog)) dialog = dialog[0];
      } else {
        view = await XMLView.create({ definition: xml, controller: popupCtrl });
        if (model) view.setModel(model);

        const firstChild = view.getContent?.()?.[0];
        const isNativeOverlay = firstChild?.isA?.("sap.m.Dialog")
          || firstChild?.isA?.("sap.m.Popover")
          || firstChild?.isA?.("sap.m.ResponsivePopover");

        dialog = isNativeOverlay
          ? firstChild
          : new Dialog({ draggable: true, resizable: true, content: [view] });
      }

      if (model) dialog.setModel(model);
      controller?.getView?.()?.addDependent(dialog);

      const entry = { dialog, view };
      dialog.attachAfterClose(() => {
        const idx = stack.indexOf(entry);
        if (idx !== -1) stack.splice(idx, 1);
        if (!dialog.isDestroyed?.()) dialog.destroy();
        if (view && !view.isDestroyed?.()) view.destroy();
      });

      stack.push(entry);

      if (dialog.isA?.("sap.m.Popover") || dialog.isA?.("sap.m.ResponsivePopover")) {
        const target = (document.activeElement && document.activeElement !== document.body)
          ? document.activeElement
          : controller?.getView?.()?.getDomRef?.() || document.body;
        dialog.openBy(target);
      } else {
        dialog.open();
      }
    },

    close() {
      const top = stack[stack.length - 1];
      if (!top) throw new Error("No open popup found to close.");
      top.dialog.close();
    },

    closeAll() {
      for (let i = stack.length - 1; i >= 0; i--) {
        stack[i]?.dialog?.close();
      }
    },

    hasPopups() {
      return stack.length > 0;
    }
  };
});
