/**
 * HTTP DTOs – 1:1 mapping of ABAP types z2fiori_if_types=>ty_s_http_req / ty_s_http_res
 * Wire names use snake_case exactly as serialized by ABAP response_builder/request_parser.
 */

import type { Action } from "./Action";

export interface HttpRequest {
  app: string;
  event: string;
  event_args: string[];
  check_init: boolean;
  check_navigated: boolean;
  check_nav_stack: boolean;
  state: string;
  nav_prev_arg: string;
}

export interface HttpResponse {
  success: boolean;
  app: string;
  view: string;
  state: string;
  t_actions: Action[];
  message: string;
}

export interface DispatcherSendOptions {
  event?: string;
  args?: unknown[];
  checkInit?: boolean;
  state?: string | object;
}
