sap.ui.define([
  "sap/ui/model/json/JSONModel"
], (JSONModel) => {
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
    dirty: false
  };

  const State = {
    get() {
      return state;
    },

    init(controller) {
      state.controller = controller;

      if (!state.booted) {
        state.booted = true;
        state.model = new JSONModel({});
        state.model.setSizeLimit(10000);

        const manifestUri = controller.getOwnerComponent?.()?.getManifestEntry?.("/sap/app/dataSources/http/uri");
        if (!manifestUri) {
          throw new Error("HTTP dataSource URI is missing in manifest.json (/sap/app/dataSources/http/uri).");
        }
        state.endpoint = manifestUri;

        const search = new URLSearchParams(location.search);
        state.app = (search.get("app") || "").trim().toUpperCase();
        if (!state.app) {
          throw new Error("Application name is missing. Add '?app=YOUR_APP_CLASS' to the URL.");
        }
      }

      controller.getView().setModel(state.model);
      state.container = state.container || controller.byId("appContainer");
    },

    setApp(appName) {
      state.app = (appName || "").trim().toUpperCase();
    },

    getApp() {
      return state.app;
    },

    getModel() {
      return state.model;
    },

    getModelData() {
      return state.model ? state.model.getData() : {};
    },

    setModelData(data) {
      if (state.model) {
        state.model.setData(typeof data === "string" ? JSON.parse(data || "{}") : (data || {}));
      }
    },

    getEndpoint() {
      return state.endpoint;
    },

    getContainer() {
      return state.container;
    },

    getQuery() {
      const search = new URLSearchParams(location.search);
      return Array.from(search, ([name, value]) => ({ name, value }));
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
      state.navigated = !!flag;
      state.prevArg = prevArg || "";
    },

    consumeNavigated() {
      const result = {
        navigated: state.navigated,
        prevArg: state.prevArg
      };
      state.navigated = false;
      state.prevArg = "";
      return result;
    },

    setDirty(isDirty) {
      state.dirty = !!isDirty;
    },

    isDirty() {
      return state.dirty;
    },

    addShortcut(shortcut) {
      state.shortcuts.push(shortcut);
    },

    getShortcuts() {
      return state.shortcuts;
    }
  };

  return State;
});
