<template>
  <md-dialog :md-active.sync="showDialog"
             @md-closed="closeDialog(false)">
    <md-dialog-title>{{title}}</md-dialog-title>

    <md-dialog-content>
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
      </div>

    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary"
                 @click="closeDialog(false)">Close</md-button>
      <md-button class="md-primary"
                 @click="closeDialog(true)"
                 :disabled="!(inputValue.trim().length > 0)">Save</md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
import {
  ROOMS_GROUP_CONTEXT,
  EQUIPMENTS_GROUP_CONTEXT,
  EQUIPMENTS_GROUP,
  groupService
} from "../js/service";

export default {
  name: "createGroupContextDialog",
  props: ["onFinised"],
  data() {
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
      showDialog: true,
      title: "",
      inputValue: "",
      type: "",
      typeSelected: ROOMS_GROUP_CONTEXT,
      parent: null
    };
  },
  methods: {
    opened(option) {
      this.title = option.title;
      this.type = option.type;
      this.parent = option.selectedNode;
      // !this.isRoomsGroup() ? (this.showDialog = true) : this.removed(true);
    },

    removed(closed) {
      if (closed) {
        if (typeof this.parent === "undefined") {
          groupService.createGroupContext(
            this.inputValue.trim(),
            this.typeSelected
          );
        } else {
          // if (this.parent.type.get() === ROOMS_GROUP) {
          groupService.addElement(
            this.parent.id.get(),
            this.parent.type.get(),
            this.inputValue
          );
          // }
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
    }
  }
};
</script>