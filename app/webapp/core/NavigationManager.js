sap.ui.define(["z2fiori/core/State", "z2fiori/core/PopupManager"], (State, PopupManager) => {
  "use strict";

  let isPopping = false;

  return {
    callApp({ APP, STATE }) {
      PopupManager.closeAll();
      State.pushNav({ app: State.getApp(), state: JSON.stringify(State.getModelData()) });
      history.pushState({ z2fioriNav: true }, "");
      State.setApp(APP);
      State.setModelData(STATE);
      sap.ui.require(["z2fiori/core/Dispatcher"], (D) => D.send({ checkInit: true, state: STATE }));
    },

    leaveApp(result = "", fromPopState = false) {
      PopupManager.closeAll();
      const prev = State.popNav();
      if (!prev) return;
      if (!fromPopState) {
        isPopping = true;
        history.back();
        setTimeout(() => (isPopping = false), 100);
      }
      State.setApp(prev.app);
      State.setModelData(prev.state);
      State.setNavigated(true, result);
      sap.ui.require(["z2fiori/core/Dispatcher"], (D) => D.send({}));
    },

    handlePopState() {
      if (isPopping) return;
      if (PopupManager.hasPopups()) PopupManager.close();
      else if (State.hasNavStack()) this.leaveApp("", true);
    },
  };
});
