import {
  // ROOMS_CATEGORY_RELATION,
  // ROOMS_GROUP_RELATION,
  // ROOMS_TO_ELEMENT_RELATION,
  // EQUIPMENTS_CATEGORY_RELATION,
  // EQUIPMENTS_GROUP_RELATION,
  // EQUIPMENTS_TO_ELEMENT_RELATION,
  // ROOMS_GROUP_CONTEXT,
  // ROOMS_GROUP,
  // ROOMS_CATEGORY,
  // EQUIPMENTS_GROUP_CONTEXT,
  // EQUIPMENTS_CATEGORY,
  // EQUIPMENTS_GROUP
  groupService
} from "../services/service";
import {
  SpinalGraphService
} from "spinal-env-viewer-graph-service";

import {
  BIM_OBJECT_TYPE
} from "spinal-env-viewer-plugin-forge/dist/Constants";

import geographicService from "spinal-env-viewer-context-geographic-service";
import {
  groupManagerService
} from "spinal-env-viewer-plugin-group-manager-service";



let ItemColoredMap = new Map();
let BimElementsColor = new Map();


const ROOMS_RELATIONS = [
  // groupService.constants.CATEGORY_TO_GROUP_RELATION,
  // groupService.constants.CONTEXT_TO_CATEGORY_RELATION,
  // groupService.constants.GROUP_TO_ROOMS_RELATION,
  groupManagerService.constants.CATEGORY_TO_GROUP_RELATION,
  groupManagerService.constants.CONTEXT_TO_CATEGORY_RELATION,
  groupManagerService.constants.OLD_RELATIONS_TYPES.GROUP_TO_ROOMS_RELATION,
  `groupHas${geographicService.constants.ROOM_TYPE}`,
  geographicService.constants.REFERENCE_RELATION,
  geographicService.constants.EQUIPMENT_RELATION
]


const EQUIPMENTS_RELATIONS = [
  // groupService.constants.CATEGORY_TO_GROUP_RELATION,
  // groupService.constants.CONTEXT_TO_CATEGORY_RELATION,
  groupManagerService.constants.CATEGORY_TO_GROUP_RELATION,
  groupManagerService.constants.CONTEXT_TO_CATEGORY_RELATION,
  groupManagerService.constants.OLD_RELATIONS_TYPES
  .GROUP_TO_EQUIPMENTS_RELATION,
  `groupHas${geographicService.constants.EQUIPMENT_TYPE}`
]


const ROOMS_TYPES = [
  groupManagerService.constants.OLD_CONTEXTS_TYPES.ROOMS_GROUP_CONTEXT,
  groupManagerService.constants.CATEGORY_TYPE,
  groupManagerService.constants.OLD_GROUPS_TYPES.ROOMS_GROUP,
  `${geographicService.constants.ROOM_TYPE}GroupContext`,
  `${geographicService.constants.ROOM_TYPE}Group`
]

// eslint-disable-next-line no-unused-vars
const EQUIPMENTS_TYPES = [
  groupManagerService.constants.OLD_CONTEXTS_TYPES.EQUIPMENTS_GROUP_CONTEXT,
  groupManagerService.constants.CATEGORY_TYPE,
  groupManagerService.constants.OLD_GROUPS_TYPES.EQUIPMENTS_GROUP,
  `${geographicService.constants.EQUIPMENT_TYPE}GroupContext`,
  `${geographicService.constants.EQUIPMENT_TYPE}Group`

]


let utilities = {


  getIcon(selectedNode) {
    return this._isColored(selectedNode).then(isColored => {
      return isColored;
    })
  },


  getBimObjects(nodeId) {

    let nodeInfo = SpinalGraphService.getInfo(nodeId);
    let type = nodeInfo.type.get();


    if (type === BIM_OBJECT_TYPE) {
      return Promise.resolve([nodeInfo]);
    } else if (type === geographicService.constants
      .ROOM_TYPE) {
      return SpinalGraphService.getChildren(nodeId, [geographicService
        .constants
        .REFERENCE_RELATION, geographicService.constants
        .EQUIPMENT_RELATION
      ]);
    } else {
      let relations = [
        groupService.constants.CONTEXT_TO_CATEGORY_RELATION,
        groupService.constants.GROUP_TO_ROOMS_RELATION,
        geographicService.constants.REFERENCE_RELATION,
        geographicService.constants.EQUIPMENT_RELATION,
        groupService.constants.CATEGORY_TO_GROUP_RELATION,
        groupService.constants.GROUP_TO_EQUIPMENTS_RELATION
      ];

      if (ROOMS_TYPES.indexOf(type) !== -1) {
        relations = ROOMS_RELATIONS;
      } else {
        relations = EQUIPMENTS_RELATIONS;
      }


      return SpinalGraphService.findNodes(nodeId, relations, (node) => {
        return node.getType().get() === BIM_OBJECT_TYPE
      }).then(res => {
        return res.map(el => {
          SpinalGraphService._addNode(el);
          return el.info;
        })
      })
    }


  },

  getGroups(selectedNode) {
    let type = selectedNode.type.get();
    let nodeId = selectedNode.id.get();

    if (groupManagerService.isGroup(type)) {
      return Promise.resolve([selectedNode]);
    }

    let relations = []

    return SpinalGraphService.findNodes(nodeId, relations, (node) => {
      let argType = node.getType().get()
      return groupManagerService.isGroup(argType);
    }).then(res => {
      return res.map(el => {
        SpinalGraphService._addNode(el);
        return el.info;
      })
    })



  },


  colorItem(selectedNode) {
    this.getGroups(selectedNode).then(res => {
      res.forEach(el => {
        let id = el.id.get();
        let color = el.color ? el.color.get() : undefined;
        this.colorGroup(id, color);
      })
    })
  },

  restoreItem(selectedNode) {
    this.getGroups(selectedNode).then(res => {
      res.forEach(el => {
        let id = el.id.get();
        this.restoreGroup(id);
      })
    })
  },

  colorGroup(groupId, argColor) {
    this.getBimObjects(groupId).then(res => {

      let color = typeof argColor !== "undefined" ? this
        ._convertHexColorToRGB(argColor) : this._convertHexColorToRGB(
          "#000000");

      ItemColoredMap.set(groupId, groupId);

      res.forEach(child => {
        let BimColors = BimElementsColor.get(child.dbid.get()) ?
          BimElementsColor.get(child.dbid.get()) : [];

        BimColors.push({
          id: groupId, //node.id.get(),
          color: color
        });

        BimElementsColor.set(child.dbid.get(), BimColors);

        let model = window.spinal.BimObjectService.getModelByBimfile(
          child.bimFileId.get());

        console.log("model", model)

        model.setThemingColor(child.dbid.get(), new THREE.Vector4(
            color.r / 255, color.g / 255, color.b / 255, 0.7, true)

        );

      });

    })
  },

  restoreGroup(groupId) {
    ItemColoredMap.delete(groupId);
    this.getBimObjects(groupId).then(res => {
      res.forEach(child => {

        let model = window.spinal.BimObjectService.getModelByBimfile(
          child.bimFileId.get());

        model.setThemingColor(
          child.dbid.get(),
          // eslint-disable-next-line no-undef
          new THREE.Vector4(0, 0, 0, 0),
          true
        );

        let allColors = BimElementsColor.get(child.dbid.get());

        if (allColors) {
          //   allColors = allColors.filter(el => el.id !== node.id.get());
          allColors = allColors.filter(el => el.id !== groupId);
          BimElementsColor.set(child.dbid.get(), allColors);

          if (allColors.length > 0) {
            let color = allColors[0].color;
            model.setThemingColor(
              child.dbid.get(),
              // eslint-disable-next-line no-undef
              new THREE.Vector4(
                color.r / 255,
                color.g / 255,
                color.b / 255,
                0.7
              ),
              true
            );
          }
        }
      })
    })
  },


  //////////////////////////////////////////////////////////////////////////////////////////////////
  //                                                    Private                                   //
  //////////////////////////////////////////////////////////////////////////////////////////////////

  _isColored(selectedNode) {
    return this.getGroups(selectedNode).then(res => {

      if (res.length === 0) return false;

      for (let index = 0; index < res.length; index++) {
        const id = res[index].id.get();

        if (typeof ItemColoredMap.get(id) === "undefined") {
          return false;
        }

      }

      return true;

    })

  },

  _convertHexColorToRGB(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } :
      null;
  }


}


export default utilities;