import { SpinalContextApp } from "spinal-env-viewer-context-menu-service";
import { spinalPanelManagerService } from "spinal-env-viewer-panel-manager-service";

import {
  ROOMS_GROUP_CONTEXT,
  EQUIPMENTS_GROUP_CONTEXT,
  ROOMS_GROUP_RELATION,
  EQUIPMENTS_GROUP_RELATION
} from "../js/service";
import { SpinalGraphService } from "spinal-env-viewer-graph-service";

import geographicService from "spinal-env-viewer-context-geographic-service";
import bimobjectservice from "spinal-env-viewer-plugin-bimobjectservice";

class LinkRooms extends SpinalContextApp {
  constructor() {
    super("link Rooms", "This button allow to link rooms to space", {
      icon: "settings_input_component",
      icon_type: "in",
      backgroundColor: "#FF0000",
      fontColor: "#FFFFFF"
    });
  }

  isShown(option) {
    let type = option.selectedNode.type.get();
    // type == ROOMS_GROUP || type === EQUIPMENTS_GROUP ||
    if (type == ROOMS_GROUP_CONTEXT || type == EQUIPMENTS_GROUP_CONTEXT) {
      return Promise.resolve(true);
    }
    return Promise.resolve(-1);
  }

  action(option) {
    let type = option.selectedNode.type.get();
    let selectedContextId = option.context.id.get();

    let selectedContextRelation =
      type === ROOMS_GROUP_CONTEXT
        ? ROOMS_GROUP_RELATION
        : EQUIPMENTS_GROUP_RELATION;

    let refContextName =
      type === ROOMS_GROUP_CONTEXT
        ? geographicService.constants.ROOM_REFERENCE_CONTEXT
        : bimobjectservice.constants.BIM_OBJECT_CONTEXT_TYPE;

    let refContextRelation =
      type === ROOMS_GROUP_CONTEXT
        ? geographicService.constants.ROOM_RELATION
        : bimobjectservice.constants.BIM_OBJECT_RELATION_NAME;

    spinalPanelManagerService.openPanel(
      "linkRoomDialog",
      getParameter(
        selectedContextId,
        selectedContextRelation,
        refContextName,
        refContextRelation
      )
    );
  }
}

let getParameter = (
  selectedContextId,
  selectedContextRelation,
  refContextName,
  refContextRelation
) => {
  let context = SpinalGraphService.getContext(refContextName);
  return SpinalGraphService.getChildren(selectedContextId, [
    selectedContextRelation
  ]).then(async res => {
    return {
      contextId: selectedContextId,
      groups: res,
      elements: context
        ? await SpinalGraphService.getChildren(context.info.id.get(), [
            refContextRelation
          ])
        : []
    };
  });
};

export default LinkRooms;
