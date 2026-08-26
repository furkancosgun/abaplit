sap.ui.define(["z2fiori/core/State"], (State) => {
  "use strict";

  return {
    register(shortcut) {
      if (!shortcut?.KEY || !shortcut?.EVENT) return;
      State.addShortcut({
        key: String(shortcut.KEY).toLowerCase(),
        ctrl: !!shortcut.CTRL,
        alt: !!shortcut.ALT,
        shift: !!shortcut.SHIFT,
        event: shortcut.EVENT,
        args: shortcut.EVENT_ARGS || []
      });
    },

    handleKeyDown(e) {
      for (const s of State.getShortcuts()) {
        if ((e.ctrlKey || false) === s.ctrl
          && (e.altKey || false) === s.alt
          && (e.shiftKey || false) === s.shift
          && String(s.key).toLowerCase() === e.key.toLowerCase()) {
          e.preventDefault();
          sap.ui.require(["z2fiori/core/Dispatcher"], (Dispatcher) => {
            Dispatcher.send({ event: s.event, args: s.args });
          });
          return;
        }
      }
    }
  };
});
