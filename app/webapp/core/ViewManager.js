sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/core/mvc/XMLView", "z2fiori/core/State"],
  (Controller, XMLView, State) => {
    "use strict";

    const ViewController = Controller.extend("z2fiori.controller.ViewDelegate", {
      onEvent(event, ...args) {
        sap.ui.require(["z2fiori/core/Dispatcher"], (D) => D.send({ event, args }));
      },
    });

    return {
      async mount(xml) {
        const view = await XMLView.create({ definition: xml, controller: new ViewController() });
        view.setModel(State.getModel());
        const container = State.getContainer();
        const old = container.getPages().slice();
        container.addPage(view);
        container.to(view.getId());
        old.forEach((p) => p.destroy());
      },
    };
  },
);
