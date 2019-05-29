import {
  typeLst,
  TYPE_AND_RELATION
} from "./service";
import {
  SpinalGraphService
} from "spinal-env-viewer-graph-service";



let ItemColoredMap = new Map();

let utilities = {


  getIcon(selectedNode, contextNode) {
    if (!this._display) return Promise.reject();


    console.log(this._isColored(selectedNode));
    return Promise.resolve()
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
      console.log(element);
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