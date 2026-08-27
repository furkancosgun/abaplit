sap.ui.define([
  "sap/ui/core/BusyIndicator",
  "sap/m/MessageBox",
  "z2fiori/core/State",
  "z2fiori/core/ControlUtil",
  "z2fiori/core/HttpClient",
  "z2fiori/core/ViewManager",
  "z2fiori/core/ActionRegistry"
], (BusyIndicator, MessageBox, State, ControlUtil, HttpClient, ViewManager, ActionRegistry) => {
  "use strict";

  let isBusy = false;

  const Dispatcher = {
    async send({ event = "", args = [], checkInit = false, state } = {}) {
      if (isBusy) return;

      ControlUtil.blurActive();

      const payload = HttpClient.buildPayload({
        event,
        args,
        checkInit,
        state
      });

      isBusy = true;
      BusyIndicator.show(0);

      try {
        const responseData = await HttpClient.post(payload);
        isBusy = false;
        await Dispatcher.handleResponse(responseData);
      } catch (err) {
        MessageBox.error(`Network or Server Error: ${err.message}`);
      } finally {
        BusyIndicator.hide();
        isBusy = false;
      }
    },

    async handleResponse({ success, message, app, view, state: stateJson, t_actions = [] }) {
      if (!success) {
        return MessageBox.error(message || "Unexpected server error.");
      }

      if (app) State.setApp(app);
      if (stateJson) State.setModelData(stateJson);
      if (view) await ViewManager.mount(view);

      const context = {
        controller: State.get().controller,
        model: State.getModel(),
        dispatch: (opts) => Dispatcher.send(opts)
      };

      for (const act of t_actions) {
        try {
          await ActionRegistry.execute(act, context);
        } catch (err) {
          MessageBox.error(`Action '${act.TYPE}' Error: ${err.message}`);
        }
      }
    }
  };

  return Dispatcher;
});
