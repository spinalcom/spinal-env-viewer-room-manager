import {
  SpinalContextApp
} from "spinal-env-viewer-context-menu-service";

import {
  spinalPanelManagerService
} from "spinal-env-viewer-panel-manager-service";

import {
  ROOMS_GROUP_CONTEXT,
  EQUIPMENTS_GROUP_CONTEXT,
  ROOMS_GROUP,
  EQUIPMENTS_GROUP,
  ROOMS_CATEGORY,
  EQUIPMENTS_CATEGORY,
  typeLst
} from "../js/service";

class CreateElement extends SpinalContextApp {
  constructor() {
    super("create Context/Category/Group",
      "This Button creates a context, category or group", {
        icon: "add",
        icon_type: "in",
        backgroundColor: "#FF0000",
        fontColor: "#FFFFFF"
      });
  }

  isShown(option) {
    let type = option.selectedNode.type.get();
    // if (type === ROOMS_GROUP_CONTEXT || type === EQUIPMENTS_GROUP_CONTEXT)
    // return Promise.resolve(true);
    return Promise.resolve(typeLst.indexOf(type));
  }

  action(option) {
    let nodeType = option.selectedNode.type.get();

    let parameters = {
      title: "",
      type: "element",
      contextId: option.context.id.get(),
      selectedNode: option.selectedNode
    };


    if (nodeType === ROOMS_GROUP_CONTEXT || nodeType ===
      EQUIPMENTS_GROUP_CONTEXT) {
      parameters.title = "add Category";
    } else if (nodeType === ROOMS_CATEGORY || nodeType ===
      EQUIPMENTS_CATEGORY) {
      parameters.title = "add Group";
    } else if (nodeType === ROOMS_GROUP || nodeType === EQUIPMENTS_GROUP) {
      parameters["hide"] = true; //don't show the dialog modal
    }

    spinalPanelManagerService.openPanel("createGroupContextDialog",
      parameters);
  }
}

export default CreateElement;