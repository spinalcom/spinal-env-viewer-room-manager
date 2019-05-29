import {
  SpinalContextApp
} from "spinal-env-viewer-context-menu-service";

import utilities from "../js/utilities";

class ViewChildren extends SpinalContextApp {
  constructor() {
    super("color children", "color all bimobjects inside ", {
      icon_type: "in",
      backgroundColor: "#FF0000",
      fontColor: "#FFFFFF"
    })
  }

  isShown(option) {
    return utilities.getIcon(option.selectedNode, option.context).then(el => {
        this.buttonCfg.icon = "visibility";
        return true;
      })
      .catch(() => {
        return -1;
      })
  }

  action(option) {
    console.log("yes")
  }

}







export default ViewChildren;