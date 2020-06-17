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

class FindBimRoom extends SpinalContextApp {

  constructor() {
    super("find room", "find room which linked to this object", {
      icon: 'room',
      icon_type: 'in',
      backgroundColor: '#356BAB',
      fontColor: '#FFFFFF'
    })
  }

  async isShown(option) {
    // return Promise.resolve(true);
    const room = await getRoom(option);

    return typeof room !== "undefined" ? true : -1;

  }

  async action(option) {
    const room = await getRoom(option);

    if (room) {
      graphManagerStore.commit("SET_ACTIVE_NODE", room.id.get());
      spinalPanelManagerService.openPanel("linkToGroupDialog", {
        type: ROOM_TYPE,
        itemSelected: [room.get()]
      });
    } else {
      alert("no room found");
    }

  }

}


const getRoom = async (option) => {
  if (option.selectedNode) {
    const id = option.selectedNode.id.get();

    const realNode = SpinalGraphService.getRealNode(id);

    let parents = await realNode.getParents([EQUIPMENT_RELATION,
      REFERENCE_RELATION
    ]);

    if (!parents || (parents && parents.length === 0)) return;

    const found = parents.find(el => {
      SpinalGraphService._addNode(el);
      return el.getType().get() === ROOM_TYPE
    });

    if (found) return found.info;

    // if (found) {
    //   graphManagerStore.commit("SET_ACTIVE_NODE", found.id.get())
    // }

  }
}

export default FindBimRoom;