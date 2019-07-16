import {
  SpinalContextApp
} from "spinal-env-viewer-context-menu-service";

import {
  ROOMS_GROUP_CONTEXT,
  EQUIPMENTS_GROUP_CONTEXT,
  EQUIPMENTS_GROUP,
  ROOMS_GROUP
} from "../js/service";

import {
  spinalPanelManagerService
} from "spinal-env-viewer-panel-manager-service";

class ColorConfig extends SpinalContextApp {
  constructor() {
    super("Edit", "This button allows  to edit group", {
      icon: "colorize",
      icon_type: "in",
      backgroundColor: "#FF0000",
      fontColor: "#FFFFFF"
    });
  }

  display(contextType, selectedNodeType) {
    return (
      (contextType === ROOMS_GROUP_CONTEXT &&
        selectedNodeType === ROOMS_GROUP) ||
      (contextType === EQUIPMENTS_GROUP_CONTEXT &&
        selectedNodeType === EQUIPMENTS_GROUP)
    );
  }

  isShown(option) {
    let contextType = option.context.type.get();
    let selectedNodeType = option.selectedNode.type.get();

    if (this.display(contextType, selectedNodeType)) {
      return Promise.resolve(true);
    }
    return Promise.resolve(-1);
  }

  action(option) {
    let params = {
      title: option.selectedNode.name.get(),
      color: option.selectedNode.color ?
        option.selectedNode.color.get() : "#000000",
      selectedNode: option.selectedNode
    };
    spinalPanelManagerService.openPanel("colorConfigDialog", params);
    // let photoshop = new Photoshop();
    // let instance = new photoshopComponent({
    //   propsData: {
    //     head: color: "#000000",
    //     value: "#000000"
    //   }
    // });

    // instance.$mount();
    // document.getElementsByTagName("body")[0].appendChild(instance.$el);
  }
}

export default ColorConfig;