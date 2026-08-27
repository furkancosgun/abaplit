import State from "../State";
import DeviceUtil from "../DeviceUtil";
import type { ActionContext } from "../../types/Action";

export const deviceHandlers = {
  DEVICE_READ: (payload: string, ctx: ActionContext) => {
    void ctx.dispatch({ event: payload, args: [JSON.stringify(DeviceUtil.getInfo())] });
  },

  LOCATION_READ: (payload: string, ctx: ActionContext) => {
    const loc = {
      origin: location.origin,
      pathname: location.pathname,
      search: location.search,
      hash: location.hash
    };
    void ctx.dispatch({ event: payload, args: [JSON.stringify(loc)] });
  },

  QUERY_READ: (payload: string, ctx: ActionContext) => {
    void ctx.dispatch({ event: payload, args: [JSON.stringify(State.getQuery())] });
  }
};
