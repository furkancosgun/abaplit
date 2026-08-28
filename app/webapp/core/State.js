sap.ui.define(["sap/ui/model/json/JSONModel"], (JSONModel) => {
  "use strict";

  class AppState {
    constructor({ app, endpoint, modelData, controller, container }) {
      this.app = app;
      this.endpoint = endpoint;
      this.model = new JSONModel(modelData || {});
      this.model.setSizeLimit(10000);
      this.controller = controller;
      this.container = container;
      this.dirty = false;
      this.shortcuts = [];
      this.navigated = false;
      this.prevArg = "";
    }
  }

  let current = null;
  const stack = [];

  const State = {
    init(controller) {
      if (!current) {
        const comp = controller.getOwnerComponent();
        const endpoint = comp.getManifest()["sap.app"].dataSources.http.uri;
        const startupApp =
          comp.getComponentData()?.startupParameters?.app?.[0] || new URLSearchParams(location.search).get("app") || "";
        const app = startupApp.trim().toUpperCase();
        current = new AppState({
          app,
          endpoint,
          modelData: {},
          controller,
          container: controller.byId("appContainer"),
        });
      } else {
        current.controller = controller;
        current.container = controller.byId("appContainer");
      }
      controller.getView().setModel(current.model);
      return current;
    },

    getCurrent() {
      return current;
    },

    get() {
      return current;
    },

    getApp() {
      return current?.app || "";
    },

    setApp(app) {
      if (current) current.app = app.trim().toUpperCase();
    },

    getModel() {
      return current?.model || null;
    },

    getModelData() {
      return current?.model.getData() || {};
    },

    setModelData(data) {
      if (!current) return;
      const parsed = typeof data === "string" ? JSON.parse(data) : data;
      current.model.setData(parsed || {});
    },

    getEndpoint() {
      return current?.endpoint || "";
    },

    getContainer() {
      return current?.container || null;
    },

    getQuery() {
      return Array.from(new URLSearchParams(location.search), ([name, value]) => ({ name, value }));
    },

    pushSnapshot() {
      if (!current) return;
      const data = current.model.getData();
      const clone = typeof structuredClone === "function" ? structuredClone(data) : JSON.parse(JSON.stringify(data));
      stack.push({
        app: current.app,
        modelData: clone,
        dirty: current.dirty,
        shortcuts: [...current.shortcuts],
        navigated: current.navigated,
        prevArg: current.prevArg,
      });
    },

    createNext({ app, state }) {
      if (!current) throw new Error("State not initialized");
      const data = typeof state === "string" ? JSON.parse(state || "{}") : state || {};
      current = new AppState({
        app: app.trim().toUpperCase(),
        endpoint: current.endpoint,
        modelData: data,
        controller: current.controller,
        container: current.container,
      });
      current.controller.getView().setModel(current.model);
      return current;
    },

    popSnapshot() {
      const snap = stack.pop();
      if (!snap) return null;
      current.app = snap.app;
      current.model.setData(snap.modelData);
      current.dirty = snap.dirty;
      current.shortcuts = snap.shortcuts;
      current.navigated = snap.navigated;
      current.prevArg = snap.prevArg;
      current.controller.getView().setModel(current.model);
      return current;
    },

    hasNavStack() {
      return stack.length > 0;
    },

    setNavigated(flag, prevArg = "") {
      if (current) {
        current.navigated = flag;
        current.prevArg = prevArg;
      }
    },

    consumeNavigated() {
      const res = { navigated: !!current?.navigated, prevArg: current?.prevArg || "" };
      if (current) {
        current.navigated = false;
        current.prevArg = "";
      }
      return res;
    },

    setDirty(flag) {
      if (current) current.dirty = flag;
    },

    isDirty() {
      return !!current?.dirty;
    },

    addShortcut(s) {
      current?.shortcuts.push(s);
    },

    getShortcuts() {
      return current?.shortcuts || [];
    },

    clearShortcuts() {
      if (current) current.shortcuts = [];
    },
  };

  return State;
});
