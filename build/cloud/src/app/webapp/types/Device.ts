export interface DeviceBrowser {
  name: string;
  version: string;
}

export interface DeviceOs {
  name: string;
  version: string;
}

export interface DeviceResize {
  width: number;
  height: number;
}

export interface DeviceSupport {
  touch: boolean;
  pointer: boolean;
  retina: boolean;
}

export interface DeviceInfo {
  system: string;
  orientation: string;
  browser: DeviceBrowser;
  os: DeviceOs;
  resize: DeviceResize;
  support: DeviceSupport;
}
