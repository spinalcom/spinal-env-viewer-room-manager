import { SpinalContextApp } from "spinal-env-viewer-context-menu-service";
import graphManagerStore from "spinal-env-viewer-plugin-graph-manager/src/vue/store";
import { spinalContextMenuService } from "spinal-env-viewer-context-menu-service";

const CIRCULARMENU = 'circularMenu';

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
    return Promise.resolve(option.selectedNode ? true : -1);

  }

  action(option) {

    if (option.selectedNode && option.selectedNode.id) {
      graphManagerStore.commit("SET_ACTIVE_NODE", option.selectedNode.id
        .get());
    } else {
      alert("not found");
    }

  }

}

const findBimObject = new FindBimObject();
spinalContextMenuService.registerApp(CIRCULARMENU, findBimObject, [3]);

export default findBimObject;