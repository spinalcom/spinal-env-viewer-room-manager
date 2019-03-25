import {
  SpinalContextApp
} from "spinal-env-viewer-context-menu-service";

import geographicService from "spinal-env-viewer-context-geographic-service";

class AddToReference extends SpinalContextApp {
  constructor() {
    super("Add to reference", "Add to reference", {
      icon: "control_point_duplicate",
      icon_type: "in",
      backgroundColor: "#FF00000",
      fontColor: "#FFFFFF"
    })
  }

  isShown(option) {
    if (option.context.type.get() === option.selectedNode.type.get() &&
      option.selectedNode.type.get() === geographicService.constants
      .CONTEXT_TYPE
    ) {
      return Promise.resolve(true);
    }
    return Promise.resolve(-1);
  }

  action(option) {
    geographicService.addContextToReference(option.context.id.get());
  }

}

export default AddToReference;