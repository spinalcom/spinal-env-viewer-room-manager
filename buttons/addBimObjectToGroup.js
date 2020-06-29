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


class AddBimObjectToGroup extends SpinalContextApp {

  constructor() {
    super("add bim object to group",
      "add bim object to group", {
        icon: 'add_location',
        icon_type: 'in',
        backgroundColor: '#356BAB',
        fontColor: '#FFFFFF'
      })
  }

  isShown(option) {
    // return Promise.resolve(true);


    return Promise.resolve(option.selectedNode !== "undefined" ? true : -1);

  }

  action(option) {
    // const bimObject = await getBimObject(option);

    if (option.selectedNode) {
      spinalPanelManagerService.openPanel("linkToGroupDialog", {
        type: option.selectedNode.type.get(),
        itemSelected: [option.selectedNode.get()]
      });
    } else {
      alert("not found");
    }

  }

}


// const getBimObject = async (option) => {
//   console.log(option);
// }

export default AddBimObjectToGroup;