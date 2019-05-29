import {
  SpinalContextApp
} from "spinal-env-viewer-context-menu-service";

import {
  spinalPanelManagerService
} from "spinal-env-viewer-panel-manager-service";



class ContextGroupBtn extends SpinalContextApp {
  constructor() {
    super("create Group", "This Button creates a group context", {
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
    let parameters = {
      title: "Create a Grouping Context",
      type: "context"
    }

    spinalPanelManagerService.openPanel("createGroupContextDialog",
      parameters);

  }

}


export default ContextGroupBtn;