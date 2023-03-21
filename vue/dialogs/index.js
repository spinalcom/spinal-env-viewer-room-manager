import vue from "vue";

const {
  SpinalMountExtention,
} = require("spinal-env-viewer-panel-manager-service");

import createContextGroup from "./create/createContext.vue";
import createCategoryDialog from "./create/createCategory.vue";
import createGroupDialog from "./create/createGroup.vue";
import colorConfigDialog from "./color/colorDialog.vue";
import LinkToGroup from "./linkToGroup/linkToGroup.vue";
import SelectGroupTypeDialog from "./selectTypeDialog.vue";
import AddBimObjectToGroupDialog from "./linkToGroup/linkBimObjectToGroup.vue";

const dialogs = [
  {
    name: "linkToGroupDialog",
    vueMountComponent: vue.extend(LinkToGroup),
    parentContainer: document.body,
  },
  {
    name: "addBimObjectToGroupDialog",
    vueMountComponent: vue.extend(AddBimObjectToGroupDialog),
    parentContainer: document.body,
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
  },
  {
    name: "selectGroupTypeDialog",
    vueMountComponent: vue.extend(SelectGroupTypeDialog),
    parentContainer: document.body,
  },
];

for (let index = 0; index < dialogs.length; index++) {
  SpinalMountExtention.mount(dialogs[index]);
}
