import {
  SpinalContextApp
} from "spinal-env-viewer-context-menu-service";
import {
  ROOMS_GROUP_CONTEXT,
  ROOMS_CATEGORY,
  EQUIPMENTS_GROUP_CONTEXT,
  EQUIPMENTS_CATEGORY
} from "../js/service";


class LinkerTable extends SpinalContextApp {

  constructor() {
    super("link room panel",
      'This button open the panel to link rooms or BimObject To group', {
        icon: "add_link",
        icon_type: "in",
        backgroundColor: "#FF0000",
        fontColor: "#FFFFFF"
      })
  }

  isShown(option) {
    let nodeType = option.selectedNode.type.get();

    if (nodeType === ROOMS_GROUP_CONTEXT || nodeType === ROOMS_CATEGORY ||
      nodeType === EQUIPMENTS_GROUP_CONTEXT || nodeType ===
      EQUIPMENTS_CATEGORY) {

      return Promise.resolve(true)
    }
    return Promise.resolve(-1);
  }


  action(option) {}

}