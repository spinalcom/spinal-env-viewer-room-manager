import {
  SpinalContextApp
} from "spinal-env-viewer-context-menu-service";

import {
  groupService
} from "../services/service";

import {
  spinalPanelManagerService
} from "spinal-env-viewer-panel-manager-service";

class ColorConfig extends SpinalContextApp {
  constructor() {
    super("Edit", "This button allows  to edit group", {
      icon: "edit",
      icon_type: "in",
      backgroundColor: "#FF0000",
      fontColor: "#FFFFFF"
    });
  }

  // display(contextType, selectedNodeType) {

  //   let tempList = [
  //     EQUIPMENTS_GROUP,
  //     ROOMS_GROUP,
  //     EQUIPMENTS_CATEGORY,
  //     ROOMS_CATEGORY
  //   ];

  //   return (
  //     groupService.constants.CONTEXTS_TYPES.indexOf(contextType) !== -1 && (
  //       tempList.indexOf(
  //         selectedNodeType) !== -1)
  //   );
  // }

  isShown(option) {
    let contextType = option.context.type.get();
    let selectedNodeType = option.selectedNode.type.get();

    if (
      groupService.constants.CONTEXTS_TYPES.indexOf(contextType) !== -1 &&
      (groupService.constants.GROUPS_TYPES.indexOf(selectedNodeType) !== -1 ||
        selectedNodeType === groupService.constants.CATEGORY_TYPE)) {
      return Promise.resolve(true);
    }
    return Promise.resolve(-1);
  }

  action(option) {


    let type = option.selectedNode.type.get();

    let params = {
      edit: true,
      title: `Edit ${option.selectedNode.name.get()}`,
      type: "element",
      contextId: option.context.id.get(),
      selectedNode: option.selectedNode
    };

    if (groupService.constants.GROUPS_TYPES.indexOf(type) !== -1) {
      params["color"] = option.selectedNode.color ? option.selectedNode
        .color.get() : "#000000";
    } else if (type === groupService.constants.CATEGORY_TYPE) {
      params["iconSelected"] = option.selectedNode.icon ? option.selectedNode
        .icon.get() : undefined;
    }

    spinalPanelManagerService.openPanel("createGroupContextDialog",
      params);

    // spinalPanelManagerService.openPanel("colorConfigDialog", params);



  }
}

export default ColorConfig;