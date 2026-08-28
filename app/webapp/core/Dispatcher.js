sap.ui.define(
  [
    "sap/ui/core/BusyIndicator",
    "sap/m/MessageBox",
    "z2fiori/core/State",
    "z2fiori/core/ControlUtil",
    "z2fiori/core/HttpClient",
    "z2fiori/core/ViewManager",
    "z2fiori/core/ActionRegistry",
  ],
  (BusyIndicator, MessageBox, State, ControlUtil, HttpClient, ViewManager, ActionRegistry) => {
    "use strict";

    let busy = false;

    return {
      async send({ event = "", args = [], checkInit = false, state } = {}) {
        if (busy) return;
        busy = true;
        ControlUtil.blurActive();
        BusyIndicator.show(0);
        try {
          const res = await HttpClient.post(HttpClient.buildPayload({ event, args, checkInit, state }));
          await this.handleResponse(res);
        } catch (e) {
          MessageBox.error(e.message);
        } finally {
          BusyIndicator.hide();
          busy = false;
        }
      },

      async handleResponse({ success, message, app, view, state, t_actions = [] }) {
        if (!success) return MessageBox.error(message || "Unexpected server error");
        if (app) State.setApp(app);
        if (state) State.setModelData(state);
        if (view) await ViewManager.mount(view);
        const ctx = { controller: State.get().controller, model: State.getModel(), dispatch: (o) => this.send(o) };
        for (const a of t_actions) {
          try {
            await ActionRegistry.execute(a, ctx);
          } catch (e) {
            MessageBox.error(`Action '${a.TYPE}' failed: ${e.message}`);
          }
        }
      },
    };
  },
);
