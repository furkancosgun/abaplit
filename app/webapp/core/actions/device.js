sap.ui.define(["z2fiori/core/State", "z2fiori/core/DeviceUtil"], (State, DeviceUtil) => {
  "use strict";
  return {
    DEVICE_READ: async (event, { dispatch }) => {
      const info = await DeviceUtil.getInfoWithCameras();
      dispatch({ event, args: [JSON.stringify(info)] });
    },
    CAMERA_LIST_READ: async (event, { dispatch }) => {
      const list = await DeviceUtil.getCameras();
      dispatch({ event, args: [JSON.stringify(list)] });
    },
    LOCATION_READ: (event, { dispatch }) => dispatch({ event, args: [JSON.stringify(location)] }),
    QUERY_READ: (event, { dispatch }) => dispatch({ event, args: [JSON.stringify(State.getQuery())] }),
  };
});
