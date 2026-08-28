sap.ui.define(["z2fiori/core/State"], (State) => {
  "use strict";

  let csrfToken = null;

  return {
    buildPayload({ event = "", args = [], checkInit = false, state } = {}) {
      const cleanArgs = args.map((a) => (typeof a === "object" && a !== null ? JSON.stringify(a) : String(a)));
      const reqState =
        state !== undefined
          ? typeof state === "string"
            ? state
            : JSON.stringify(state)
          : checkInit
            ? "{}"
            : JSON.stringify(State.getModelData());
      const { navigated, prevArg } = State.consumeNavigated();
      return {
        app: State.getApp(),
        event,
        event_args: cleanArgs,
        check_init: checkInit,
        check_navigated: navigated,
        check_nav_stack: State.hasNavStack(),
        nav_prev_arg: prevArg,
        state: reqState,
      };
    },

    async fetchCsrfToken() {
      const res = await fetch(State.getEndpoint(), { headers: { "X-CSRF-Token": "Fetch" } });
      const token = res.headers.get("x-csrf-token");
      if (token) csrfToken = token;
      return token;
    },

    async post(payload, retry = true) {
      const res = await fetch(State.getEndpoint(), {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken || "Fetch" },
        body: JSON.stringify(payload),
      });
      const token = res.headers.get("x-csrf-token");
      if (token) csrfToken = token;
      if (res.status === 403 && retry) {
        await this.fetchCsrfToken();
        return this.post(payload, false);
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      return res.json();
    },
  };
});
