sap.ui.define(["sap/ui/Device"], (Device) => {
  "use strict";
  return {
    getInfo() {
      return {
        system: Device.system.phone ? "Mobile" : Device.system.tablet ? "Tablet" : "Desktop",
        orientation: Device.orientation.landscape ? "Landscape" : "Portrait",
        browser: Device.browser,
        os: Device.os,
        resize: { width: innerWidth, height: innerHeight },
        support: Device.support,
      };
    },
  };
});
