import vue from "vue";

const { SpinalForgeExtention } = require("spinal-env-viewer-panel-manager-service_spinalforgeextention");

import linkRoomPanel from "./linkerDialog.vue";
import GlobalLinkerPanel from "./globalLinkerPanel.vue";



let panels = [
   {
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