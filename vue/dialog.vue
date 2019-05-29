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
                        v-if="isCategory()"></icon-component>

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
import {
  ROOMS_GROUP_CONTEXT,
  EQUIPMENTS_GROUP_CONTEXT,
  EQUIPMENTS_GROUP,
  ROOMS_GROUP,
  groupService
} from "../js/service";

import bimObjectService from "spinal-env-viewer-plugin-bimobjectservice";
import { SpinalGraphService } from "spinal-env-viewer-graph-service";

import iconComponent from "./iconsComponents.vue";

// const viewer = window.spinal.ForgeViewer.viewer;

export default {
  name: "createGroupContextDialog",
  props: ["onFinised"],
  components: {
    "icon-component": iconComponent
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
    return {
      iconSelected: undefined,
      showDialog: false,
      title: "",
      inputValue: "",
      type: "",
      typeSelected: ROOMS_GROUP_CONTEXT,
      parent: undefined,
      contextId: null
    };
  },
  methods: {
    opened(option) {
      this.hide = option.hide; // hide dialog Modal

      this.showDialog = typeof option.hide === "undefined" ? true : false;

      this.title = option.title;
      this.type = option.type;
      this.parent = option.selectedNode;
      this.contextId = option.contextId;

      if (this.hide) this.onFinised(true);
      // !this.isRoomsGroup() ? (this.showDialog = true) : this.removed(true);
    },

    removed(closed) {
      if (closed) {
        let value = this.inputValue.trim();

        if (typeof this.parent === "undefined") {
          groupService.createGroupContext(value, this.typeSelected);
        } else if (typeof this.hide === "undefined") {
          let type = this.parent.type.get();

          // if (this.parent.type.get() === ROOMS_GROUP) {
          groupService.addElement(
            this.contextId,
            this.parent.id.get(),
            type,
            value,
            this.iconSelected
          );
          // }
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
    isRoomsGroup() {
      return this.parent && this.parent.type.get() === EQUIPMENTS_GROUP;
    },

    closeDialog(closeResult) {
      if (typeof this.onFinised === "function") {
        this.onFinised(closeResult);
      }
    },

    addBimObject() {
      let selected = window.spinal.ForgeViewer.viewer.getSelection();
      if (selected.length === 0) {
        alert("select an item");
        return;
      }

      selected = selected.map(el => {
        return bimObjectService.createBIMObject(el, "bim");
      });

      Promise.all(selected).then(res => {
        res.forEach(el => {
          SpinalGraphService._addNode(el);
          groupService.linkElementToGroup(
            this.parent.id.get(),
            el.info.id.get(),
            this.contextId
          );
        });
      });
    },

    addRooms() {
      console.log("add Rooms");
    },
    isCategory() {
      let type;

      if (typeof this.parent !== "undefined") {
        type = this.parent.type.get();
      }

      return type === ROOMS_GROUP_CONTEXT || type === EQUIPMENTS_GROUP_CONTEXT;
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
