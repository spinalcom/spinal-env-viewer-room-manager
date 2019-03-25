import vue from "vue";
import dialogComponent from "../vue/dialog.vue";
import colorConfigDialog from '../vue/colorDialog.vue';
import linkRoomDialog from '../vue/linkerDialog.vue'

const {
  SpinalMountExtention
} = require("spinal-env-viewer-panel-manager-service");

const dialogs = [{
    name: "createGroupContextDialog",
    vueMountComponent: vue.extend(dialogComponent),
    parentContainer: document.body
  },
  {
    name: "colorConfigDialog",
    vueMountComponent: vue.extend(colorConfigDialog),
    parentContainer: document.body
  },
  {
    name: "linkRoomDialog",
    vueMountComponent: vue.extend(linkRoomDialog),
    parentContainer: document.body
  }
];


for (let index = 0; index < dialogs.length; index++) {
  SpinalMountExtention.mount(dialogs[index]);
}