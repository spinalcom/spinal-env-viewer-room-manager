import {
  SpinalContextApp
} from "spinal-env-viewer-context-menu-service";

import utilities from "../js/utilities";
import {
  ROOMS_GROUP_CONTEXT,
  EQUIPMENTS_GROUP_CONTEXT
} from "../js/service";

import geographicService from "spinal-env-viewer-context-geographic-service";

class ViewChildren extends SpinalContextApp {
  constructor() {
    super("color children", "color all bimobjects inside ", {
      icon_type: "in",
      backgroundColor: "#FF0000",
      fontColor: "#FFFFFF"
    })
  }

  isShown(option) {
    let contextType = option.context.type.get();
    let nodeType = option.selectedNode.type.get();

    if ((contextType === ROOMS_GROUP_CONTEXT || contextType ===
        EQUIPMENTS_GROUP_CONTEXT) && (nodeType !== geographicService.constants
        .EQUIPMENT_TYPE)) {
      return utilities.getIcon(option.selectedNode, option.context).then(
        (isColored) => {
          this.buttonCfg["isColored"] = isColored;
          this.buttonCfg.icon = isColored ? "visibility_off" : "visibility";
          return true;
        })

    } else {
      return Promise.resolve(-1);
    }

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