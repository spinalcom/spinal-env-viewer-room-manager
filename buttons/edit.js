import {
  SpinalContextApp
} from "spinal-env-viewer-context-menu-service";

// import {
//   groupService
// } from "../services/service";

import {
  groupManagerService
} from "spinal-env-viewer-plugin-group-manager-service";

import {
  spinalPanelManagerService
} from "spinal-env-viewer-panel-manager-service";

class Edit extends SpinalContextApp {
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

    const isContext = groupManagerService.isContext(contextType);
    const isCategory = groupManagerService.isCategory(selectedNodeType);
    const isGroup = groupManagerService.isGroup(selectedNodeType);

    if (isContext && (isGroup || isCategory)) {
      return Promise.resolve(true);
    }

    return Promise.resolve(-1);
  }

  action(option) {


    let type = option.selectedNode.type.get();

    let params = {
      edit: true,
      title: `Edit ${option.selectedNode.name.get()}`,
      contextId: option.context.id.get(),
      selectedNode: option.selectedNode
    };

    if (groupManagerService.isGroup(type)) {
      params["color"] = option.selectedNode.color ? option.selectedNode
        .color.get() : "#000000";
      spinalPanelManagerService.openPanel("createGroupDialog", params);

    } else if (groupManagerService.isCategory(type)) {
      params["iconSelected"] = option.selectedNode.icon ? option.selectedNode
        .icon.get() : undefined;

      spinalPanelManagerService.openPanel("createCategoryDialog", params);
    }

    // spinalPanelManagerService.openPanel("colorConfigDialog", params);

  }
}

export default Edit;