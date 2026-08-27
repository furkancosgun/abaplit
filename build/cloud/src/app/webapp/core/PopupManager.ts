import Controller from "sap/ui/core/mvc/Controller";
import XMLView from "sap/ui/core/mvc/XMLView";
import Fragment from "sap/ui/core/Fragment";
import Dialog from "sap/m/Dialog";
import Popover from "sap/m/Popover";
import ResponsivePopover from "sap/m/ResponsivePopover";
import Control from "sap/ui/core/Control";
import Element from "sap/ui/core/Element";
import type JSONModel from "sap/ui/model/json/JSONModel";

type OverlayControl = Dialog | Popover | ResponsivePopover;

class PopupController extends Controller {
  constructor(sId = "z2fiori.popup.controller") {
    super(sId);
  }

  onEvent(event: string, ...args: unknown[]): void {
    void import("./Dispatcher").then(({ default: Dispatcher }) => {
      void Dispatcher.send({ event, args });
    });
  }
}

interface PopupEntry {
  instance: OverlayControl;
}

const stack: PopupEntry[] = [];

const PopupManager = {
  async open(xml: string, controller: Controller, model: JSONModel): Promise<void> {
    const popupCtrl = new PopupController();
    let instance: OverlayControl;

    if (xml.includes("FragmentDefinition")) {
      const loaded = await Fragment.load({ definition: xml, controller: popupCtrl });
      instance = (Array.isArray(loaded) ? loaded[0] : loaded) as OverlayControl;
    } else {
      const view = (await XMLView.create({ definition: xml, controller: popupCtrl })) as XMLView;
      const content = view.getContent() as Element[];
      const firstChild = content[0];

      const isNativeOverlay = firstChild?.isA("sap.m.Dialog") ||
                              firstChild?.isA("sap.m.Popover") ||
                              firstChild?.isA("sap.m.ResponsivePopover");

      instance = isNativeOverlay
        ? (firstChild as OverlayControl)
        : new Dialog({ draggable: true, resizable: true, content: [view] });
    }

    instance.setModel(model);
    controller.getView()!.addDependent(instance);

    const entry: PopupEntry = { instance };
    instance.attachEventOnce("afterClose", () => {
      const idx = stack.indexOf(entry);
      if (idx !== -1) stack.splice(idx, 1);
      instance.destroy();
    });

    stack.push(entry);

    if (instance.isA("sap.m.Dialog")) {
      (instance as Dialog).open();
    } else {
      const target = document.activeElement !== document.body 
        ? (document.activeElement as HTMLElement) 
        : (controller.getView()!.getDomRef() as HTMLElement);
      (instance as Popover | ResponsivePopover).openBy(target);
    }
  },

  close(): void {
    const top = stack[stack.length - 1];
    top?.instance.close();
  },

  closeAll(): void {
    for (let i = stack.length - 1; i >= 0; i--) {
      stack[i].instance.close();
    }
  },

  hasPopups(): boolean {
    return stack.length > 0;
  }
};

export default PopupManager;
