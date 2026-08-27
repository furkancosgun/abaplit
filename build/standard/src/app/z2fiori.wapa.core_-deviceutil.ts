import Device from "sap/ui/Device";
import type { DeviceInfo } from "../types/Device";

const DeviceUtil = {
  getInfo(): DeviceInfo {
    return {
      system: Device.system.phone ? "Mobile" : Device.system.tablet ? "Tablet" : "Desktop",
      orientation: Device.orientation.landscape ? "Landscape" : "Portrait",
      browser: { name: String(Device.browser.name ?? ""), version: String(Device.browser.version ?? "") },
      os: { name: String(Device.os.name ?? ""), version: String(Device.os.version ?? "") },
      resize: { width: window.innerWidth ?? 0, height: window.innerHeight ?? 0 },
      support: { touch: !!Device.support?.touch, pointer: "PointerEvent" in window, retina: !!Device.support?.retina }
    };
  }
};

export default DeviceUtil;
