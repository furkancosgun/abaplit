sap.ui.define([
  "z2fiori/core/State",
  "z2fiori/core/PopupManager"
], (State, PopupManager) => {
  "use strict";

  let _isPopping = false;

  return {
    callApp(payload) {
      PopupManager.closeAll();

      const nextApp = typeof payload === "string" ? payload : payload?.APP;
      const nextState = (typeof payload === "object" && payload?.STATE) ? payload.STATE : "{}";

      if (!nextApp) return;

      State.pushNav({
        app: State.getApp(),
        state: JSON.stringify(State.getModelData())
      });

      try {
        history.pushState({ z2fioriNav: true, app: nextApp }, "");
      } catch {
        // Fallback for restricted environments
      }

      State.setApp(nextApp);
      State.setModelData(nextState);

      sap.ui.require(["z2fiori/core/Dispatcher"], (Dispatcher) => {
        Dispatcher.send({
          checkInit: true,
          state: typeof nextState === "string" ? nextState : JSON.stringify(nextState || {})
        });
      });
    },

    leaveApp(result, fromPopState = false) {
      PopupManager.closeAll();

      const previous = State.popNav();
      if (!previous) return;

      if (!fromPopState) {
        _isPopping = true;
        try {
          history.back();
        } catch {
          // ignore
        }
        setTimeout(() => { _isPopping = false; }, 100);
      }

      State.setApp(previous.app);
      State.setModelData(previous.state);
      State.setNavigated(true, result ?? "");

      sap.ui.require(["z2fiori/core/Dispatcher"], (Dispatcher) => {
        Dispatcher.send({});
      });
    },

    handlePopState() {
      if (_isPopping) return;

      if (PopupManager.hasPopups()) {
        PopupManager.close();
      } else if (State.hasNavStack()) {
        this.leaveApp("", true);
      }
    }
  };
});
