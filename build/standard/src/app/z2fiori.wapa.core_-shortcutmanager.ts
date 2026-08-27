import State from "./State";
import type { ShortcutPayload } from "../types/Action";

const ShortcutManager = {
  register(shortcut: ShortcutPayload): void {
    State.addShortcut({
      key: shortcut.KEY.toLowerCase(),
      ctrl: shortcut.CTRL,
      alt: shortcut.ALT,
      shift: shortcut.SHIFT,
      event: shortcut.EVENT,
      args: shortcut.EVENT_ARGS
    });
  },

  handleKeyDown(e: KeyboardEvent): void {
    for (const s of State.getShortcuts()) {
      if (e.ctrlKey === s.ctrl && e.altKey === s.alt && e.shiftKey === s.shift && s.key.toLowerCase() === e.key.toLowerCase()) {
        e.preventDefault();
        void import("./Dispatcher").then(({ default: Dispatcher }) => {
          void Dispatcher.send({ event: s.event, args: s.args });
        });
        return;
      }
    }
  }
};

export default ShortcutManager;
