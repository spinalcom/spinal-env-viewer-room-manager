import {
  ROOMS_CATEGORY_RELATION,
  ROOMS_GROUP_RELATION,
  ROOMS_TO_ELEMENT_RELATION,
  EQUIPMENTS_CATEGORY_RELATION,
  EQUIPMENTS_GROUP_RELATION,
  EQUIPMENTS_TO_ELEMENT_RELATION,
  ROOMS_GROUP_CONTEXT,
  ROOMS_GROUP,
  ROOMS_CATEGORY,
  EQUIPMENTS_GROUP_CONTEXT,
  EQUIPMENTS_CATEGORY,
  EQUIPMENTS_GROUP
} from "./service";
import {
  SpinalGraphService
} from "spinal-env-viewer-graph-service";

import bimObjectService from "spinal-env-viewer-plugin-bimobjectservice";
import geographicService from "spinal-env-viewer-context-geographic-service";


let ItemColoredMap = new Map();
let BimElementsColor = new Map();


const ROOMS_RELATIONS = [
  ROOMS_CATEGORY_RELATION,
  ROOMS_GROUP_RELATION,
  ROOMS_TO_ELEMENT_RELATION,
  geographicService.constants.REFERENCE_RELATION,
  geographicService.constants.EQUIPMENT_RELATION
]


const EQUIPMENTS_RELATIONS = [
  EQUIPMENTS_CATEGORY_RELATION,
  EQUIPMENTS_GROUP_RELATION,
  EQUIPMENTS_TO_ELEMENT_RELATION
]


const ROOMS_TYPES = [
  ROOMS_GROUP_CONTEXT,
  ROOMS_CATEGORY,
  ROOMS_GROUP
]

// eslint-disable-next-line no-unused-vars
const EQUIPMENTS_TYPES = [
  EQUIPMENTS_GROUP_CONTEXT,
  EQUIPMENTS_CATEGORY,
  EQUIPMENTS_GROUP
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


    if (type === bimObjectService.constants
      .BIM_OBJECT_NODE_TYPE) {
      return Promise.resolve([nodeInfo]);
    } else if (type === geographicService.constants
      .ROOM_TYPE) {
      return SpinalGraphService.getChildren(nodeId, [geographicService
        .constants
        .REFERENCE_RELATION, geographicService.constants
        .EQUIPMENT_RELATION
      ]);
    } else {
      let relations = [];

      if (ROOMS_TYPES.indexOf(type) !== -1) {
        relations = ROOMS_RELATIONS;
      } else {
        relations = EQUIPMENTS_RELATIONS;
      }


      return SpinalGraphService.findNodes(nodeId, relations, (node) => {
        return node.getType().get() === bimObjectService.constants
          .BIM_OBJECT_NODE_TYPE
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

    if (type === ROOMS_GROUP || type === EQUIPMENTS_GROUP) {
      return Promise.resolve([selectedNode]);
    }

    let relations = ROOMS_TYPES.indexOf(type) !== -1 ? [
      ROOMS_CATEGORY_RELATION, ROOMS_GROUP_RELATION
    ] : [EQUIPMENTS_CATEGORY_RELATION, EQUIPMENTS_GROUP_RELATION];

    return SpinalGraphService.findNodes(nodeId, relations, (node) => {
      let argType = node.getType().get()
      return argType === ROOMS_GROUP || argType === EQUIPMENTS_GROUP
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

      res.forEach(child => {
        ItemColoredMap.set(groupId, groupId);
        let BimColors = BimElementsColor.get(child.dbid.get()) ?
          BimElementsColor.get(child.dbid.get()) : [];

        BimColors.push({
          id: groupId, //node.id.get(),
          color: color
        });

        BimElementsColor.set(child.dbid.get(), BimColors);

        window.spinal.ForgeViewer.viewer.setThemingColor(
          child.dbid.get(),
          // eslint-disable-next-line no-undef
          new THREE.Vector4(color.r / 255, color.g / 255, color.b /
            255, 0.7)
        );

      });

    })
  },

  restoreGroup(groupId) {
    ItemColoredMap.delete(groupId);
    this.getBimObjects(groupId).then(res => {
      res.forEach(child => {
        window.spinal.ForgeViewer.viewer.setThemingColor(
          child.dbid.get(),
          // eslint-disable-next-line no-undef
          new THREE.Vector4(0, 0, 0, 0)
        );

        let allColors = BimElementsColor.get(child.dbid.get());

        if (allColors) {
          //   allColors = allColors.filter(el => el.id !== node.id.get());
          allColors = allColors.filter(el => el.id !== groupId);
          BimElementsColor.set(child.dbid.get(), allColors);

          if (allColors.length > 0) {
            let color = allColors[0].color;
            window.spinal.ForgeViewer.viewer.setThemingColor(
              child.dbid.get(),
              // eslint-disable-next-line no-undef
              new THREE.Vector4(
                color.r / 255,
                color.g / 255,
                color.b / 255,
                0.7
              )
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