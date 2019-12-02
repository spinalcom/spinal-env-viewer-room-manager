<template>
  <md-checkbox v-model="value"
               class="md-primary"
               @change="linkElement"></md-checkbox>
</template>


<script>
import { groupService } from "../../services/service";

export default {
  name: "checkboxComponent",
  props: ["groupId", "elementId", "contextId"],
  data() {
    return {
      value: false
    };
  },
  mounted() {
    groupService
      .elementIsLinkedToGroup(this.groupId, this.elementId)
      .then(el => {
        // console.log("isLinked", el);

        this.value = el;
      });
  },
  methods: {
    linkElement() {
      groupService
        .elementIsLinkedToGroup(this.groupId, this.elementId)
        .then(el => {
          if (!el) {
            groupService.linkElementToGroup(
              this.groupId,
              this.elementId,
              this.contextId
            );
          } else {
            groupService.removeLink(this.groupId, this.elementId);
          }
        });
    }
  }
};
</script>