import {
  SPINAL_RELATION_PTR_LST_TYPE,
  SpinalGraphService
} from "spinal-env-viewer-graph-service";

import {
  Model
} from "spinal-core-connectorjs_type";

import constants from "./constants";


let groupService = {
  constants: constants,
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
  addElement(contextId, elementId, elementType, elementName, iconName,
    color) {
    let contextInfo = SpinalGraphService.getInfo(contextId)
    let contextType = contextInfo && contextInfo.type ? contextInfo.type
      .get() : undefined;

    let typeAndRelation = this.getTypeAndRelation(elementType, contextType);


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

      if (color) {
        info["color"] = color;
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
        SPINAL_RELATION_PTR_LST_TYPE
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
    let realNode = SpinalGraphService.getRealNode(groupId);
    const type = realNode.getType().get();

    let relationName = constants.GROUP_RELATION_ASSOCIATION.get(type)

    try {
      let ids = realNode.children[SPINAL_RELATION_PTR_LST_TYPE][relationName]
        .children.info.ids;

      return Promise.resolve(ids.has((el) => {
        return el.get() === elementId
      }))
    } catch (error) {
      // let type = SpinalGraphService.getInfo(groupId).type.get();
      // let relationName = type === ROOMS_GROUP ? ROOMS_TO_ELEMENT_RELATION :
      //   EQUIPMENTS_TO_ELEMENT_RELATION;

      return SpinalGraphService.getChildren(groupId, [relationName]).then(
        children => {
          for (let i = 0; i < children.length; i++) {
            const element = children[i];
            if (element.id.get() === elementId) return true;

          }
          return false;
        });
    }

  },
  linkElementToGroup(groupId, elementId, contextId) {

    let groupInfo = SpinalGraphService.getInfo(groupId);

    let relationName = constants.GROUP_RELATION_ASSOCIATION.get(groupInfo.type
      .get());


    return this.getCategorie(groupInfo).then(category => {

      return this.elementIsInCategorie(category[0].id.get(), elementId)
        .then(
          group => {
            let result = {
              old_group: undefined,
              newGroup: groupId
            }

            if (typeof group !== "undefined") {
              this.removeLink(group.id.get(), elementId);
              result.old_group = group.id.get();
            }

            SpinalGraphService.addChildInContext(groupId,
              elementId, contextId, relationName,
              SPINAL_RELATION_PTR_LST_TYPE);


            return result;

          })
    })

  },
  removeLink(groupId, elementId) {
    let type = SpinalGraphService.getInfo(groupId).type.get();
    let relationName = constants.GROUP_RELATION_ASSOCIATION.get(type);

    return SpinalGraphService.removeChild(groupId, elementId,
      relationName,
      SPINAL_RELATION_PTR_LST_TYPE)
  },
  getTypeAndRelation(elementType, contextType) {

    switch (elementType) {
      case contextType:
        return {
          type: constants.CATEGORY_TYPE,
            relation: constants.CONTEXT_TO_CATEGORY_RELATION
        };

        // case ROOMS_GROUP:
        //   return {
        //     type: "undefined",
        //       relation:
        //   };
      case constants.CATEGORY_TYPE:
        // eslint-disable-next-line no-case-declarations
        let type = constants.CONTEXT_GROUP_ASSOCIATION.get(contextType);
        return {
          type: type,
            relation: constants.CATEGORY_TO_GROUP_RELATION
        };

        // case constants.ROOMS_GROUP:
        // case constants.EQUIPMENTS_GROUP:
        // case constants.ENDPOINT_GROUP:
        //   return {
        //     type: "",
        //       relation: constants.GROUP_RELATION_ASSOCIATION.get(elementType)
        //   }

      default:
        return {};
    }
  },

  getElementsLinked(groupId) {
    let type = SpinalGraphService.getInfo(groupId).type.get();
    let relationName = constants.GROUP_RELATION_ASSOCIATION.get(type);

    return SpinalGraphService.getChildren(groupId, [relationName]);
  },

  getGroups(selectedNode) {

    // const ROOMS_TYPES = [
    //   ROOMS_GROUP_CONTEXT,
    //   ROOMS_CATEGORY,
    //   ROOMS_GROUP
    // ]


    let type = selectedNode.type.get();
    let nodeId = selectedNode.id.get();

    if (typeof constants.GROUP_RELATION_ASSOCIATION.get(type) !==
      "undefined") {
      return Promise.resolve([selectedNode]);
    }

    let relations = [
      constants.CONTEXT_TO_CATEGORY_RELATION,
      constants.CATEGORY_TO_GROUP_RELATION,
      constants.GROUP_TO_ROOMS_RELATION,
      constants.GROUP_TO_EQUIPMENTS_RELATION,
      constants.GROUP_TO_ENDPOINT_RELATION
    ];

    return SpinalGraphService.findNodes(nodeId, relations, (node) => {
      let argType = node.getType().get()
      return typeof constants.GROUP_RELATION_ASSOCIATION.get(argType) !==
        "undefined"
    }).then(res => {
      return res.map(el => {
        SpinalGraphService._addNode(el);
        return el.info;
      })
    })
  },

  getCategorie(selectedNode) {
    let type = selectedNode.type.get();
    let nodeId = selectedNode.id.get();

    if (type === constants.CATEGORY_TYPE) {
      return Promise.resolve(selectedNode);
    } else if (constants.CONTEXTS_TYPES.indexOf(type) !== -1) {
      return SpinalGraphService.getChildren(nodeId, [constants
        .CONTEXT_TO_CATEGORY_RELATION
      ]);

    } else {
      let relationRefPromises = [];


      let node = SpinalGraphService.getRealNode(nodeId);

      let relationList = node.parents[constants.CATEGORY_TO_GROUP_RELATION];

      if (relationList) {
        for (let i = 0; i < relationList.length; i++) {
          const element = relationList[i];
          relationRefPromises.push(element.load());
        }

      }

      return Promise.all(relationRefPromises).then(refs => {

        let promises = refs.map(node => {
          return node.parent.load();
        })


        return Promise.all(promises).then(parents => {
          // let p = [];
          // parents.forEach(el => {
          //   if (el && !(el instanceof SpinalContext)) {
          //     p.push(new SpinalCalNode(el));
          //   }
          // })

          // return p;

          return parents.map(el => {
            return el.info;
          });

        });

      })


    }
  },

  elementIsInCategorie(categoryId, elementId) {

    // let nodeInfo = SpinalGraphService.getInfo(categoryId);
    // let type = nodeInfo.type.get();

    // let relationName =
    //   type === ROOMS_CATEGORY ?
    //   ROOMS_GROUP_RELATION :
    //   EQUIPMENTS_GROUP_RELATION;

    return SpinalGraphService.getChildren(categoryId, [constants
        .CATEGORY_TO_GROUP_RELATION
      ])
      .then(
        children => {

          return children.find(child => {
            return child.childrenIds.find(el => {
              return el === elementId
            })
          })

        })

  }

};

export {
  // ROOMS_GROUP_CONTEXT,
  // ROOMS_GROUP,
  // EQUIPMENTS_GROUP,
  // ROOMS_GROUP_RELATION,
  // EQUIPMENTS_GROUP_RELATION,
  // EQUIPMENTS_GROUP_CONTEXT,
  // ROOMS_TO_ELEMENT_RELATION,
  // EQUIPMENTS_TO_ELEMENT_RELATION,
  // ROOMS_CATEGORY,
  // ROOMS_CATEGORY_RELATION,
  // EQUIPMENTS_CATEGORY,
  // EQUIPMENTS_CATEGORY_RELATION,
  // typeLst,
  // TYPE_AND_RELATION,

  groupService
};