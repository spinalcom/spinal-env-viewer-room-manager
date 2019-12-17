import {
  SpinalContextApp
} from "spinal-env-viewer-context-menu-service";


import {
  spinalPanelManagerService
} from "spinal-env-viewer-panel-manager-service";


import {
  groupService
} from "../services/service";



// import {
//   SpinalGraphService
// } from "spinal-env-viewer-graph-service";



import geographicService from "spinal-env-viewer-context-geographic-service";
import bimobjectservice from "spinal-env-viewer-plugin-bimobjectservice";

class LinkRooms extends SpinalContextApp {
  constructor() {
    super("link Rooms", "This button allows to link rooms to space", {
      icon: "settings_input_component",
      icon_type: "in",
      backgroundColor: "#FF0000",
      fontColor: "#FFFFFF"
    });
  }

  isShown(option) {
    /* Commenter pour desactiver le panel global */
    // let contextType = option.context.type
    // .get();


    let nodeType = option.selectedNode.type.get();

    // let tempList = [
    //   // ROOMS_GROUP_CONTEXT, /* Commenter pour desactiver le panel global */
    //   // EQUIPMENTS_GROUP_CONTEXT, /* Commenter pour desactiver le panel global */
    //   // ROOMS_CATEGORY, /* Commenter pour desactiver le panel global */
    //   // EQUIPMENTS_CATEGORY, /* Commenter pour desactiver le panel global */
    //   ROOMS_GROUP
    //   // EQUIPMENTS_GROUP
    // ]
    let value = nodeType === groupService.constants.ROOMS_GROUP ? true : -1;
    return Promise.resolve(value);
  }

  action(option) {
    let nodeType = option.selectedNode.type.get();
    let contextId = option.context.id.get();
    let nodeId = option.selectedNode.id.get();

    // let tempList = [
    //   ...groupService.constants.GROUPS_TYPES,
    //   groupService.constants.CATEGORY_TYPE
    // ]

    // if (tempList.indexOf(nodeType) === -1) {
    spinalPanelManagerService.openPanel(
      "linkRoomPanel",
      getParameter(
        contextId,
        nodeId,
        nodeType
      )
    );
    // } else {
    //   spinalPanelManagerService.openPanel("globalLinkRoomPanel", {
    //     nodeId: nodeId,
    //     contextId: contextId
    //   })
    // }

    // let selectedContextRelation =
    //   nodeType === ROOMS_GROUP_CONTEXT ?
    //   ROOMS_GROUP_RELATION :
    //   EQUIPMENTS_GROUP_RELATION;

    // let refContextName =
    //   nodeType === ROOMS_GROUP_CONTEXT ?
    //   geographicService.constants.ROOM_REFERENCE_CONTEXT :
    //   bimobjectservice.constants.BIM_OBJECT_CONTEXT_TYPE;

    // let refContextRelation =
    //   nodeType === ROOMS_GROUP_CONTEXT ?
    //   geographicService.constants.ROOM_RELATION :
    //   bimobjectservice.constants.BIM_OBJECT_RELATION_NAME;


  }
}

let getParameter = (contextId, nodeId, nodeType) => {
  let obj = {
    context: nodeType === groupService.constants.ROOMS_GROUP ?
      geographicService.constants
      .ROOM_REFERENCE_CONTEXT : bimobjectservice.constants
      .BIM_OBJECT_CONTEXT_TYPE,

    relation: nodeType === groupService.constants.ROOMS_GROUP ?
      geographicService.constants.ROOM_RELATION : bimobjectservice.constants
      .BIM_OBJECT_RELATION_NAME
  }


  return {
    contextId: contextId,
    nodeId: nodeId,
    type: nodeType,
    reference: obj
  }
}


export default LinkRooms;