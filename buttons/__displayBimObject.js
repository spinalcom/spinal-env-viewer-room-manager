import {
  SpinalContextApp
} from "spinal-env-viewer-context-menu-service";

import {
  ROOMS_GROUP_CONTEXT,
  ROOMS_GROUP,
  EQUIPMENTS_GROUP,
  EQUIPMENTS_GROUP_CONTEXT,
  ROOMS_GROUP_RELATION,
  EQUIPMENTS_GROUP_RELATION
} from "../js/service";

import {
  utilities,
  ItemsColoredMap
} from "../js/utilities";
import {
  SpinalGraphService
} from "spinal-env-viewer-graph-service";

class DisplayBimObjects extends SpinalContextApp {
  constructor() {
    super("view child", "color allBimObject", {
      icon: "visibility",
      icon_type: "in",
      backgroundColor: "#FF0000",
      fontColor: "#FFFFFF"
    });
  }

  display(contextType, selectedNodeType) {
    if (contextType === selectedNodeType) {
      return (
        contextType === ROOMS_GROUP_CONTEXT ||
        contextType === EQUIPMENTS_GROUP_CONTEXT
      );
    } else {
      return (
        (contextType === ROOMS_GROUP_CONTEXT ||
          contextType === EQUIPMENTS_GROUP_CONTEXT) &&
        (selectedNodeType === ROOMS_GROUP ||
          selectedNodeType === EQUIPMENTS_GROUP)
      );
    }
  }

  isShown(option) {
    let contextType = option.context.type.get();
    let selectedNodeType = option.selectedNode.type.get();
    let contextId = option.context.id.get();
    let selectedNodeId = option.selectedNode.id.get();

    if (
      this.display(contextType, selectedNodeType) &&
      selectedNodeId !== contextId
    ) {
      if (typeof ItemsColoredMap.get(selectedNodeId) !== "undefined") {
        this.buttonCfg.icon = "visibility_off";
      } else {
        this.buttonCfg.icon = "visibility";
      }
      return Promise.resolve(true);
    } else if (
      this.display(contextType, selectedNodeType) &&
      selectedNodeId === contextId
    ) {
      let relationName =
        contextType === ROOMS_GROUP_CONTEXT ?
        ROOMS_GROUP_RELATION :
        EQUIPMENTS_GROUP_RELATION;
      return SpinalGraphService.getChildren(contextId, [relationName]).then(
        children => {
          for (let index = 0; index < children.length; index++) {
            const element = children[index];
            if (typeof ItemsColoredMap.get(element.id.get()) ===
              "undefined") {
              this.buttonCfg.icon = "visibility";
              return true;
            }
          }
          this.buttonCfg.icon = "visibility_off";
          return true;
        }
      );
    } else {
      return Promise.resolve(-1);
    }
  }

  action(option) {
    let selectedNodeId = option.selectedNode.id.get();
    let contextId = option.context.id.get();

    if (selectedNodeId === contextId) {
      let isColored = this.icon === "visibility" ? false : true;
      this.icon = isColored ? "visibility" : "visibility_off";
      utilities.colorContext(option.context, isColored);
    } else {
      let isColored =
        typeof ItemsColoredMap.get(selectedNodeId) !== "undefined";

      utilities.colorElement(option.selectedNode, isColored).then(() => {
        this.icon = isColored ? "visibility" : "visibility_off";
      });
    }
  }
}

export default DisplayBimObjects;