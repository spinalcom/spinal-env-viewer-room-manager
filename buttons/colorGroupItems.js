import { SpinalContextApp } from "spinal-env-viewer-context-menu-service";
import utilities from "../js/utilities";
import geographicService from "spinal-env-viewer-context-geographic-service";
import { groupManagerService } from "spinal-env-viewer-plugin-group-manager-service";
import { spinalContextMenuService } from "spinal-env-viewer-context-menu-service";

const SIDEBAR = "GraphManagerSideBar";


class ColorGroupItems extends SpinalContextApp {
  constructor() {
    super("color children", "color all bimobjects inside ", {
      icon_type: "in",
      backgroundColor: "#FF0000",
      fontColor: "#FFFFFF",
      icon: "visibility"
    })
  }

  isShown(option) {
    const nodeType = option.selectedNode.type.get();
    const contextType = option.context.type.get();

    const isRoomGroup = groupManagerService.isRoomGroupContext(contextType)
    const isEquipmentGroup = groupManagerService.isEquipmentGroupContext(contextType);

    if (!(isRoomGroup || isEquipmentGroup)) return Promise.resolve(-1);


    const isEquipement = nodeType === geographicService.constants.EQUIPMENT_TYPE;
    if (isEquipement) return Promise.resolve(-1);

    const isRoom = nodeType === geographicService.constants.ROOM_TYPE;
    if (isRoom) return Promise.resolve(-1);

    return Promise.resolve(true);

    // if (!isRoomOrEquipmentGroupContext || nodeType === geographicService
    //   .constants.EQUIPMENT_TYPE) {
    //   return Promise.resolve(-1);
    // }

    // return utilities.getIcon(option.selectedNode, option.context).then(
    //   (isColored) => {
    //     this.buttonCfg["isColored"] = isColored;
    //     this.buttonCfg.icon = isColored ? "visibility_off" : "visibility";
    //     return true;
    //   })

  }

  async action(option) {
    await utilities.colorItem(option.selectedNode);
    window.NOP_VIEWER.impl.invalidate(0, 1, 0)
  }

}

const colorGroupItems = new ColorGroupItems();

spinalContextMenuService.registerApp(SIDEBAR, colorGroupItems, [3]);

export default colorGroupItems;