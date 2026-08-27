import Controller from "sap/ui/core/mvc/Controller";
import MessageBox from "sap/m/MessageBox";
import State from "../core/State";
import Dispatcher from "../core/Dispatcher";
import Navigation from "../core/Navigation";
import ShortcutManager from "../core/ShortcutManager";
import PopupManager from "../core/PopupManager";

/**
 * @namespace z2fiori.controller
 */
export default class App extends Controller {
  private readonly onKeyDown = (e: KeyboardEvent): void => ShortcutManager.handleKeyDown(e);
  private readonly onPopState = (): void => Navigation.handlePopState();
  private readonly onBeforeUnload = (e: BeforeUnloadEvent): void => {
    if (State.isDirty()) {
      e.preventDefault();
      e.returnValue = "";
    }
  };

  public onEvent(event: string, ...args: unknown[]): void {
    void Dispatcher.send({ event, args });
  }

  public onInit(): void {
    try {
      State.init(this);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      MessageBox.error(msg);
      return;
    }

    document.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("popstate", this.onPopState);
    window.addEventListener("beforeunload", this.onBeforeUnload);

    void Dispatcher.send({ checkInit: true });
  }

  public onExit(): void {
    document.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("popstate", this.onPopState);
    window.removeEventListener("beforeunload", this.onBeforeUnload);
    PopupManager.closeAll();
  }
}
