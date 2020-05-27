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
      <div>
        <md-field>
          <label>Name</label>
          <md-input v-model="inputValue"></md-input>
        </md-field>

        <icon-component @selectIcon="selectIcon"
                        :selected="iconSelected"></icon-component>

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
import EventBus from "../../js/event.js";
import { groupManagerService } from "spinal-env-viewer-plugin-group-manager-service";

export default {
  name: "createCategoryDialog",
  props: ["onFinised"],
  components: {
    "icon-component": iconComponent
  },
  data() {
    this.edit;
    return {
      showDialog: true,
      iconSelected: undefined,
      title: "",
      inputValue: "",
      selectedNode: undefined,
      contextId: null,
      callback: () => {}
    };
  },
  methods: {
    opened(option) {
      this.edit = option.edit;

      this.title = option.title;
      this.contextId = option.contextId;

      this.selectedNode = option.selectedNode.id.get();

      if (this.edit) {
        this.inputValue = option.selectedNode.name.get();
        this.iconSelected = option.iconSelected;
      }

      if (option.callback) this.callback = option.callback;
    },
    removed(closed) {
      if (closed) {
        this.createElement().then(result => {
          this.sentEvent(result.info.id.get());
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

    selectIcon(icon) {
      this.iconSelected = icon;
    },

    createElement() {
      if (!this.edit) {
        return groupManagerService.addCategory(
          this.contextId,
          this.inputValue.trim(),
          this.iconSelected
        );
      } else {
        return groupManagerService.updateCategory(this.selectedNode, {
          name: this.inputValue.trim(),
          icon: this.iconSelected
        });
      }
    },

    isDisabled() {
      return (
        this.inputValue.trim().length === 0 ||
        typeof this.iconSelected === "undefined"
      );
    }
  },
  filters: {
    toUpperCase: function(data) {
      return data.toUpperCase();
    }
  }
};
</script>