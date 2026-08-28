sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/core/mvc/XMLView", "sap/m/MessageBox", "z2fiori/core/State"],
  (Controller, XMLView, MessageBox, State) => {
    "use strict";

    const ViewController = Controller.extend("z2fiori.controller.ViewDelegate", {
      onEvent(event, ...args) {
        sap.ui.require(["z2fiori/core/Dispatcher"], (D) => D.send({ event, args }));
      },
    });

    const cache = new Map();

    function hashXml(xml) {
      let h = 0;
      for (let i = 0; i < xml.length; i++) h = (h * 31 + xml.charCodeAt(i)) >>> 0;
      return String(h);
    }

    return {
      async mount(xml) {
        try {
          const key = hashXml(xml);
          let view = cache.get(key);

          if (!view || view.isDestroyed?.()) {
            view = await XMLView.create({ definition: xml, controller: new ViewController() });
            cache.set(key, view);
            if (cache.size > 20) {
              const firstKey = cache.keys().next().value;
              const evict = cache.get(firstKey);
              if (evict && evict !== view && !evict.isDestroyed?.()) {
                try {
                  evict.destroy();
                } catch (e) {
                  void e;
                }
              }
              cache.delete(firstKey);
            }
          }

          view.setModel(State.getModel());
          const container = State.getContainer();
          const old = container.getPages().slice();
          container.addPage(view);
          container.to(view.getId());
          old.forEach((p) => {
            if (p !== view) p.destroy();
          });
        } catch (e) {
          MessageBox.error(`View mount failed: ${e.message}`);
        }
      },

      clearCache() {
        cache.forEach((v) => {
          try {
            if (!v.isDestroyed?.()) v.destroy();
          } catch (e) {
            void e;
          }
        });
        cache.clear();
      },
    };
  },
);
