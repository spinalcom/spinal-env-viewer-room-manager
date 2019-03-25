import {
  SPINAL_RELATION_LST_PTR_TYPE,
  SpinalGraphService
} from "spinal-env-viewer-graph-service";

import {
  Model
} from "spinal-core-connectorjs_type";

const ROOMS_GROUP_CONTEXT = "RoomsGroupContext";
const ROOMS_GROUP = "RoomsGroup";

const EQUIPMENTS_GROUP = "EquipmentGroup";
const EQUIPMENTS_GROUP_CONTEXT = "EquipmentGroupContext";

const ROOMS_GROUP_RELATION = "hasRoomsGroup";
const EQUIPMENTS_GROUP_RELATION = "hasEquipmentsGroup";

const ROOMS_TO_ELEMENT_RELATION = "groupHasRooms";
const EQUIPMENTS_TO_ELEMENT_RELATION = "groupHasEquipments";

let groupService = {
  createGroupContext(name, type) {
    const context = SpinalGraphService.getContext(name);

    if (typeof context !== "undefined") return Promise.resolve(false);

    return SpinalGraphService.addContext(
      name,
      type,
      new Model({
        name: name
      })
    );
  },
  addElement(contextId, contextType, elementName) {
    let type =
      contextType === ROOMS_GROUP_CONTEXT ? ROOMS_GROUP : EQUIPMENTS_GROUP;

    let relationName =
      contextType === ROOMS_GROUP_CONTEXT ?
      ROOMS_GROUP_RELATION :
      EQUIPMENTS_GROUP_RELATION;

    let childId = SpinalGraphService.createNode({
        name: elementName,
        type: type
      },
      new Model({
        name: elementName
      })
    );

    return SpinalGraphService.addChildInContext(
      contextId,
      childId,
      contextId,
      relationName,
      SPINAL_RELATION_LST_PTR_TYPE
    );
  },
  elementIsLinkedToGroup(groupId, elementId) {
    let type = SpinalGraphService.getInfo(groupId).type.get();
    let relationName = type === ROOMS_GROUP ? ROOMS_TO_ELEMENT_RELATION :
      EQUIPMENTS_TO_ELEMENT_RELATION;

    return SpinalGraphService.getChildren(groupId, [relationName]).then(
      children => {
        for (let i = 0; i < children.length; i++) {
          const element = children[i];
          if (element.id.get() === elementId) return true;

        }
        return false;
      });
  },
  linkElementToGroup(groupId, elementId, contextId) {
    let type = SpinalGraphService.getInfo(groupId).type.get();
    let relationName = type === ROOMS_GROUP ? ROOMS_TO_ELEMENT_RELATION :
      EQUIPMENTS_TO_ELEMENT_RELATION;

    return SpinalGraphService.addChildInContext(groupId, elementId, contextId,
      relationName, SPINAL_RELATION_LST_PTR_TYPE);
  },
  removeLink(groupId, elementId) {
    let type = SpinalGraphService.getInfo(groupId).type.get();
    let relationName = type === ROOMS_GROUP ? ROOMS_TO_ELEMENT_RELATION :
      EQUIPMENTS_TO_ELEMENT_RELATION;

    return SpinalGraphService.removeChild(groupId, elementId, relationName,
      SPINAL_RELATION_LST_PTR_TYPE)
  }
};

export {
  ROOMS_GROUP_CONTEXT,
  ROOMS_GROUP,
  EQUIPMENTS_GROUP,
  ROOMS_GROUP_RELATION,
  EQUIPMENTS_GROUP_RELATION,
  EQUIPMENTS_GROUP_CONTEXT,
  ROOMS_TO_ELEMENT_RELATION,
  EQUIPMENTS_TO_ELEMENT_RELATION,
  groupService
};