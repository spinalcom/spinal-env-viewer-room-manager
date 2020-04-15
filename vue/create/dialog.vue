<!--
Copyright 2020 SpinalCom - www.spinalcom.com

This file is part of SpinalCore.

Please read all of the following terms and conditions
of the Free Software license Agreement ("Agreement")
carefully.

This Agreement is a legally binding contract between
the Licensee (as defined below) and SpinalCom that
sets forth the terms and conditions that govern your
use of the Program. By installing and/or using the
Program, you agree to abide by all the terms and
conditions stated or referenced herein.

If you do not agree to abide by these terms and
conditions, do not demonstrate your acceptance and do
not install or use the Program.
You should have received a copy of the license along
with this file. If not, see
<http://resources.spinalcom.com/licenses.pdf>.
-->

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

import { groupService } from "../../services/service";

// import bimObjectService from "spinal-env-viewer-plugin-bimobjectservice";

// const bimObjectService = window.spinal.BimObjectService;
import { spinalPanelManagerService } from "spinal-env-viewer-panel-manager-service";

import { SpinalGraphService } from "spinal-env-viewer-graph-service";

import iconComponent from "./iconsComponents.vue";

import { bimObjectManagerService } from "spinal-env-viewer-bim-manager-service";

import EventBus from "../../js/event.js";

// const viewer = window.spinal.ForgeViewer.viewer;

import geographicService from "spinal-env-viewer-context-geographic-service";
import bimobjectservice from "spinal-env-viewer-plugin-bimobjectservice";

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
        type: groupService.constants.ROOMS_GROUP_CONTEXT
      },
      {
        name: "Equipments Group",
        type: groupService.constants.EQUIPMENTS_GROUP_CONTEXT
      },
      {
        name: "Endpoint Group",
        type: groupService.constants.ENDPOINTS_GROUP_CONTEXT
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
      typeSelected: groupService.constants.ROOMS_GROUP_CONTEXT,
      parent: undefined,
      contextId: null,
      callback: () => {}
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

      if (option.callback) this.callback = option.callback;

      if (this.hide) this.onFinised(true);
    },

    removed(closed) {
      if (closed) {
        let value = this.inputValue.trim();

        if (typeof this.parent === "undefined") {
          groupService
            .createGroupContext(value, this.typeSelected)
            .then(_res => {
              this.sentEvent(_res.info.id.get());
            });
        } else if (typeof this.hide === "undefined") {
          if (typeof this.edit === "undefined") {
            let type = this.parent.type.get();

            groupService
              .addElement(
                this.contextId,
                this.parent.id.get(),
                type,
                value,
                this.iconSelected,
                this.color ? this.color.hex : undefined
              )
              .then(_res => {
                this.sentEvent(_res.info.id.get());
              });
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
          if (type === groupService.constants.EQUIPMENTS_GROUP) {
            this.addBimObject();
          } else if (type === groupService.constants.ROOMS_GROUP) {
            this.addRooms();
          } else {
            console.log("endpoints");
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
      return (
        this.parent &&
        this.parent.type.get() === groupService.constants.EQUIPMENTS_GROUP
      );
    },

    addBimObject() {
      let selections = window.spinal.ForgeViewer.viewer.getAggregateSelection();

      if (selections.length === 0) {
        alert("select an item");
        return;
      }

      selections = selections.map(el => {
        return bimObjectManagerService.getLeafDbIds(el.model, el.selection);
      });

      Promise.all(selections).then(selected => {
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
                ).then(() => {
                  // if (res) {
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
                        bimObject.id
                          ? bimObject.id.get()
                          : bimObject.info.id.get(),
                        this.contextId
                      );
                    }
                  });
                  // }
                });
              });
            }
          );
        }
      });

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

    addRooms() {
      let nodeType = this.parent.type.get();
      let contextId = this.contextId;
      let nodeId = this.parent.id.get();

      // let tempList = [
      //   ...groupService.constants.GROUPS_TYPES,
      //   groupService.constants.CATEGORY_TYPE
      // ];

      // if (tempList.indexOf(nodeType) === -1) {
      spinalPanelManagerService.openPanel(
        "linkRoomPanel",
        this.getParameter(contextId, nodeId, nodeType)
      );
      // } else {
      //   spinalPanelManagerService.openPanel("globalLinkRoomPanel", {
      //     nodeId: nodeId,
      //     contextId: contextId
      //   });
      // }
    },

    getParameter(contextId, nodeId, nodeType) {
      let obj = {
        context:
          nodeType === groupService.constants.ROOMS_GROUP
            ? geographicService.constants.ROOM_REFERENCE_CONTEXT
            : bimobjectservice.constants.BIM_OBJECT_CONTEXT_TYPE,

        relation:
          nodeType === groupService.constants.ROOMS_GROUP
            ? geographicService.constants.ROOM_RELATION
            : bimobjectservice.constants.BIM_OBJECT_RELATION_NAME
      };

      return {
        contextId: contextId,
        nodeId: nodeId,
        type: nodeType,
        reference: obj
      };
    },

    isCategory() {
      let type;

      if (typeof this.parent !== "undefined") {
        type = this.parent.type.get();
      }

      return (
        groupService.constants.CONTEXTS_TYPES.indexOf(type) !== -1 ||
        (typeof this.edit !== "undefined" &&
          type === groupService.constants.CATEGORY_TYPE)
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
          this.parent.type.get() === groupService.constants.CATEGORY_TYPE
        );
      } else {
        let type = this.parent.type.get();

        return groupService.constants.GROUPS_TYPES.indexOf(type) !== -1;
      }
    },

    sentEvent(id) {
      if (this.callback && typeof this.callback === "function")
        this.callback(id);

      EventBus.$emit("itemCreated", id);
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
