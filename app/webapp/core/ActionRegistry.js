sap.ui.define(
  [
    "z2fiori/core/actions/popup",
    "z2fiori/core/actions/nest",
    "z2fiori/core/actions/feedback",
    "z2fiori/core/actions/focus",
    "z2fiori/core/actions/clipboard",
    "z2fiori/core/actions/device",
    "z2fiori/core/actions/system",
    "z2fiori/core/actions/navigation",
  ],
  (popup, nest, feedback, focus, clipboard, device, system, navigation) => {
    "use strict";

    const registry = {};

    function registerMany(map) {
      Object.assign(registry, map);
    }

    registerMany(popup);
    registerMany(nest);
    registerMany(feedback);
    registerMany(focus);
    registerMany(clipboard);
    registerMany(device);
    registerMany(system);
    registerMany(navigation);

    return {
      register(type, fn) {
        registry[type] = fn;
      },
      registerMany(map) {
        registerMany(map);
      },
      async execute(action, ctx) {
        const fn = registry[action.TYPE];
        if (!fn) throw new Error(`Unsupported action '${action.TYPE}'`);
        await fn(action.PAYLOAD, ctx);
      },
    };
  },
);
