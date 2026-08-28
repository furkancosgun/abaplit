sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/core/mvc/XMLView", "sap/ui/core/Fragment", "sap/m/Dialog"],
  (Controller, XMLView, Fragment, Dialog) => {
    "use strict";

    const PopupController = Controller.extend("z2fiori.controller.Popup", {
      onEvent(event, ...args) {
        sap.ui.require(["z2fiori/core/Dispatcher"], (D) => D.send({ event, args }));
      },
    });

    const stack = [];

    return {
      async open(xml, controller, model) {
        const ctrl = new PopupController();
        let dialog;
        let view;

        if (xml.includes("FragmentDefinition")) {
          dialog = await Fragment.load({ definition: xml, controller: ctrl });
          if (Array.isArray(dialog)) dialog = dialog[0];
        } else {
          view = await XMLView.create({ definition: xml, controller: ctrl });
          view.setModel(model);
          const child = view.getContent()[0];
          dialog = child?.isA("sap.m.Dialog")
            ? child
            : new Dialog({ draggable: true, resizable: true, content: [view] });
        }

        dialog.setModel(model);
        controller.getView().addDependent(dialog);

        const entry = { dialog, view };
        dialog.attachAfterClose(() => {
          stack.splice(stack.indexOf(entry), 1);
          dialog.destroy();
          view?.destroy();
        });

        stack.push(entry);
        if (dialog.openBy)
          dialog.openBy(
            document.activeElement !== document.body ? document.activeElement : controller.getView().getDomRef(),
          );
        else dialog.open();
      },

      close() {
        stack.at(-1)?.dialog.close();
      },

      closeAll() {
        [...stack].reverse().forEach((e) => e.dialog.close());
      },

      hasPopups() {
        return stack.length > 0;
      },
    };
  },
);
