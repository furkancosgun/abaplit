sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/core/mvc/XMLView", "z2fiori/core/ControlUtil"],
  (Controller, XMLView, ControlUtil) => {
    "use strict";
    const NestedViewController = Controller.extend("z2fiori.controller.NestedView", {
      onEvent(event, ...args) {
        sap.ui.require(["z2fiori/core/Dispatcher"], (D) => D.send({ event, args }));
      },
    });
    return {
      NEST_VIEW_DISPLAY: async ({ ID, XML, METHOD_INSERT }, { model }) => {
        const target = ControlUtil.find(ID);
        const child = await XMLView.create({ definition: XML, controller: new NestedViewController() });
        child.setModel(model);
        target[METHOD_INSERT](child);
        target.invalidate();
      },
      NEST_VIEW_DESTROY: ({ ID, METHOD_DESTROY }) => {
        const target = ControlUtil.find(ID);
        target[METHOD_DESTROY]();
        target.invalidate();
      },
    };
  },
);
