import { SpinalContextApp } from "spinal-env-viewer-context-menu-service";
import { spinalPanelManagerService } from "spinal-env-viewer-panel-manager-service";
import { groupManagerService } from "spinal-env-viewer-plugin-group-manager-service";
import { spinalContextMenuService } from "spinal-env-viewer-context-menu-service";
import { bimObjectManagerService } from "spinal-env-viewer-bim-manager-service";

const SIDEBAR = "GraphManagerSideBar";

class CreateElement extends SpinalContextApp {
  constructor() {
    super(
      "create Context/Category/Group",
      "This Button creates a context, category or group",
      {
        icon: "add",
        icon_type: "in",
        backgroundColor: "#FF0000",
        fontColor: "#FFFFFF",
      }
    );
  }

  isShown(option) {
    const type = option.selectedNode.type.get();

    const isContext = groupManagerService.isContext(type);
    if (isContext) {
      this.label = "Create Category";
      return Promise.resolve(true);
    }

    const isCategory = groupManagerService.isCategory(type);
    if (isCategory) {
      this.label = "Create Group";
      return Promise.resolve(true);
    }

    const isGroup = groupManagerService.isGroup(type);
    const isEquipmentGroup = groupManagerService.isEquipementGroup(type);

    if (isGroup && isEquipmentGroup) {
      this.label = "Add equipments selected";
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
      selectedNode: option.selectedNode,
    };

    if (groupManagerService.isContext(type)) {
      parameters.title = "add Category";
      spinalPanelManagerService.openPanel("createCategoryDialog", parameters);
    } else if (groupManagerService.isCategory(type)) {
      parameters.title = "add Group";
      spinalPanelManagerService.openPanel("createGroupDialog", parameters);
    } else {
      // addBimObject(contextId, nodeId);
      spinalPanelManagerService.openPanel("addBimObjectToGroupDialog", {
        contextId,
        nodeId,
      });
    }
  }
}

const addBimObject = (contextId, groupId) => {
  let selections = window.spinal.ForgeViewer.viewer.getAggregateSelection();

  if (selections.length === 0) {
    alert("select an item");
    return;
  }

  selections = selections.map((el) => {
    return bimObjectManagerService.getLeafDbIds(el.model, el.selection);
  });

  Promise.all(selections).then((selected) => {
    for (let idx = 0; idx < selected.length; idx++) {
      const { model, selection } = selected[idx];

      model.getBulkProperties(
        selection,
        {
          propFilter: ["name"],
        },
        (el) => {
          el.forEach((element) => {
            window.spinal.BimObjectService.createBIMObject(
              element.dbId,
              element.name,
              model
            ).then(() => {
              window.spinal.BimObjectService.getBIMObject(
                element.dbId,
                model
              ).then((bimObject) => {
                if (bimObject) {
                  const bimId = bimObject.id
                    ? bimObject.id.get()
                    : bimObject.info.id.get();

                  groupManagerService.linkElementToGroup(
                    contextId,
                    groupId,
                    bimId
                  );
                }
              });
            });
          });
        }
      );
    }
  });
};

const createElement = new CreateElement();

spinalContextMenuService.registerApp(SIDEBAR, createElement, [3]);

export default createElement;
