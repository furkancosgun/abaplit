sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageBox",
  "z2fiori/core/State",
  "z2fiori/core/Dispatcher",
  "z2fiori/core/NavigationManager",
  "z2fiori/core/ShortcutManager",
  "z2fiori/core/PopupManager"
], (Controller, MessageBox, State, Dispatcher, NavigationManager, ShortcutManager, PopupManager) => {
  "use strict";

  const _onKeyDown = (e) => ShortcutManager.handleKeyDown(e);
  const _onPopState = () => NavigationManager.handlePopState();
  const _onBeforeUnload = (e) => {
    if (State.isDirty()) {
      e.preventDefault();
      e.returnValue = "";
    }
  };

  return Controller.extend("z2fiori.controller.App", {
    onEvent(event, ...args) {
      Dispatcher.send({ event, args });
    },

    onInit() {
      try {
        State.init(this);
      } catch (err) {
        return MessageBox.error(err.message);
      }

      document.addEventListener("keydown", _onKeyDown);
      window.addEventListener("popstate", _onPopState);
      window.addEventListener("beforeunload", _onBeforeUnload);

      Dispatcher.send({ checkInit: true });
    },

    onExit() {
      document.removeEventListener("keydown", _onKeyDown);
      window.removeEventListener("popstate", _onPopState);
      window.removeEventListener("beforeunload", _onBeforeUnload);
      PopupManager.closeAll();
    }
  });
});
