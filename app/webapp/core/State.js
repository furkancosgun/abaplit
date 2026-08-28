sap.ui.define(["sap/ui/model/json/JSONModel"], (JSONModel) => {
  "use strict";

  const state = {
    booted: false,
    app: "",
    endpoint: "",
    model: null,
    container: null,
    controller: null,
    navStack: [],
    shortcuts: [],
    prevArg: "",
    navigated: false,
    dirty: false,
  };

  return {
    get() {
      return state;
    },

    init(controller) {
      state.controller = controller;
      if (!state.booted) {
        state.booted = true;
        state.model = new JSONModel({});
        state.model.setSizeLimit(10000);
        const comp = controller.getOwnerComponent();
        state.endpoint = comp.getManifest()["sap.app"].dataSources.http.uri;
        const startupApp = comp.getComponentData()?.startupParameters?.app?.[0] || "";
        const appFromSearch = new URLSearchParams(location.search).get("app") || "";
        state.app = (startupApp || appFromSearch).trim().toUpperCase();
      }
      controller.getView().setModel(state.model);
      state.container = controller.byId("appContainer");
    },

    setApp(appName) {
      state.app = appName.trim().toUpperCase();
    },
    getApp() {
      return state.app;
    },
    getModel() {
      return state.model;
    },
    getModelData() {
      return state.model.getData();
    },
    setModelData(data) {
      state.model.setData(typeof data === "string" ? JSON.parse(data) : data);
    },
    getEndpoint() {
      return state.endpoint;
    },
    getContainer() {
      return state.container;
    },

    getQuery() {
      return Array.from(new URLSearchParams(location.search), ([name, value]) => ({ name, value }));
    },

    pushNav(entry) {
      state.navStack.push(entry);
    },
    popNav() {
      return state.navStack.pop();
    },
    hasNavStack() {
      return state.navStack.length > 0;
    },

    setNavigated(flag, prevArg = "") {
      state.navigated = flag;
      state.prevArg = prevArg;
    },
    consumeNavigated() {
      const res = { navigated: state.navigated, prevArg: state.prevArg };
      state.navigated = false;
      state.prevArg = "";
      return res;
    },

    setDirty(flag) {
      state.dirty = flag;
    },
    isDirty() {
      return state.dirty;
    },

    addShortcut(s) {
      state.shortcuts.push(s);
    },
    getShortcuts() {
      return state.shortcuts;
    },
  };
});
