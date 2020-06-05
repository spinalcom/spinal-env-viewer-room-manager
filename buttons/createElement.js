import {
  SpinalContextApp
} from "spinal-env-viewer-context-menu-service";

import {
  spinalPanelManagerService
} from "spinal-env-viewer-panel-manager-service";

import {
  groupManagerService
} from "spinal-env-viewer-plugin-group-manager-service";

import {
  bimObjectManagerService
} from "spinal-env-viewer-bim-manager-service";


// import {
//   groupService
// } from "../services/service";

// let typeLst = [
//   ...groupService.constants.CONTEXTS_TYPES,
//   ...groupService.constants.GROUPS_TYPES,
//   groupService.constants.CATEGORY_TYPE
// ]

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
    const type = option.selectedNode.type.get();
    // if (type === ROOMS_GROUP_CONTEXT || type === EQUIPMENTS_GROUP_CONTEXT)
    // return Promise.resolve(true);
    // return Promise.resolve(typeLst.indexOf(type));

    const isContext = groupManagerService.isContext(type);
    const isCategory = groupManagerService.isCategory(type);
    const isGroup = groupManagerService.isGroup(type);
    const isEquipmentGroup = groupManagerService.isEquipementGroup(type);

    if (isContext || isCategory || (isGroup && isEquipmentGroup)) {
      return Promise.resolve(true);
    }

    return Promise.resolve(-1);

  }

  action(option) {
    const nodeId = option.selectedNode.id.get();
    const type = option.selectedNode.type.get();
    const contextId = option.context.id.get();

    const parameters = {
      title: "",
      contextId: option.context.id.get(),
      selectedNode: option.selectedNode
    };

    if (groupManagerService.isContext(type)) {
      parameters.title = "add Category";
      spinalPanelManagerService.openPanel("createCategoryDialog",
        parameters);
    } else if (groupManagerService.isCategory(type)) {
      parameters.title = "add Group";
      spinalPanelManagerService.openPanel("createGroupDialog",
        parameters);
    } else {
      addBimObject(contextId, nodeId);
    }


    // if (groupService.constants.CONTEXTS_TYPES.indexOf(nodeType) !== -1) {
    //   parameters.title = "add Category";
    // } else if (nodeType === groupService.constants.CATEGORY_TYPE) {
    //   parameters.title = "add Group";
    // } else if (groupService.constants.GROUPS_TYPES.indexOf(nodeType) !== -1) {
    //   parameters["hide"] = true; //don't show the dialog modal
    // }

    // spinalPanelManagerService.openPanel("createGroupContextDialog",
    //   parameters);
  }
}

const addBimObject = (contextId, groupId) => {
  let selections = window.spinal.ForgeViewer.viewer.getAggregateSelection();

  if (selections.length === 0) {
    alert("select an item");
    return;
  }

  selections = selections.map(el => {
    return bimObjectManagerService.getLeafDbIds(el.model, el.selection);
  });

  Promise.all(selections).then(selected => {
    for (let idx = 0; idx < selected.length; idx++) {
      const {
        model,
        selection
      } = selected[idx];

      model.getBulkProperties(
        selection, {
          propFilter: ["name"]
        },
        el => {
          el.forEach(element => {
            window.spinal.BimObjectService.createBIMObject(
              element.dbId,
              element.name,
              model
            ).then(() => {

              window.spinal.BimObjectService.getBIMObject(
                element.dbId,
                model
              ).then(bimObject => {

                if (bimObject) {
                  const bimId = bimObject.id ?
                    bimObject.id.get() :
                    bimObject.info.id.get()

                  groupManagerService.linkElementToGroup(
                    contextId, groupId, bimId)

                }
              });
            });
          });
        }
      );
    }
  });
}


export default CreateElement;