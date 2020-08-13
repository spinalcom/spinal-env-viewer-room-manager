import {
  SpinalContextApp
} from "spinal-env-viewer-context-menu-service";

import utilities from "../js/utilities";
import {
  groupService
} from "../services/service";

import geographicService from "spinal-env-viewer-context-geographic-service";

import {
  groupManagerService
} from "spinal-env-viewer-plugin-group-manager-service";

class ViewChildren extends SpinalContextApp {
  constructor() {
    super("color children", "color all bimobjects inside ", {
      icon_type: "in",
      backgroundColor: "#FF0000",
      fontColor: "#FFFFFF"
    })
  }

  isShown(option) {
    const contextType = option.context.type.get();
    const nodeType = option.selectedNode.type.get();


    const isRoomOrEquipmentGroupContext = groupManagerService
      .isRoomGroupContext(contextType) || groupManagerService
      .isEquipmentGroupContext(contextType);


    if (!isRoomOrEquipmentGroupContext || nodeType === geographicService
      .constants.EQUIPMENT_TYPE) {
      return Promise.resolve(-1);
    }

    return utilities.getIcon(option.selectedNode, option.context).then(
      (isColored) => {
        this.buttonCfg["isColored"] = isColored;
        this.buttonCfg.icon = isColored ? "visibility_off" : "visibility";
        return true;
      })

  }

  action(option) {
    if (this.isColored) {
      this.icon = "visibility";
      this.isColored = false;
      utilities.restoreItem(option.selectedNode);
    } else {
      this.icon = "visibility_off";
      this.isColored = true;
      utilities.colorItem(option.selectedNode);
    }

    window.NOP_VIEWER.impl.invalidate(0, 1, 0)
  }

}



export default ViewChildren;