sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/mvc/XMLView",
  "z2fiori/core/State"
], (Controller, XMLView, State) => {
  "use strict";

  const ViewDelegateController = Controller.extend("z2fiori.controller.ViewDelegate", {
    onEvent(event, ...args) {
      sap.ui.require(["z2fiori/core/Dispatcher"], (Dispatcher) => {
        Dispatcher.send({ event, args });
      });
    }
  });

  return {
    async mount(xml) {
      if (!xml || typeof xml !== "string") return;

      const view = await XMLView.create({
        definition: xml,
        controller: new ViewDelegateController()
      });

      const model = State.getModel();
      if (model) view.setModel(model);

      const container = State.getContainer();
      if (!container) return;

      if (typeof container.addPage === "function") {
        const oldPages = container.getPages ? container.getPages().slice() : [];
        container.addPage(view);
        if (typeof container.to === "function") {
          container.to(view.getId(), "show");
        }
        oldPages.forEach((p) => {
          if (p && p !== view && typeof p.destroy === "function") {
            p.destroy();
          }
        });
      } else {
        container.destroyItems?.();
        container.addItem?.(view);
      }
    }
  };
});
