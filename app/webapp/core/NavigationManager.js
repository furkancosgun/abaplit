sap.ui.define(["z2fiori/core/State", "z2fiori/core/PopupManager"], (State, PopupManager) => {
  "use strict";

  let isPopping = false;

  return {
    callApp({ APP, STATE }) {
      PopupManager.closeAll();
      State.pushSnapshot();
      history.pushState({ z2fioriNav: true }, "");
      State.createNext({ app: APP, state: STATE });
      State.setNavigated(true);
      sap.ui.require(["z2fiori/core/Dispatcher"], (D) => D.send({ checkInit: true, state: STATE }));
    },

    leaveApp(result = "", fromPopState = false) {
      PopupManager.closeAll();
      if (!State.hasNavStack()) return;
      if (!fromPopState) {
        isPopping = true;
        history.back();
        setTimeout(() => (isPopping = false), 100);
      }
      State.popSnapshot();
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
