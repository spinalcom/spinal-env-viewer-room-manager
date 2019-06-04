import {
  SPINAL_RELATION_LST_PTR_TYPE,
  SPINAL_RELATION_TYPE,
  SpinalGraphService
} from "spinal-env-viewer-graph-service";

import {
  Model
} from "spinal-core-connectorjs_type";



const ROOMS_GROUP_CONTEXT = "RoomsGroupContext";
const ROOMS_GROUP = "RoomsGroup";
const ROOMS_GROUP_RELATION = "hasRoomsGroup";
const ROOMS_TO_ELEMENT_RELATION = "groupHasRooms";
const ROOMS_CATEGORY = "Rooms_category";
const ROOMS_CATEGORY_RELATION = "hasRoomsCategory";


const EQUIPMENTS_GROUP_CONTEXT = "EquipmentGroupContext";
const EQUIPMENTS_GROUP = "EquipmentGroup";
const EQUIPMENTS_GROUP_RELATION = "hasEquipmentsGroup";
const EQUIPMENTS_TO_ELEMENT_RELATION = "groupHasEquipments";
const EQUIPMENTS_CATEGORY = "Equipment_category";
const EQUIPMENTS_CATEGORY_RELATION = "hasEquipmentsCategory";


const typeLst = [
  ROOMS_GROUP_CONTEXT,
  ROOMS_GROUP,
  ROOMS_CATEGORY,
  EQUIPMENTS_GROUP_CONTEXT,
  EQUIPMENTS_GROUP,
  EQUIPMENTS_CATEGORY
]



const TYPE_AND_RELATION = new Map();
TYPE_AND_RELATION.set(ROOMS_GROUP_CONTEXT, ROOMS_CATEGORY_RELATION)
TYPE_AND_RELATION.set(ROOMS_GROUP, ROOMS_TO_ELEMENT_RELATION)
TYPE_AND_RELATION.set(ROOMS_CATEGORY, ROOMS_GROUP_RELATION)
TYPE_AND_RELATION.set(EQUIPMENTS_GROUP_CONTEXT, EQUIPMENTS_CATEGORY_RELATION)
TYPE_AND_RELATION.set(EQUIPMENTS_GROUP, EQUIPMENTS_TO_ELEMENT_RELATION)
TYPE_AND_RELATION.set(EQUIPMENTS_CATEGORY, EQUIPMENTS_GROUP_RELATION)








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
  addElement(contextId, elementId, elementType, elementName, iconName) {

    let typeAndRelation = this.getTypeAndRelation(elementType);


    let type = typeAndRelation.type;
    let relationName = typeAndRelation.relation;

    if (typeof type !== "undefined" && typeof relationName !== "undefined") {
      let info = {
        name: elementName,
        type: type
      }

      if (iconName) {
        info["icon"] = iconName;
      }

      let childId = SpinalGraphService.createNode(info,
        new Model({
          name: elementName
        })
      );


      return SpinalGraphService.addChildInContext(
        elementId,
        childId,
        contextId,
        relationName,
        SPINAL_RELATION_TYPE
      );
    }

    // // let type =
    // //   contextType === ROOMS_GROUP_CONTEXT ? ROOMS_GROUP : EQUIPMENTS_GROUP;

    // // let relationName =
    // //   contextType === ROOMS_GROUP_CONTEXT ?
    // //   ROOMS_GROUP_RELATION :
    // //   EQUIPMENTS_GROUP_RELATION;



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
  },
  getTypeAndRelation(elementType) {

    switch (elementType) {
      case ROOMS_GROUP_CONTEXT:
        return {
          type: ROOMS_CATEGORY,
            relation: ROOMS_CATEGORY_RELATION
        };
        // case ROOMS_GROUP:
        //   return {
        //     type: "undefined",
        //       relation:
        //   };
      case ROOMS_CATEGORY:
        return {
          type: ROOMS_GROUP,
            relation: ROOMS_GROUP_RELATION
        };
      case EQUIPMENTS_GROUP_CONTEXT:
        return {
          type: EQUIPMENTS_CATEGORY,
            relation: EQUIPMENTS_CATEGORY_RELATION
        };
        // case EQUIPMENTS_GROUP:
        //   return {
        //     type: undefined,
        //       relation: undefined
        //   };
      case EQUIPMENTS_CATEGORY:
        return {
          type: EQUIPMENTS_GROUP,
            relation: EQUIPMENTS_GROUP_RELATION
        };
      default:
        return {};
    }
  },
  getElementsLinked(groupId) {
    let type = SpinalGraphService.getInfo(groupId).type.get();
    let relationName = type === ROOMS_GROUP ? ROOMS_TO_ELEMENT_RELATION :
      EQUIPMENTS_TO_ELEMENT_RELATION;

    return SpinalGraphService.getChildren(groupId, [relationName]);
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
  ROOMS_CATEGORY,
  ROOMS_CATEGORY_RELATION,
  EQUIPMENTS_CATEGORY,
  EQUIPMENTS_CATEGORY_RELATION,
  typeLst,
  TYPE_AND_RELATION,
  groupService
};