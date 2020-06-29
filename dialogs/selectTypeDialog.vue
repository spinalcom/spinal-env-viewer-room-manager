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
    <md-dialog-title>{{"Select type".toUpperCase()}}</md-dialog-title>

    <md-dialog-content class="dialogContainer">
      <div>
        <md-field>
          <label for="movie">Select Group</label>
          <md-select v-model="typeSelected"
                     name="groupType"
                     id="groupType">
            <md-option v-for="(type,index) in types"
                       :key="index"
                       :value="type.type">{{type.name}}</md-option>
          </md-select>
        </md-field>
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
import { spinalPanelManagerService } from "spinal-env-viewer-panel-manager-service";
import groupTypes from "../js/types";

export default {
  name: "selectTypeDialog",
  props: ["onFinised"],
  data() {
    this.types = groupTypes;
    return {
      showDialog: true,
      typeSelected: undefined
    };
  },
  methods: {
    opened(option) {},
    removed(closed) {
      if (closed) {
        spinalPanelManagerService.openPanel("linkToGroupDialog", {
          type: this.typeSelected,
          itemSelected: []
        });
      }
      this.showDialog = false;
    },

    closeDialog(closeResult) {
      if (typeof this.onFinised === "function") {
        this.onFinised(closeResult);
      }
    },

    isDisabled() {
      return this.typeSelected ? false : true;
    }
  }
};
</script>