sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/mvc/XMLView",
  "sap/m/MessageToast",
  "sap/m/MessageBox",
  "z2fiori/core/State",
  "z2fiori/core/ControlUtil",
  "z2fiori/core/PopupManager",
  "z2fiori/core/NavigationManager",
  "z2fiori/core/ShortcutManager",
  "z2fiori/core/DeviceUtil"
], (Controller, XMLView, MessageToast, MessageBox, State, ControlUtil, PopupManager, NavigationManager, ShortcutManager, DeviceUtil) => {
  "use strict";

  const NestedViewController = Controller.extend("z2fiori.controller.NestedView", {
    onEvent(event, ...args) {
      sap.ui.require(["z2fiori/core/Dispatcher"], (Dispatcher) => {
        Dispatcher.send({ event, args });
      });
    }
  });

  const registry = {
    POPUP: (xml, { controller, model }) => PopupManager.open(xml, controller, model),
    POPUP_CLOSE: () => PopupManager.close(),
    POPUPS_CLOSE_ALL: () => PopupManager.closeAll(),
    POPUP_CLOSE_ALL: () => PopupManager.closeAll(),

    NEST_VIEW_DISPLAY: async ({ ID, XML, METHOD_INSERT }, { model }) => {
      if (!ID || !XML || !METHOD_INSERT) throw new Error("NEST_VIEW_DISPLAY requires ID, XML, and METHOD_INSERT.");
      const target = ControlUtil.find(ID);
      if (!target) throw new Error(`Target element '${ID}' not found for NEST_VIEW_DISPLAY.`);
      if (typeof target[METHOD_INSERT] !== "function") throw new Error(`Method '${METHOD_INSERT}' not found on '${ID}'.`);

      const child = await XMLView.create({ definition: XML, controller: new NestedViewController() });
      if (model) child.setModel(model);
      target[METHOD_INSERT](child);
      target.invalidate?.();
    },

    NEST_VIEW_DESTROY: ({ ID, METHOD_DESTROY }) => {
      if (!ID || !METHOD_DESTROY) throw new Error("NEST_VIEW_DESTROY requires ID and METHOD_DESTROY.");
      const target = ControlUtil.find(ID);
      if (!target) throw new Error(`Target element '${ID}' not found for NEST_VIEW_DESTROY.`);
      if (typeof target[METHOD_DESTROY] !== "function") throw new Error(`Method '${METHOD_DESTROY}' not found on '${ID}'.`);

      target[METHOD_DESTROY]();
      target.invalidate?.();
    },

    TOAST: (p) => {
      if (!p?.TEXT) throw new Error("TOAST requires TEXT parameter.");
      MessageToast.show(p.TEXT, { duration: parseInt(p.DURATION, 10) || 3000 });
    },

    MESSAGE_BOX: (p, { dispatch }) => {
      const type = (p?.LEVEL || p?.TYPE || "information").toLowerCase();
      const text = p?.TEXT || "";
      const options = { title: p?.TITLE };

      if (!p?.CONFIRM_EVENT && !p?.CANCEL_EVENT) {
        if (typeof MessageBox[type] === "function") {
          return MessageBox[type](text, options);
        }
        return MessageBox.information(text, options);
      }
      MessageBox.show(text, {
        title: p.TITLE,
        actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
        emphasizedAction: MessageBox.Action.OK,
        onClose: (action) => dispatch({
          event: action === MessageBox.Action.OK ? p.CONFIRM_EVENT : p.CANCEL_EVENT
        })
      });
    },

    TITLE: (title) => {
      document.title = title || "";
    },

    FAVICON: (url) => {
      if (!url) throw new Error("FAVICON requires URL.");
      let link = document.querySelector("link[rel*='icon']") || Object.assign(document.createElement("link"), { rel: "shortcut icon" });
      link.href = url;
      document.head.appendChild(link);
    },

    FOCUS: (id) => {
      if (!id) throw new Error("FOCUS requires element ID.");
      const el = ControlUtil.find(id);
      if (!el || typeof el.focus !== "function") throw new Error(`Element '${id}' not found for FOCUS.`);
      el.focus();
    },

    SCROLL: (id) => {
      if (!id) throw new Error("SCROLL requires element ID.");
      const el = ControlUtil.find(id);
      if (!el?.getDomRef?.()) throw new Error(`Element '${id}' not found for SCROLL.`);
      el.getDomRef().scrollIntoView({ behavior: "smooth", block: "center" });
    },

    CLIPBOARD_WRITE: (text) => {
      navigator.clipboard.writeText(text || "").catch(() => {});
    },

    CLIPBOARD_READ: async (event, { dispatch }) => {
      if (!event) throw new Error("CLIPBOARD_READ requires event name.");
      try {
        const text = await navigator.clipboard.readText();
        dispatch({ event, args: [text] });
      } catch {
        dispatch({ event, args: [""] });
      }
    },

    DEVICE_READ: (event, { dispatch }) => {
      if (!event) throw new Error("DEVICE_READ requires event name.");
      dispatch({ event, args: [JSON.stringify(DeviceUtil.getInfo())] });
    },

    LOCATION_READ: (event, { dispatch }) => {
      if (!event) throw new Error("LOCATION_READ requires event name.");
      const loc = {
        origin: location.origin,
        pathname: location.pathname,
        search: location.search,
        hash: location.hash
      };
      dispatch({ event, args: [JSON.stringify(loc)] });
    },

    QUERY_READ: (event, { dispatch }) => {
      if (!event) throw new Error("QUERY_READ requires event name.");
      dispatch({ event, args: [JSON.stringify(State.getQuery())] });
    },

    OPEN_URL: (url) => {
      if (!url) throw new Error("OPEN_URL requires URL.");
      window.open(url, "_blank", "noopener,noreferrer");
    },

    RELOAD: () => {
      location.reload();
    },

    DIRTY: (isDirty) => {
      State.setDirty(isDirty);
    },

    SHORTCUTS: (p) => {
      ShortcutManager.register(p);
    },

    SCRIPT: (src) => {
      if (!src) throw new Error("SCRIPT requires src URL.");
      document.head.appendChild(Object.assign(document.createElement("script"), { src, defer: true }));
    },

    STYLE: (href) => {
      if (!href) throw new Error("STYLE requires href URL.");
      document.head.appendChild(Object.assign(document.createElement("link"), { href, rel: "stylesheet" }));
    },

    DOWNLOAD: (p) => {
      if (!p?.BASE64) throw new Error("DOWNLOAD requires BASE64 payload.");
      const a = Object.assign(document.createElement("a"), {
        href: `data:${p.TYPE || "application/octet-stream"};base64,${p.BASE64}`,
        download: p.FILENAME || "download"
      });
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },

    FOLLOW_UP: (p, { dispatch }) => {
      if (!p?.EVENT) throw new Error("FOLLOW_UP requires EVENT.");
      setTimeout(() => {
        dispatch({ event: p.EVENT, args: p.EVENT_ARGS || [] });
      }, parseInt(p.DELAY_MS, 10) || 0);
    },

    NAV_CALL: (payload) => NavigationManager.callApp(payload),
    NAV_LEAVE: (result) => NavigationManager.leaveApp(result)
  };

  return {
    register(type, handlerFn) {
      registry[type] = handlerFn;
    },

    async execute(action, context) {
      const fn = registry[action?.TYPE];
      if (!fn) throw new Error(`Unsupported action type '${action?.TYPE}'.`);
      await fn(action.PAYLOAD, context);
    }
  };
});
