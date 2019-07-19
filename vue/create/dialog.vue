<template>
  <md-dialog :md-active.sync="showDialog"
             @md-closed="closeDialog(false)">
    <md-dialog-title>{{title | toUpperCase}}</md-dialog-title>

    <md-dialog-content class="dialogContainer">
      <div v-if="type === 'context'">
        <md-field>
          <label>Name</label>
          <md-input v-model="inputValue"></md-input>
        </md-field>

        <div>
          <span class="md-title">Choose :</span>

          <md-radio class="md-primary"
                    v-for="(t, index) in GroupTypes"
                    :key="index"
                    v-model="typeSelected"
                    :value="t.type">{{ t.name }}</md-radio>
        </div>

      </div>

      <div v-if="type === 'element'">
        <md-field>
          <label>Name</label>
          <md-input v-model="inputValue"></md-input>
        </md-field>

        <icon-component @selectIcon="selectIcon"
                        :selected="iconSelected"
                        v-if="isCategory()"></icon-component>

        <chrome-picker v-if="isGroup()"
                       v-model="color" />

      </div>

    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary"
                 @click="closeDialog(false)">Close</md-button>
      <md-button class="md-primary"
                 @click="closeDialog(true)"
                 :disabled="isDisabled()">Save</md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
import { Chrome } from "vue-color";

import {
  ROOMS_GROUP_CONTEXT,
  EQUIPMENTS_GROUP_CONTEXT,
  EQUIPMENTS_GROUP,
  ROOMS_GROUP,
  ROOMS_CATEGORY,
  EQUIPMENTS_CATEGORY,
  groupService
} from "../../js/service";

// import bimObjectService from "spinal-env-viewer-plugin-bimobjectservice";

// const bimObjectService = window.spinal.BimObjectService;

import { SpinalGraphService } from "spinal-env-viewer-graph-service";

import iconComponent from "./iconsComponents.vue";

// import { bimObjectManagerService } from "spinal-env-viewer-bim-manager-service";

// const viewer = window.spinal.ForgeViewer.viewer;

export default {
  name: "createGroupContextDialog",
  props: ["onFinised"],
  components: {
    "icon-component": iconComponent,
    "chrome-picker": Chrome
  },
  data() {
    this.hide;
    this.GroupTypes = [
      {
        name: "Rooms Group",
        type: ROOMS_GROUP_CONTEXT
      },
      {
        name: "Equipments Group",
        type: EQUIPMENTS_GROUP_CONTEXT
      }
    ];
    this.edit;

    return {
      iconSelected: undefined,
      showDialog: false,
      title: "",
      inputValue: "",
      type: "",
      color: null,
      typeSelected: ROOMS_GROUP_CONTEXT,
      parent: undefined,
      contextId: null
    };
  },
  methods: {
    opened(option) {
      this.hide = option.hide; // hide dialog Modal

      this.showDialog = typeof option.hide === "undefined" ? true : false;

      this.edit = option.edit;

      this.title = option.title;
      this.type = option.type;
      this.contextId = option.contextId;

      if (typeof this.edit === "undefined") {
        this.parent = option.selectedNode;

        this.color = this.isGroup() ? "#000000" : undefined;
      } else {
        this.parent = option.selectedNode;
        this.inputValue = option.selectedNode.name.get();
        this.color = option.color;
        this.iconSelected = option.iconSelected;
      }

      if (this.hide) this.onFinised(true);
    },

    removed(closed) {
      if (closed) {
        let value = this.inputValue.trim();

        if (typeof this.parent === "undefined") {
          groupService.createGroupContext(value, this.typeSelected);
        } else if (typeof this.hide === "undefined") {
          if (typeof this.edit === "undefined") {
            let type = this.parent.type.get();

            groupService.addElement(
              this.contextId,
              this.parent.id.get(),
              type,
              value,
              this.iconSelected,
              this.color ? this.color.hex : undefined
            );
          } else {
            let realNode = SpinalGraphService.getRealNode(this.parent.id.get());

            realNode.info.name.set(this.inputValue);

            if (this.color) {
              let color = this.color.hex || this.color;

              if (realNode.info.color) {
                realNode.info.color.set(color);
              } else {
                realNode.info.add_attr({
                  color: color
                });
              }
            } else if (this.iconSelected) {
              if (realNode.info.icon) {
                realNode.info.icon.set(this.iconSelected);
              } else {
                realNode.info.add_attr({
                  icon: this.iconSelected
                });
              }
            }
          }
        } else {
          let type = this.parent.type.get();
          if (type === EQUIPMENTS_GROUP) {
            this.addBimObject();
          } else if (type === ROOMS_GROUP) {
            this.addRooms();
          }
        }
      }
      this.showDialog = false;
    },

    closeDialog(closeResult) {
      if (typeof this.onFinised === "function") {
        this.onFinised(closeResult);
      }
    },

    isRoomsGroup() {
      return this.parent && this.parent.type.get() === EQUIPMENTS_GROUP;
    },

    addBimObject() {
      let selected = window.spinal.ForgeViewer.viewer.getAggregateSelection();

      if (selected.length === 0) {
        alert("select an item");
        return;
      }

      for (let idx = 0; idx < selected.length; idx++) {
        const { model, selection } = selected[idx];

        model.getBulkProperties(
          selection,
          {
            propFilter: ["name"]
          },
          el => {
            el.forEach(element => {
              window.spinal.BimObjectService.createBIMObject(
                element.dbId,
                element.name,
                model
              ).then(res => {
                if (res) {
                  window.spinal.BimObjectService.getBIMObject(
                    element.dbId,
                    model
                  ).then(bimObject => {
                    /////////////////////////////////////////////////////
                    //              EDIT ME TO ADD                     //
                    /////////////////////////////////////////////////////
                    if (bimObject) {
                      groupService.linkElementToGroup(
                        this.parent.id.get(),
                        bimObject.id.get(),
                        this.contextId
                      );
                    }
                  });
                }
              });
            });
          }
        );
      }

      // // let tempSelected = [];

      // // selected.forEach(el => {
      // //   console.log("el", el);
      // //   tempSelected.push(
      // //     ...bimObjectManagerService.getLeafDbIds(el.model, el.selection)
      // //   );
      // // });

      // selected = selected.map(el => {
      //   let leafDbIds = bimObjectManagerService.getLeafDbIds(
      //     el.model,
      //     el.selection
      //   );

      //   return bimObjectManagerService.getBimObjectProperties(leafDbIds);
      // });

      // Promise.all(selected).then(values => {
      //   values.forEach(res => {
      //     res.forEach(n => {
      //       n.properties.forEach(el => {
      //         this.createBimObjectNode(el);
      //       });
      //     });
      //   });
      // });

      // // window.spinal.ForgeViewer.viewer.model.getBulkProperties(
      // //   tempSelected,
      // //   {
      // //     propFilter: ["name"]
      // //   },
      // //   res => {
      // //     res.forEach(el => {
      // //       this.createBimObjectNode(el);
      // //     });
      // //   }
      // // );
    },

    createBimObjectNode(bimElement) {
      window.spinal.BimObjectService.createBIMObject(
        bimElement.dbId,
        bimElement.name
      ).then(el => {
        SpinalGraphService._addNode(el);
        groupService.linkElementToGroup(
          this.parent.id.get(),
          el.info.id.get(),
          this.contextId
        );
      });

      // Promise.all(selected).then(res => {
      //   res.forEach(el => {
      //     SpinalGraphService._addNode(el);
      //     groupService.linkElementToGroup(
      //       this.parent.id.get(),
      //       el.info.id.get(),
      //       this.contextId
      //     );
      //   });
      // });
    },
    addRooms() {},
    isCategory() {
      let type;

      if (typeof this.parent !== "undefined") {
        type = this.parent.type.get();
      }

      return (
        type === ROOMS_GROUP_CONTEXT ||
        type === EQUIPMENTS_GROUP_CONTEXT ||
        (typeof this.edit !== "undefined" &&
          (type === ROOMS_CATEGORY || type === EQUIPMENTS_CATEGORY))
      );
    },

    isDisabled() {
      if (this.isCategory()) {
        return (
          this.inputValue.trim().length === 0 ||
          typeof this.iconSelected === "undefined"
        );
      }
      return this.inputValue.trim().length === 0;
    },
    selectIcon(icon) {
      this.iconSelected = icon;
    },

    isGroup() {
      if (typeof this.edit === "undefined") {
        return (
          this.parent &&
          (this.parent.type.get() === ROOMS_CATEGORY ||
            this.parent.type.get() === EQUIPMENTS_CATEGORY)
        );
      } else {
        let type = this.parent.type.get();

        return type === ROOMS_GROUP || type === EQUIPMENTS_GROUP;
      }
    }
  },
  filters: {
    toUpperCase: function(data) {
      return data.toUpperCase();
    }
  }
};
</script>

<style scoped>
.dialogContainer {
  overflow: hidden !important;
}
</style>
