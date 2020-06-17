import vue from "vue";

import createContextGroup from "../vue/dialogs/createContext.vue";
import createCategoryDialog from "../vue/dialogs/createCategory.vue";
import createGroupDialog from "../vue/dialogs/createGroup.vue";
import colorConfigDialog from "../vue/color/colorDialog.vue";
import LinkToGroup from "../vue/linkToGroup/linkToGroup.vue";


import linkRoomPanel from "../vue/panel/linkerDialog.vue";
import GlobalLinkerPanel from "../vue/panel/globalLinkerPanel.vue";


const {
  SpinalMountExtention,
} = require("spinal-env-viewer-panel-manager-service");

const {
  SpinalForgeExtention,
} = require("spinal-env-viewer-panel-manager-service_spinalforgeextention");

const dialogs = [{
    name: "linkToGroupDialog",
    vueMountComponent: vue.extend(LinkToGroup),
    parentContainer: document.body
  },
  {
    name: "createGroupContextDialog",
    vueMountComponent: vue.extend(createContextGroup),
    parentContainer: document.body,
  },
  {
    name: "createCategoryDialog",
    vueMountComponent: vue.extend(createCategoryDialog),
    parentContainer: document.body,
  },
  {
    name: "createGroupDialog",
    vueMountComponent: vue.extend(createGroupDialog),
    parentContainer: document.body,
  },
  {
    name: "colorConfigDialog",
    vueMountComponent: vue.extend(colorConfigDialog),
    parentContainer: document.body,
  }
];

for (let index = 0; index < dialogs.length; index++) {
  SpinalMountExtention.mount(dialogs[index]);
}

///////////////////////////////////////////////////////////////////////////
//                     REGISTER PANEL                                    //
///////////////////////////////////////////////////////////////////////////

let panels = [{
    name: "linkRoomPanel",
    vueMountComponent: vue.extend(linkRoomPanel),
    panel: {
      title: "Link Rooms Panel",
      closeBehaviour: "hide",
    },
    style: {
      height: "475px",
      left: "400px",
    },
  },
  {
    name: "globalLinkRoomPanel",
    vueMountComponent: vue.extend(GlobalLinkerPanel),
    panel: {
      title: "Link",
      closeBehaviour: "hide",
    },
    style: {
      height: "475px",
      left: "400px",
    },
  },
];

for (let index = 0; index < panels.length; index++) {
  const element = panels[index];
  const panelExtension = SpinalForgeExtention.createExtention(element);
  SpinalForgeExtention.registerExtention(element.name, panelExtension);
}