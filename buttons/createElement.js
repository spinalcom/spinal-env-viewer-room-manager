import {
  SpinalContextApp
} from "spinal-env-viewer-context-menu-service";

import {
  spinalPanelManagerService
} from "spinal-env-viewer-panel-manager-service";

import {
  groupService

} from "../services/service";

let typeLst = [
  ...groupService.constants.CONTEXTS_TYPES,
  ...groupService.constants.GROUPS_TYPES,
  groupService.constants.CATEGORY_TYPE
]

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


    if (groupService.constants.CONTEXTS_TYPES.indexOf(nodeType) !== -1) {
      parameters.title = "add Category";
    } else if (nodeType === groupService.constants.CATEGORY_TYPE) {
      parameters.title = "add Group";
    } else if (groupService.constants.GROUPS_TYPES.indexOf(nodeType) !== -1) {
      parameters["hide"] = true; //don't show the dialog modal
    }

    spinalPanelManagerService.openPanel("createGroupContextDialog",
      parameters);
  }
}

export default CreateElement;