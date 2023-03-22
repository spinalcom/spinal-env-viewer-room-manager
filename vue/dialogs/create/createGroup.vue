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
    <md-dialog-title>{{ title | toUpperCase }}</md-dialog-title>

    <md-dialog-content class="dialogContainer">

      <md-field>
        <label>Group name</label>
        <md-input v-model="inputValue"></md-input>
      </md-field>

      <div class="iconComponent">
        <icon-component @selectIcon="selectIcon"
                        :selected="iconSelected"></icon-component>
      </div>

      <div class="colorDiv">
        <chrome-picker v-model="color" />
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
import iconComponent from "./iconsComponents.vue";
import { Chrome, Photoshop } from "vue-color";
import { groupManagerService } from "spinal-env-viewer-plugin-group-manager-service";
import EventBus from "../../../js/event.js";

export default {
  name: "createGroupDialog",
  props: ["onFinised"],
  components: {
    "chrome-picker": Chrome,
    "icon-component": iconComponent,
    "photoshop-picker": Photoshop,
  },
  data() {
    this.edit;
    return {
      showDialog: true,
      title: "",
      contextId: null,
      color: "#000000",
      inputValue: "",
      selectedNode: undefined,
      iconSelected: undefined,
      callback: () => {},
    };
  },
  methods: {
    opened(option) {
      this.edit = option.edit;
      this.title = option.title;
      this.contextId = option.contextId;
      this.selectedNode = option.selectedNode.id.get();
      this.iconSelected = "3d_rotation";
      console.log("option", option);
      if (this.edit) {
        this.inputValue = option.selectedNode.name.get();
        this.color = option.color;
        this.iconSelected =
          (option.selectedNode.icon && option.selectedNode.icon.get()) ||
          "3d_rotation";
      }

      if (option.callback) this.callback = option.callback;
    },

    removed(closed) {
      if (closed) {
        this.createElement().then((result) => {
          const id = result.info ? result.info.id.get() : result.id.get();
          this.sentEvent(id);
        });
      }
      this.showDialog = false;
    },

    closeDialog(closeResult) {
      if (typeof this.onFinised === "function") {
        this.onFinised(closeResult);
      }
    },

    sentEvent(id) {
      if (this.callback && typeof this.callback === "function")
        this.callback(id);

      EventBus.$emit("itemCreated", id);
    },

    isDisabled() {
      return this.inputValue.trim().length === 0;
    },

    selectIcon(icon) {
      this.iconSelected = icon;
    },

    createElement() {
      const color =
        typeof this.color === "string" ? this.color : this.color.hex;

      if (!this.edit) {
        return groupManagerService.addGroup(
          this.contextId,
          this.selectedNode,
          this.inputValue.trim(),
          color,
          this.iconSelected
        );
      } else {
        return groupManagerService.updateGroup(this.selectedNode, {
          name: this.inputValue.trim(),
          color: color,
          icon: this.iconSelected,
        });
      }
    },
  },
  filters: {
    toUpperCase: function (data) {
      return data.toUpperCase();
    },
  },
};
</script>

<style scoped>
.dialogContainer {
  /* width: 500px !important; */
  /* height: 100% !important; */
}
.dialogContainer .iconComponent {
  /* height: 50%; */
  margin-bottom: 15px;
}

.dialogContainer .colorDiv {
  /* height: 50%; */
}

/* .dialogContainer .colorDiv > * {
  width: 100%;
  height: 100%;
} */
</style>
