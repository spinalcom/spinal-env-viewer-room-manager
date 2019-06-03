
<template>
  <md-content class="md-scrollbar">
    <div class="title headline">{{title}}</div>
    <md-list v-if="data.length > 0">
      <md-list-item class="listContainer"
                    v-for="(item, index) in data"
                    :key="index"
                    @mouseover="eventMethod('mouseover',item)"
                    @mouseleave="eventMethod('mouseleave',item)">
        <span class="md-list-item-text">{{item.name}}</span>
        <md-button class="md-icon-button"
                   @click="linkUnlink(item)">
          <md-icon>{{getIcon(item)}}</md-icon>
        </md-button>
      </md-list-item>
    </md-list>

    <div class="empty"
         v-else>
      No Data found !
    </div>

  </md-content>
</template>

<script>
import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import { groupService, ROOMS_GROUP } from "../js/service";
const {
  spinalPanelManagerService
} = require("spinal-env-viewer-panel-manager-service");

import EventBus from "../js/event";

export default {
  name: "linkPanelContent",
  data() {
    this.contextId;
    this.groupId;
    return {
      title: "",
      data: [],
      dataLinked: []
    };
  },
  methods: {
    async opened(option) {
      this.contextId = option.contextId;
      this.groupId = option.nodeId;

      this.title =
        "Link " + (option.type === ROOMS_GROUP ? "Rooms" : "BimObject");
      this.setTitle(this.title);
      let refContext = SpinalGraphService.getContext(option.reference.context);

      if (typeof refContext === "undefined") {
        this.data = [];
        this.dataLinked = [];
        return;
      }

      let refContextId = refContext.info.id.get();
      this.data = await this.getData(refContextId, option.reference.relation);
      this.dataLinked = await this.getDataLinked(option.nodeId);
    },

    getData(parentId, relationName) {
      return SpinalGraphService.getChildren(parentId, relationName).then(
        res => {
          return res.map(el => el.get());
        }
      );
    },
    getDataLinked(id) {
      return groupService.getElementsLinked(id).then(res => {
        return res.map(el => el.get());
      });
    },
    setTitle(title) {
      spinalPanelManagerService.panels.linkRoomPanel.panel.setTitle(title);
    },
    isLinked(item) {
      return this.dataLinked.find(el => {
        return item.id === el.id;
      });
    },
    getIcon(item) {
      return typeof this.isLinked(item) === "undefined" ? "link" : "link_off";
    },
    deleteItem(item) {
      for (let i = 0; i < this.dataLinked.length; i++) {
        const element = this.dataLinked[i];
        if (element.id === item.item) {
          this.dataLinked.splice(i, 1);
          return;
        }
      }
    },
    linkUnlink(item) {
      if (this.isLinked(item)) {
        this.deleteItem(item);
        groupService.removeLink(this.groupId, item.id);
      } else {
        this.dataLinked.push(item);
        groupService.linkElementToGroup(this.groupId, item.id, this.contextId);
      }
    },
    eventMethod(eventName, item) {
      EventBus.$emit(eventName, item);
    }
  }
};
</script>

<style scoped>
.title {
  text-align: center;
}

.empty {
  width: 100%;
  height: 200px;
  font-size: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}
</style>


<style>
.listContainer .md-list-item-content {
  padding-left: 5px;
  padding-top: 4px;
  padding-bottom: 4px;
}
</style>


