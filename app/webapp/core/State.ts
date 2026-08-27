import JSONModel from "sap/ui/model/json/JSONModel";
import Controller from "sap/ui/core/mvc/Controller";
import App from "sap/m/App";
import UIComponent from "sap/ui/core/UIComponent";
import type { NavStackEntry } from "../types/NavStack";
import type { Query } from "../types/Query";

export interface ShortcutEntry {
  key: string;
  ctrl: boolean;
  alt: boolean;
  shift: boolean;
  event: string;
  args: string[];
}

interface StateData {
  booted: boolean;
  app: string;
  endpoint: string;
  model: JSONModel;
  container: App;
  controller: Controller;
  navStack: NavStackEntry[];
  shortcuts: ShortcutEntry[];
  prevArg: string;
  navigated: boolean;
  dirty: boolean;
}

const state = {
  booted: false,
  app: "",
  endpoint: "",
  model: null!,
  container: null!,
  controller: null!,
  navStack: [] as NavStackEntry[],
  shortcuts: [] as ShortcutEntry[],
  prevArg: "",
  navigated: false,
  dirty: false
} as StateData;

let cachedJson = "";
let cachedDataRef: Record<string, unknown> | null = null;

const State = {
  get(): StateData {
    return state;
  },

  init(controller: Controller): void {
    state.controller = controller;

    if (!state.booted) {
      state.booted = true;
      state.model = new JSONModel({});
      state.model.setSizeLimit(10000);

      const comp = controller.getOwnerComponent() as UIComponent;
      const manifest = comp.getManifest() as { "sap.app": { dataSources: { http: { uri: string } } } };
      state.endpoint = manifest["sap.app"].dataSources.http.uri;

      const compData = comp.getComponentData() as { startupParameters: Record<string, string[]> };
      const startupApp = compData.startupParameters.app?.[0];
      const hashSearch = new URLSearchParams(location.hash.split("?")[1] ?? "");
      const appFromHash = hashSearch.get("app");
      const search = new URLSearchParams(location.search);
      const appFromSearch = search.get("app");

      state.app = (startupApp ?? appFromHash ?? appFromSearch ?? "").trim().toUpperCase();
    }

    controller.getView()!.setModel(state.model);
    state.container = controller.byId("appContainer") as App;
  },

  setApp(appName: string): void {
    state.app = appName.trim().toUpperCase();
  },

  getApp(): string {
    return state.app;
  },

  getModel(): JSONModel {
    return state.model;
  },

  getModelData(): Record<string, unknown> {
    return state.model.getData() as Record<string, unknown>;
  },

  getStateJson(): string {
    const data = State.getModelData();
    if (cachedDataRef === data) return cachedJson;
    cachedDataRef = data;
    cachedJson = JSON.stringify(data);
    return cachedJson;
  },

  setModelData(data: string | Record<string, unknown>): void {
    const parsed = typeof data === "string" ? (JSON.parse(data) as Record<string, unknown>) : data;
    cachedDataRef = null;
    cachedJson = "";
    state.model.setData(parsed);
  },

  getEndpoint(): string {
    return state.endpoint;
  },

  getContainer(): App {
    return state.container;
  },

  getQuery(): Query {
    const search = new URLSearchParams(location.search);
    return Array.from(search, ([name, value]) => ({ name, value }));
  },

  pushNav(entry: NavStackEntry): void {
    state.navStack.push(entry);
  },

  popNav(): NavStackEntry {
    return state.navStack.pop() as NavStackEntry;
  },

  hasNavStack(): boolean {
    return state.navStack.length > 0;
  },

  setNavigated(flag: boolean, prevArg = ""): void {
    state.navigated = flag;
    state.prevArg = prevArg;
  },

  consumeNavigated(): { navigated: boolean; prevArg: string } {
    const result = { navigated: state.navigated, prevArg: state.prevArg };
    state.navigated = false;
    state.prevArg = "";
    return result;
  },

  setDirty(isDirty: boolean): void {
    state.dirty = isDirty;
  },

  isDirty(): boolean {
    return state.dirty;
  },

  addShortcut(shortcut: ShortcutEntry): void {
    state.shortcuts.push(shortcut);
  },

  getShortcuts(): ShortcutEntry[] {
    return state.shortcuts;
  }
};

export default State;
