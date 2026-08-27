import Controller from "sap/ui/core/mvc/Controller";
import XMLView from "sap/ui/core/mvc/XMLView";
import State from "./State";

class ViewDelegateController extends Controller {
  constructor(sId = "z2fiori.dynamic.controller") {
    super(sId);
  }

  onEvent(event: string, ...args: unknown[]): void {
    void import("./Dispatcher").then(({ default: Dispatcher }) => {
      void Dispatcher.send({ event, args });
    });
  }
}

const ViewManager = {
  async mount(xml: string): Promise<void> {
    const view = (await XMLView.create({
      definition: xml,
      controller: new ViewDelegateController()
    })) as XMLView;

    view.setModel(State.getModel());

    const container = State.getContainer();
    const oldPages = container.getPages().slice();
    container.addPage(view);
    container.to(view.getId());
    oldPages.forEach((p) => {
      if (p !== view) p.destroy();
    });
  }
};

export default ViewManager;
