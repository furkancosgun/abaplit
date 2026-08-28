sap.ui.define(["sap/ui/Device"], (Device) => {
  "use strict";
  return {
    getInfo() {
      const hasMedia = !!navigator.mediaDevices;
      return {
        system: Device.system.phone ? "Mobile" : Device.system.tablet ? "Tablet" : "Desktop",
        orientation: Device.orientation.landscape ? "Landscape" : "Portrait",
        browser: Device.browser,
        os: Device.os,
        resize: { width: innerWidth, height: innerHeight },
        support: Device.support,
        camera: {
          supported: hasMedia && !!navigator.mediaDevices.getUserMedia,
          hasMediaDevices: hasMedia,
          hasGetUserMedia: hasMedia && typeof navigator.mediaDevices.getUserMedia === "function",
        },
      };
    },
  };
});
