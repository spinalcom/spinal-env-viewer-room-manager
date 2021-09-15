import { SpinalContextApp } from "spinal-env-viewer-context-menu-service";
import { spinalPanelManagerService } from "spinal-env-viewer-panel-manager-service";
import { spinalContextMenuService } from "spinal-env-viewer-context-menu-service";

const HEADERBAR = "GraphManagerTopBar";

class ContextGroupBtn extends SpinalContextApp {
  constructor() {
    super("create Group Context", "This Button creates a group context", {
      icon: "add",
      icon_type: "in",
      backgroundColor: "#FF0000",
      fontColor: "#FFFFFF"
    });
  }

  isShown() {
    return Promise.resolve(true);
  }

  action() {
    spinalPanelManagerService.openPanel("selectGroupTypeDialog");
  }

}

const contextGroupBtn = new ContextGroupBtn();

spinalContextMenuService.registerApp(HEADERBAR, contextGroupBtn, [3]);


export default contextGroupBtn;