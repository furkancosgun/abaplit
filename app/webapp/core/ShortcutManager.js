sap.ui.define(["z2fiori/core/State"], (State) => {
  "use strict";
  return {
    register({ KEY, CTRL, ALT, SHIFT, EVENT, EVENT_ARGS }) {
      State.addShortcut({
        key: KEY.toLowerCase(),
        ctrl: !!CTRL,
        alt: !!ALT,
        shift: !!SHIFT,
        event: EVENT,
        args: EVENT_ARGS || [],
      });
    },

    handleKeyDown(e) {
      for (const s of State.getShortcuts()) {
        if (e.ctrlKey === s.ctrl && e.altKey === s.alt && e.shiftKey === s.shift && e.key.toLowerCase() === s.key) {
          e.preventDefault();
          sap.ui.require(["z2fiori/core/Dispatcher"], (D) => D.send({ event: s.event, args: s.args }));
          return;
        }
      }
    },

    clear() {
      State.clearShortcuts();
    },
  };
});
