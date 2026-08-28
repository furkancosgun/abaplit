sap.ui.define(["z2fiori/core/State", "z2fiori/core/DeviceUtil"], (State, DeviceUtil) => {
  "use strict";
  return {
    DEVICE_READ: (event, { dispatch }) => dispatch({ event, args: [JSON.stringify(DeviceUtil.getInfo())] }),
    LOCATION_READ: (event, { dispatch }) => dispatch({ event, args: [JSON.stringify(location)] }),
    QUERY_READ: (event, { dispatch }) => dispatch({ event, args: [JSON.stringify(State.getQuery())] }),
  };
});
