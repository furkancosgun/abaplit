sap.ui.define([
  "z2fiori/core/State"
], (State) => {
  "use strict";

  let csrfToken = null;

  const HttpClient = {
    buildPayload({ event = "", args = [], checkInit = false, state } = {}) {
      const cleanArgs = (Array.isArray(args) ? args : [])
        .filter((a) => a !== undefined && !(a && typeof a.getSource === "function"))
        .map((a) => (typeof a === "object" && a !== null ? JSON.stringify(a) : String(a)));

      const reqState = state !== undefined
        ? (typeof state === "string" ? state : JSON.stringify(state))
        : (checkInit ? "{}" : JSON.stringify(State.getModelData()));

      const { navigated, prevArg } = State.consumeNavigated();

      return {
        app: State.getApp(),
        event: String(event || ""),
        event_args: cleanArgs,
        check_init: !!checkInit,
        check_navigated: navigated,
        check_nav_stack: State.hasNavStack(),
        nav_prev_arg: prevArg,
        state: reqState
      };
    },

    getCsrfToken() {
      return csrfToken;
    },

    setCsrfToken(token) {
      if (token && token.toLowerCase() !== "required" && token.toLowerCase() !== "fetch") {
        csrfToken = token;
      }
    },

    async fetchCsrfToken() {
      const url = State.getEndpoint();
      try {
        const res = await fetch(url, {
          method: "GET",
          headers: { "X-CSRF-Token": "Fetch" }
        });
        const token = res.headers.get("x-csrf-token") || res.headers.get("X-CSRF-Token");
        if (token) HttpClient.setCsrfToken(token);
        return token;
      } catch {
        return null;
      }
    },

    async post(payload, retryOn403 = true) {
      const url = State.getEndpoint();
      const headers = {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken || "Fetch"
      };

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });

      const returnedToken = response.headers.get("x-csrf-token") || response.headers.get("X-CSRF-Token");
      if (returnedToken) HttpClient.setCsrfToken(returnedToken);

      if (response.status === 403 && retryOn403) {
        await HttpClient.fetchCsrfToken();
        return await HttpClient.post(payload, false);
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    }
  };

  return HttpClient;
});
