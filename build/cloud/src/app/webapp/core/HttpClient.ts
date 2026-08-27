import State from "./State";
import type { HttpRequest, HttpResponse } from "../types/Http";
import type { DispatcherSendOptions } from "../types/Http";

let csrfToken: string | null = null;

const HttpClient = {
  buildPayload(opts: DispatcherSendOptions = {}): HttpRequest {
    const { event = "", args = [], checkInit = false, state } = opts;

    const cleanArgs = args.map((a) => (typeof a === "object" && a !== null ? JSON.stringify(a) : String(a)));

    const reqState =
      state !== undefined
        ? typeof state === "string"
          ? state
          : JSON.stringify(state)
        : checkInit
          ? "{}"
          : State.getStateJson();

    const { navigated, prevArg } = State.consumeNavigated();

    return {
      app: State.getApp(),
      event: String(event),
      event_args: cleanArgs,
      check_init: checkInit,
      check_navigated: navigated,
      check_nav_stack: State.hasNavStack(),
      nav_prev_arg: prevArg,
      state: reqState
    };
  },

  getCsrfToken(): string | null {
    return csrfToken;
  },

  setCsrfToken(token: string): void {
    if (token.toLowerCase() !== "required" && token.toLowerCase() !== "fetch") {
      csrfToken = token;
    }
  },

  async fetchCsrfToken(): Promise<string | null> {
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

  async post(payload: HttpRequest, retryOn403 = true): Promise<HttpResponse> {
    const url = State.getEndpoint();
    const headers: Record<string, string> = {
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
      return HttpClient.post(payload, false);
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return (await response.json()) as HttpResponse;
  }
};

export default HttpClient;
