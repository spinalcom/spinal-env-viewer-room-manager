import {
  typeLst,
  TYPE_AND_RELATION
} from "./service";
import {
  SpinalGraphService
} from "spinal-env-viewer-graph-service";

import bimObjectService from "spinal-env-viewer-plugin-bimobjectservice";
import geographicService from "spinal-env-viewer-context-geographic-service"

let ItemColoredMap = new Map();

let utilities = {


  getIcon(selectedNode, contextNode) {
    if (!this._display) return Promise.reject();
    console.log(selectedNode, contextNode);
    return Promise.resolve()
  },


  getBimObjects(nodeId) {

    let nodeType = SpinalGraphService.getInfo(nodeId);

    if (nodeType.type.get() === bimObjectService.constants
      .BIM_OBJECT_NODE_TYPE) {
      return Promise.resolve([nodeType]);
    }

    return SpinalGraphService.getChildren(nodeId, [geographicService.constants
      .REFERENCE_RELATION, geographicService.constants.EQUIPMENT_RELATION
    ]);
  },









  //////////////////////////////////////////////////////////////////////////////////////////////////
  //                                                    Private                                   //
  //////////////////////////////////////////////////////////////////////////////////////////////////

  _display(selectedNode) {
    let isDisplayed = typeLst.indexOf(selectedNode.type.get()) !== -1;


    if (!isDisplayed) {
      return false;
    }

    return true;
  },

  async _isColored(selectedNode) {
    let relationName = TYPE_AND_RELATION.get(selectedNode.type.get());
    let nodeId = selectedNode.id.get();

    if (typeof relationName === "undefined") {
      return typeof ItemColoredMap.get(nodeId) !== "undefined";
    }

    let Allrelations = TYPE_AND_RELATION.values();

    let nodes = await SpinalGraphService.findNodes(selectedNode,
      Allrelations, (
        node) => {
        let type = node.getType().get();
        return typeof TYPE_AND_RELATION.get(type) === "undefined"
      });

    for (let i = 0; i < nodes.length; i++) {
      const element = nodes[i];
    }

    // let children = await SpinalGraphService.getChildren(nodeId, [
    //   relationName
    // ]);

    // for (let index = 0; index < children.length; index++) {
    //   const element = children[index];
    //   this._isColored(element);
    // }

  }

}


export default utilities;