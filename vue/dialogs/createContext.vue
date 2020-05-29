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

        <div v-if="!pre.selected">
          <span class="md-title">Choose :</span>

          <md-radio class="md-primary"
                    v-for="(t, index) in GroupTypes"
                    :key="index"
                    v-model="typeSelected"
                    :value="t.type">{{ t.name }}</md-radio>
        </div>

        <div v-else>
          type selected : {{pre.type}}
        </div>

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
import EventBus from "../../js/event.js";
import CREATE_DATA_TYPES from "../../js/types.js";
import geographicService from "spinal-env-viewer-context-geographic-service";

import { groupManagerService } from "spinal-env-viewer-plugin-group-manager-service";

export default {
  name: "createGroupContextDialog",
  props: ["onFinised"],
  data() {
    this.GroupTypes = CREATE_DATA_TYPES;

    return {
      showDialog: true,
      title: "",
      inputValue: "",
      typeSelected: geographicService.constants.ROOM_TYPE,
      pre: {
        selected: false,
        type: undefined
      }
    };
  },

  methods: {
    opened(option) {
      this.title = option.title;

      if (option.typePreselected) {
        this.pre.selected = true;
        this.pre.type = option.typePreselected;
      } else {
        this.pre.selected = false;
        this.pre.type = undefined;
      }
    },

    removed(closed) {
      if (closed) {
        let value = this.inputValue.trim();

        if (this.pre.selected) this.typeSelected = this.pre.type;

        groupManagerService
          .createGroupContext(value, this.typeSelected)
          .then(_res => {
            this.sentEvent(_res.info.id.get());
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