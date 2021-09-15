import { SpinalContextApp } from "spinal-env-viewer-context-menu-service";
const { spinalPanelManagerService } = require("spinal-env-viewer-panel-manager-service");
import { spinalContextMenuService } from "spinal-env-viewer-context-menu-service";


const CIRCULARMENU = 'circularMenu';


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
    return Promise.resolve(option.selectedNode !== "undefined" ? true : -1);
  }

  action(option) {
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

const addBimObjectToGroup = new AddBimObjectToGroup()

spinalContextMenuService.registerApp(CIRCULARMENU, addBimObjectToGroup, [3]);
export default addBimObjectToGroup;