import {
  SpinalContextApp
} from "spinal-env-viewer-context-menu-service";

import {
  SpinalGraphService
} from "spinal-env-viewer-graph-service";

import {
  EQUIPMENT_RELATION,
  REFERENCE_RELATION,
  ROOM_TYPE
} from "spinal-env-viewer-context-geographic-service/build/constants";


const {
  spinalPanelManagerService
} = require("spinal-env-viewer-panel-manager-service");

import graphManagerStore from "spinal-env-viewer-plugin-graph-manager/src/vue/store";

import utilities from '../js/utilities';

class FindBimObject extends SpinalContextApp {

  constructor() {
    super("find Object in graph manager", "find object in graph manager", {
      icon: 'location_on',
      icon_type: 'in',
      backgroundColor: '#356BAB',
      fontColor: '#FFFFFF'
    })
  }

  isShown(option) {
    // return Promise.resolve(true);

    return Promise.resolve(option.selectedNode ? true : -1);

    // return typeof bimObject !== "undefined" ? true : -1;

  }

  action(option) {

    // console.log(utilities.getGeographicTree(option.selectedNode.id.get()));

    if (option.selectedNode && option.selectedNode.id) {
      graphManagerStore.commit("SET_ACTIVE_NODE", option.selectedNode.id
        .get());
    } else {
      alert("not found");
    }

  }

}

export default FindBimObject;