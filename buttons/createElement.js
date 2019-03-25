import { SpinalContextApp } from "spinal-env-viewer-context-menu-service";

import { spinalPanelManagerService } from "spinal-env-viewer-panel-manager-service";

import { ROOMS_GROUP_CONTEXT, EQUIPMENTS_GROUP_CONTEXT } from "../js/service";

class CreateElement extends SpinalContextApp {
  constructor() {
    super("create Context Group", "This Button creates a group context", {
      icon: "add",
      icon_type: "in",
      backgroundColor: "#FF0000",
      fontColor: "#FFFFFF"
    });
  }

  isShown(option) {
    let type = option.selectedNode.type.get();
    if (type === ROOMS_GROUP_CONTEXT || type === EQUIPMENTS_GROUP_CONTEXT)
      return Promise.resolve(true);
    return Promise.resolve(-1);
  }

  action(option) {
    let parameters = {
      title: "Add Element",
      type: "element",
      selectedNode: option.selectedNode
    };

    spinalPanelManagerService.openPanel("createGroupContextDialog", parameters);
  }
}

export default CreateElement;
