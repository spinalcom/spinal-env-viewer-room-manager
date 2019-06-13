
<template>
  <md-dialog :md-active.sync="showDialog"
             @md-closed="closeDialog(false)">
    <md-dialog-title>{{title}}</md-dialog-title>
    <md-dialog-content>
      <chrome-picker v-model="color" />
    </md-dialog-content>
    <md-dialog-actions>
      <md-button class="md-primary"
                 @click="closeDialog(false)">Close</md-button>
      <md-button class="md-primary"
                 @click="closeDialog(true)">Save</md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
import { Chrome } from "vue-color";
import { SpinalGraphService } from "spinal-env-viewer-graph-service";

export default {
  name: "colorConfigDialog",
  props: ["onFinised"],
  components: {
    "chrome-picker": Chrome
  },
  data() {
    return {
      showDialog: true,
      title: "",
      color: "#000000",
      node: null
    };
  },
  methods: {
    opened(option) {
      this.title = option.title;
      this.color = option.color;
      this.node = option.selectedNode;
    },
    closeDialog(closeResult) {
      if (typeof this.onFinised === "function") {
        this.onFinised(closeResult);
      }
    },
    removed(closed) {
      if (closed) {
        let realNode = SpinalGraphService.getRealNode(this.node.id.get());

        if (!realNode.info.color) {
          realNode.info.add_attr("color", this.color.hex);
        } else {
          realNode.info.color.set(this.color.hex);
        }
      }
      this.showDialog = false;
    }
  }
};
</script>