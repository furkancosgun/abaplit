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
          supported: hasMedia && typeof navigator.mediaDevices.getUserMedia === "function",
          hasMediaDevices: hasMedia,
          hasGetUserMedia: hasMedia && typeof navigator.mediaDevices.getUserMedia === "function",
          count: 0,
          list: [],
        },
      };
    },

    async getCameras() {
      if (!navigator.mediaDevices?.enumerateDevices) return [];
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        return devices
          .filter((d) => d.kind === "videoinput")
          .map((d, i) => ({
            deviceId: d.deviceId,
            label: d.label || `Camera ${i + 1}`,
            groupId: d.groupId,
            kind: d.kind,
          }));
      } catch {
        return [];
      }
    },

    async getInfoWithCameras() {
      const info = this.getInfo();
      try {
        const list = await this.getCameras();
        info.camera.list = list;
        info.camera.count = list.length;
      } catch {
        // keep empty list
      }
      return info;
    },
  };
});
