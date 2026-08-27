import BusyIndicator from "sap/ui/core/BusyIndicator";
import MessageBox from "sap/m/MessageBox";
import State from "./State";
import ControlUtil from "./ControlUtil";
import HttpClient from "./HttpClient";
import ViewManager from "./ViewManager";
import ActionRegistry from "./ActionRegistry";
import type { HttpResponse, DispatcherSendOptions } from "../types/Http";

let isBusy = false;

const Dispatcher = {
  async send(opts: DispatcherSendOptions = {}): Promise<void> {
    if (isBusy) return;

    ControlUtil.blurActive();

    const payload = HttpClient.buildPayload(opts);

    isBusy = true;
    BusyIndicator.show(0);

    try {
      const responseData = await HttpClient.post(payload);
      isBusy = false;
      await Dispatcher.handleResponse(responseData);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      MessageBox.error(`Network or Server Error: ${message}`);
    } finally {
      BusyIndicator.hide();
      isBusy = false;
    }
  },

  async handleResponse(res: HttpResponse): Promise<void> {
    const { success, message, app, view, state: stateJson, t_actions } = res;

    if (!success) {
      MessageBox.error(message || "Unexpected server error.");
      return;
    }

    State.setApp(app);
    State.setModelData(stateJson);
    if (view) await ViewManager.mount(view);

    const context = {
      controller: State.get().controller,
      model: State.getModel(),
      dispatch: (innerOpts: DispatcherSendOptions) => Dispatcher.send(innerOpts)
    };

    for (const act of t_actions) {
      try {
        await ActionRegistry.execute(act, context);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        MessageBox.error(`Action '${act.TYPE}' Error: ${msg}`);
      }
    }
  }
};

export default Dispatcher;
