import {
  SpinalContextApp
} from "spinal-env-viewer-context-menu-service";
import {
  spinalPanelManagerService
} from "spinal-env-viewer-panel-manager-service";

import {
  ROOMS_GROUP_CONTEXT,
  EQUIPMENTS_GROUP_CONTEXT,
  ROOMS_GROUP,
  EQUIPMENTS_GROUP,
  ROOMS_CATEGORY,
  EQUIPMENTS_CATEGORY
} from "../js/service";



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
    // let contextType = option.context.type.get();
    let nodeType = option.selectedNode.type.get();

    let tempList = [ROOMS_GROUP_CONTEXT,
      EQUIPMENTS_GROUP_CONTEXT,
      ROOMS_GROUP,
      EQUIPMENTS_GROUP,
      ROOMS_CATEGORY,
      EQUIPMENTS_CATEGORY
    ]

    return Promise.resolve(tempList.indexOf(nodeType));
  }

  action(option) {
    let nodeType = option.selectedNode.type.get();
    let contextId = option.context.id.get();
    let nodeId = option.selectedNode.id.get();



    let tempList = [ROOMS_GROUP_CONTEXT,
      EQUIPMENTS_GROUP_CONTEXT,
      ROOMS_CATEGORY,
      EQUIPMENTS_CATEGORY
    ]

    if (tempList.indexOf(nodeType) === -1) {
      spinalPanelManagerService.openPanel(
        "linkRoomPanel",
        getParameter(
          contextId,
          nodeId,
          nodeType
        )
      );
    } else {
      spinalPanelManagerService.openPanel("globalLinkRoomPanel", {
        nodeId: nodeId,
        contextId: contextId
      })
    }

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
    context: nodeType === ROOMS_GROUP ? geographicService.constants
      .ROOM_REFERENCE_CONTEXT : bimobjectservice.constants
      .BIM_OBJECT_CONTEXT_TYPE,

    relation: nodeType === ROOMS_GROUP ?
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

// let getParameter2 = (
//   selectedContextId,
//   selectedContextRelation,
//   refContextName,
//   refContextRelation
// ) => {
//   let context = SpinalGraphService.getContext(refContextName);
//   return SpinalGraphService.getChildren(selectedContextId, [
//     selectedContextRelation
//   ]).then(async res => {
//     return {
//       contextId: selectedContextId,
//       groups: res,
//       elements: context ?
//         await SpinalGraphService.getChildren(context.info.id.get(), [
//           refContextRelation
//         ]) : []
//     };
//   });
// };

export default LinkRooms;