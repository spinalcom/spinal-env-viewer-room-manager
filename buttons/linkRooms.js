import { SpinalContextApp } from "spinal-env-viewer-context-menu-service";
import { spinalPanelManagerService } from "spinal-env-viewer-panel-manager-service";
import { groupManagerService } from "spinal-env-viewer-plugin-group-manager-service";
import geographicService from "spinal-env-viewer-context-geographic-service";
import { spinalContextMenuService } from "spinal-env-viewer-context-menu-service";

const SIDEBAR = "GraphManagerSideBar";

class LinkRooms extends SpinalContextApp {
  constructor() {
    super("link Rooms", "This button allows to link rooms to Group", {
      icon: "settings_input_component",
      icon_type: "in",
      backgroundColor: "#FF0000",
      fontColor: "#FFFFFF",
    });
  }

  isShown(option) {
    let nodeType = option.selectedNode.type.get();

    let isRoomsGroup = groupManagerService.isRoomsGroup(nodeType);

    return Promise.resolve(isRoomsGroup ? true : -1);
  }

  action(option) {
    let nodeType = option.selectedNode.type.get();
    let contextId = option.context.id.get();
    let nodeId = option.selectedNode.id.get();

    spinalPanelManagerService.openPanel("linkRoomPanel", {
      contextId: contextId,
      nodeId: nodeId,
      type: nodeType,
      reference: {
        context: geographicService.constants.ROOM_REFERENCE_CONTEXT,
        relation: geographicService.constants.ROOM_RELATION,
      },
    });
  }
}

const linkRooms = new LinkRooms();

spinalContextMenuService.registerApp(SIDEBAR, linkRooms, [3]);

export default linkRooms;
