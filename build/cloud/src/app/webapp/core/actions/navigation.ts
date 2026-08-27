import Navigation from "../Navigation";
import type { NavCallAction } from "../../types/Action";

export const navigationHandlers = {
  NAV_CALL: (payload: NavCallAction["PAYLOAD"]) => Navigation.callApp(payload),
  NAV_LEAVE: (payload: string) => Navigation.leaveApp(payload)
};
