const {
  SPINAL_RELATION_PTR_LST_TYPE,
  SpinalGraphService
} = require("spinal-env-viewer-graph-service");

const {
  Model
} = require("spinal-core-connectorjs_type");

const constants = require("./constants");
const { default: groupManagerService } = require("spinal-env-viewer-plugin-group-manager-service");
const { default: utilities } = require("../js/utilities");


let groupService = {
  constants: constants,

  createGroupContext(name, type) {
    return groupManagerService.createGroupContext(name, type);
  },

  addElement(contextId, elementId, elementType, elementName, iconName, color) {
    let contextInfo = SpinalGraphService.getInfo(contextId)
    let contextType = contextInfo && contextInfo.type ? contextInfo.type.get() : undefined;

    let typeAndRelation = this.getTypeAndRelation(elementType, contextType);

    let type = typeAndRelation.type;
    let relationName = typeAndRelation.relation;

    if (type && relationName) {
      let info = {
        name: elementName,
        type: type,
        icon: iconName,
        color: color
      }


      let childId = SpinalGraphService.createNode(info, new Model({ name: elementName }));

      return SpinalGraphService.addChildInContext(elementId, childId, contextId, relationName, SPINAL_RELATION_PTR_LST_TYPE);
    }

  },

  elementIsLinkedToGroup(groupId, elementId) {
    return groupManagerService.elementIsLinkedToGroup(groupId, elementId);
  },

  linkElementToGroup(groupId, elementId, contextId) {
    return groupManagerService.linkElementToGroup(contextId, groupId, elementId);
  },
  removeLink(groupId, elementId) {
    return groupManagerService.removeLink(groupId, elementId);
  },

  getTypeAndRelation(elementType, contextType) {

    switch (elementType) {
      case contextType:
        return {
          type: constants.CATEGORY_TYPE,
          relation: constants.CONTEXT_TO_CATEGORY_RELATION
        };

      case constants.CATEGORY_TYPE:
        let type = constants.CONTEXT_GROUP_ASSOCIATION.get(contextType);
        return {
          type: type,
          relation: constants.CATEGORY_TO_GROUP_RELATION
        };

      default:
        return {};
    }
  },

  getElementsLinked(groupId) {
    return groupManagerService.getElementsLinked(groupId);
  },

  getGroups(selectedNode) {
    let type = selectedNode.type.get();
    let nodeId = selectedNode.id.get();

    if (constants.GROUP_RELATION_ASSOCIATION.get(type)) {
      return Promise.resolve([selectedNode]);
    }

    return utilities.getGroups(nodeId);
  },

  getCategorie(selectedNode) {
    return groupManagerService.getCategories(selectedNode.id.get());
  },

  elementIsInCategorie(categoryId, elementId) {
    return groupManagerService.elementIsInCategorie(categoryId, elementId);
  }

};

module.exports = {
  groupService
};