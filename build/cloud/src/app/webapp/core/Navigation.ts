import State from "./State";
import PopupManager from "./PopupManager";
import type { NavCallPayload } from "../types/Action";

let isPopping = false;

const Navigation = {
  callApp(payload: NavCallPayload): void {
    PopupManager.closeAll();

    const nextApp = payload.APP;
    const nextState = payload.STATE;

    State.pushNav({
      app: State.getApp(),
      state: JSON.stringify(State.getModelData())
    });

    history.pushState({ z2fioriNav: true, app: nextApp }, "");

    State.setApp(nextApp);
    State.setModelData(nextState);

    void import("./Dispatcher").then(({ default: Dispatcher }) => {
      void Dispatcher.send({
        checkInit: true,
        state: nextState
      });
    });
  },

  leaveApp(result: string, fromPopState = false): void {
    PopupManager.closeAll();

    const previous = State.popNav();

    if (!fromPopState) {
      isPopping = true;
      history.back();
      setTimeout(() => {
        isPopping = false;
      }, 100);
    }

    State.setApp(previous.app);
    State.setModelData(previous.state);
    State.setNavigated(true, result);

    void import("./Dispatcher").then(({ default: Dispatcher }) => {
      void Dispatcher.send({});
    });
  },

  handlePopState(): void {
    if (isPopping) return;

    if (PopupManager.hasPopups()) {
      PopupManager.close();
    } else if (State.hasNavStack()) {
      Navigation.leaveApp("", true);
    }
  }
};

export default Navigation;
