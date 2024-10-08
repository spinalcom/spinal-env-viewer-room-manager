import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import geographicService from "spinal-env-viewer-context-geographic-service";
import { groupManagerService } from "spinal-env-viewer-plugin-group-manager-service";

let ItemColoredMap = new Map();
let BimElementsColor = new Map();

const ROOMS_RELATIONS = [
  groupManagerService.constants.CATEGORY_TO_GROUP_RELATION,
  groupManagerService.constants.CONTEXT_TO_CATEGORY_RELATION,
  groupManagerService.constants.OLD_RELATIONS_TYPES.GROUP_TO_ROOMS_RELATION,
  `groupHas${geographicService.constants.ROOM_TYPE}`,
  geographicService.constants.REFERENCE_RELATION,
  geographicService.constants.EQUIPMENT_RELATION,
];

const EQUIPMENTS_RELATIONS = [
  groupManagerService.constants.CATEGORY_TO_GROUP_RELATION,
  groupManagerService.constants.CONTEXT_TO_CATEGORY_RELATION,
  groupManagerService.constants.OLD_RELATIONS_TYPES.GROUP_TO_EQUIPMENTS_RELATION,
  `groupHas${geographicService.constants.EQUIPMENT_TYPE}`,
  geographicService.constants.REFERENCE_RELATION,
  geographicService.constants.EQUIPMENT_RELATION,
  `${geographicService.constants.REFERENCE_RELATION}.ROOM`
];

// const ROOMS_TYPES = [
//   groupManagerService.constants.OLD_CONTEXTS_TYPES.ROOMS_GROUP_CONTEXT,
//   groupManagerService.constants.CATEGORY_TYPE,
//   groupManagerService.constants.OLD_GROUPS_TYPES.ROOMS_GROUP,
//   `${geographicService.constants.ROOM_TYPE}GroupContext`,
//   `${geographicService.constants.ROOM_TYPE}Group`,
// ];

// // eslint-disable-next-line no-unused-vars
// const EQUIPMENTS_TYPES = [
//   groupManagerService.constants.OLD_CONTEXTS_TYPES.EQUIPMENTS_GROUP_CONTEXT,
//   groupManagerService.constants.CATEGORY_TYPE,
//   groupManagerService.constants.OLD_GROUPS_TYPES.EQUIPMENTS_GROUP,
//   `${geographicService.constants.EQUIPMENT_TYPE}GroupContext`,
//   `${geographicService.constants.EQUIPMENT_TYPE}Group`,
// ];

let utilities = {
  getIcon(selectedNode) {
    return this._isColored(selectedNode).then((isColored) => {
      return isColored;
    });
  },

  async getGroupBimObjects(groupId) {
    const groupInfo = SpinalGraphService.getInfo(groupId);


    if (groupManagerService.isRoomsGroup(groupInfo.type.get())) {
      const rooms = await SpinalGraphService.getChildren(groupId, ROOMS_RELATIONS);
      const promises = rooms.map((el) => SpinalGraphService.getChildren(el.id.get(), EQUIPMENTS_RELATIONS));

      return Promise.all(promises).then((res) => {
        console.log("res equip", res);
        return res.flat()
      });
    }

    if (groupManagerService.isEquipmentsGroup(groupInfo.type.get())) {
      return SpinalGraphService.getChildren(groupId, EQUIPMENTS_RELATIONS);
    }

    return [];





    // let nodeInfo = SpinalGraphService.getInfo(nodeId);
    // let type = nodeInfo.type.get();

    // if (type === BIM_OBJECT_TYPE) return Promise.resolve([nodeInfo]);

    // if (type === geographicService.constants.ROOM_TYPE) {
    //   const { REFERENCE_RELATION, EQUIPMENT_RELATION } = geographicService.constants;
    //   const relations = [REFERENCE_RELATION, EQUIPMENT_RELATION];
    //   return SpinalGraphService.getChildren(nodeId, relations);
    // }

    // let relations = ROOMS_TYPES.includes(type) ? ROOMS_RELATIONS : EQUIPMENTS_RELATIONS;

    // const predicate = (node) => node.getType().get() === BIM_OBJECT_TYPE;

    // const node = SpinalGraphService.getRealNode(nodeId);

    // const found = [];



    // return SpinalGraphService.findNodes(nodeId, relations, (node) => {
    //   return node.getType().get() === BIM_OBJECT_TYPE;
    // }).then((res) => {
    //   return res.map((el) => {
    //     SpinalGraphService._addNode(el);
    //     return el.info;
    //   });
    // });

  },

  getGroups(selectedNode) {
    try {
      return groupManagerService.getGroups(selectedNode.id.get());
    } catch (error) {
      console.error("getGroups error");
      console.error(error);
    }

    // let type = selectedNode.type.get();
    // let nodeId = selectedNode.id.get();

    // if (groupManagerService.isGroup(type)) {
    //   return Promise.resolve([selectedNode]);
    // }

    // if (groupManagerService.isCategory(type)) groupManagerService.getGroups(nodeId);

    // let relations = [];

    // return SpinalGraphService.findNodes(nodeId, relations, (node) => {
    //   let argType = node.getType().get();
    //   return groupManagerService.isGroup(argType);
    // }).then((res) => {
    //   return res.map((el) => {
    //     SpinalGraphService._addNode(el);
    //     return el.info;
    //   });
    // });
  },

  colorItem(selectedNode) {
    this.getGroups(selectedNode).then((res) => {

      res.forEach((el) => {
        let id = el.id.get();
        let color = el.color ? el.color.get() : undefined;
        this.colorGroup(id, color);
      });
    });
  },

  restoreItem(selectedNode) {
    this.getGroups(selectedNode).then((res) => {
      res.forEach((el) => {
        let id = el.id.get();
        this.restoreGroup(id);
      });
    });
  },

  colorGroup(groupId, argColor) {
    this.getGroupBimObjects(groupId).then((res) => {
      console.log("res", res);
      let color = argColor ? this._convertHexColorToRGB(argColor) : this._convertHexColorToRGB("#000000");

      ItemColoredMap.set(groupId, groupId);

      for (const child of res) {
        const dbId = child.dbid.get();
        let BimColors = BimElementsColor.get(dbId) || [];
        BimColors.push({ id: groupId, color: color });
        BimElementsColor.set(dbId, BimColors);

        let model = window.spinal.BimObjectService.getModelByBimfile(child.bimFileId.get());
        console.log(model);
        if (model) {
          model.setThemingColor(dbId, new THREE.Vector4(color.r / 255, color.g / 255, color.b / 255, 0.7, true));
        }
      }

    });
  },

  restoreGroup(groupId) {
    this.getGroupBimObjects(groupId).then((res) => {
      ItemColoredMap.delete(groupId);

      for (const child of res) {
        const dbId = child.dbid.get();
        let model = window.spinal.BimObjectService.getModelByBimfile(child.bimFileId.get());
        model.setThemingColor(dbId, new THREE.Vector4(0, 0, 0, 0), true);

        let allColors = BimElementsColor.get(dbId);
        if (!allColors) continue;

        allColors = allColors.filter((el) => el.id !== groupId);
        BimElementsColor.set(dbId, allColors);

        if (allColors.length > 0) {
          let color = allColors[0].color;
          model.setThemingColor(dbId, new THREE.Vector4(color.r / 255, color.g / 255, color.b / 255, 0.7), true);
        }

      }

    });
  },

  async consumeBatch(promises, batchSize = 2) {
    let index = 0;
    const result = { successed: [], failed: [] };
    while (index < promises.length) {
      let endIndex = index + batchSize;
      if (promises.length <= endIndex) endIndex = promises.length;
      const slice = promises.slice(index, endIndex);
      const { successed, failed } = await this.getPromiseResult(
        slice.map((e) => e())
      );
      result.successed.push(...successed);
      result.failed.push(...failed);

      index = endIndex;
    }
    return result;
  },

  getPromiseResult(liste) {
    return Promise.allSettled(liste).then((result) => {
      const obj = { successed: [], failed: [] };
      for (const { status, value } of result) {
        if (status === "fulfilled") obj.successed.push(value);
        else obj.failed.push(value);
      }
      return obj;
    });
  },

  //////////////////////////////////////////////////////////////////////////////////////////////////
  //                                                    Private                                   //
  //////////////////////////////////////////////////////////////////////////////////////////////////

  _isColored(selectedNode) {
    return this.getGroups(selectedNode).then((res) => {
      if (res.length === 0) return false;

      for (let index = 0; index < res.length; index++) {
        const id = res[index].id.get();

        if (typeof ItemColoredMap.get(id) === "undefined") {
          return false;
        }
      }

      return true;
    });
  },

  _convertHexColorToRGB(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
      : null;
  },

  ///////////////////////////////////////////////////////////////////////////////////////////
  //                                    Parcours ascendant                                 //
  ///////////////////////////////////////////////////////////////////////////////////////////

  // async getGeographicTree(endNodeId) {
  //   let obj = {
  //     id: endNodeId,
  //     children: [],
  //   };

  //   let parents = [];

  //   do {
  //     let tempParents = await SpinalGraphService.getParents(id, geographicService.constants.GEOGRAPHIC_RELATIONS);

  //     parents = tempParents && tempParents.map((el) => el.get());

  //   } while (parents.length);

  // },

  // addObjToParent(obj, parentId) {
  //   return {
  //     id: parentId,
  //     children: obj,
  //   };
  // },
};

export default utilities;
