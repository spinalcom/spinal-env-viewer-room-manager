
<template>
  <md-content class="mdContent">
    <div class="header">
      <!-- <md-field class="search md-inline">
        <label>Voice</label>
        <md-input v-model="voice"></md-input>
        <md-icon>keyboard_voice</md-icon>
      </md-field> -->

      <!-- <div class="searchDiv">
        <input type="search"
               name="search"
               id="search">

        </div>
               -->

      <div class="buscar-caja"
           :class="{'isOpened' : isOpened}">

        <input type="text"
               name=""
               class="buscar-txt"
               placeholder="Search..."
               :class="{'isOpened' : isOpened}"
               v-model="search" />
        <a class="md-icon-button buscar-btn"
           @click="openSearchBar">
          <!-- <i class="far fa-search"></i> -->
          <md-icon>search</md-icon>
        </a>
      </div>

      <!-- <filter-menu></filter-menu> -->

    </div>

    <div v-if="tempList.length > 0 && !loaded && !error"
         class="_container">
      <md-list class="listItem md-scrollbar">
        <md-list-item class="listContainer"
                      v-for="(item, index) in tempList"
                      :key="index"
                      @mouseover="eventMethod('mouseover',item)"
                      @mouseleave="eventMethod('mouseleave',item)">
          <span class="md-list-item-text">{{item.name}}</span>

          <div v-if="elementExistInCategory(item)"
               class="groupColor"
               :style="{backgroundColor : item.groupColor}"
               :title="'Linked to ' + item.groupName"></div>

          <md-button class="md-icon-button"
                     @click="linkUnlink(item)">
            <md-icon>{{getIcon(item)}}</md-icon>
          </md-button>
        </md-list-item>
      </md-list>
    </div>

    <!-- <md-list v-if="tempList.length > 0 && !loaded">
      <DynamicScroller :items="tempList"
                       :min-item-size="10"
                       class="_container">

        <template v-slot="{item,index,active}">

          <DynamicScrollerItem :item="item"
                               :active="active"
                               :data-index="index"></DynamicScrollerItem>

          <md-list-item class="listContainer"
                        :key="index"
                        @mouseover="eventMethod('mouseover',item)"
                        @mouseleave="eventMethod('mouseleave',item)">
            <span class="md-list-item-text">{{item.name}}</span>
            <md-button class="md-icon-button"
                       @click="linkUnlink(item)">
              <md-icon>{{getIcon(item)}}</md-icon>
            </md-button>
          </md-list-item>

        </template>

      </DynamicScroller>
    </md-list> -->

    <div class="_container empty"
         v-if="tempList.length === 0 && !loaded && !error">
      No Data found !
    </div>

    <div class="_container empty"
         v-if="loaded && !error">
      <md-progress-spinner class="spiner"
                           md-mode="indeterminate"></md-progress-spinner>
    </div>

    <div class="_container empty"
         v-if="error">
      Sorry, Something was wrong. Please retry !!
    </div>

  </md-content>
</template>

<script>
// import Vue from "vue";
// import { DynamicScroller, DynamicScrollerItem } from "vue-virtual-scroller";

// Vue.component("DynamicScroller", DynamicScroller);
// Vue.component("DynamicScrollerItem", DynamicScrollerItem);

// import filterMenu from "../filterMenu/menu.vue";

import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import { groupService } from "../../services/service";
const {
  spinalPanelManagerService
} = require("spinal-env-viewer-panel-manager-service");

// import paginationComponent from "../pagination/paginationComponent.vue";

import EventBus from "../../js/event";

export default {
  name: "linkPanelContent",
  components: {
    // "pagination-component": paginationComponent,
    // "filter-menu": filterMenu
  },
  data() {
    this.data = [];
    this.contextId;
    this.groupId;
    this.countPerPage = 10;
    return {
      search: "",
      isOpened: false,
      title: "",
      tempList: [],
      dataLinked: [],
      currentPage: 1,
      loaded: true,
      error: false,
      categorySumary: []
    };
  },
  methods: {
    opened(option) {
      this.loaded = true;
      this.error = false;
      this.contextId = option.contextId;
      this.groupId = option.nodeId;

      this.title =
        "Link " +
        (option.type === groupService.constants.ROOMS_GROUP
          ? "Rooms"
          : "BimObject");
      this.setTitle(this.title);
      let refContext = SpinalGraphService.getContext(option.reference.context);

      if (typeof refContext === "undefined") {
        this.tempList = [];
        this.data = [];
        this.dataLinked = [];
        this.loaded = false;
        return;
      }

      let refContextId = refContext.info.id.get();

      Promise.all([
        this.getData(refContextId, option.reference.relation),
        this.getDataLinked(option.nodeId),
        this.getOtherGroupData(option.nodeId)
      ])
        .then(res => {
          this.data = res[0];
          this.tempList = res[0];
          this.dataLinked = res[1];
          this.categorySumary = res[2];

          this.loaded = false;
        })
        .catch(() => {
          // console.log(error);

          this.error = true;
        });

      // this.data = await this.getData(refContextId, option.reference.relation);
      // this.dataLinked = await this.getDataLinked(option.nodeId);
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
        if (element.id === item.id) {
          this.dataLinked.splice(i, 1);
          return;
        }
      }
    },
    linkUnlink(item) {
      if (this.isLinked(item)) {
        groupService.removeLink(this.groupId, item.id).then(() => {
          this.deleteItem(item);
        });
      } else {
        groupService
          .linkElementToGroup(this.groupId, item.id, this.contextId)
          .then(res => {
            if (typeof res.old_group !== "undefined") {
              let group = this.categorySumary.find(el => {
                return el.id === res.old_group;
              });

              if (typeof group !== "undefined") {
                group.children = group.children.filter(el => {
                  return el !== item.id;
                });
              }
            }

            this.dataLinked.push(item);
          });
      }
    },
    eventMethod(eventName, item) {
      EventBus.$emit(eventName, item);
    },
    openSearchBar() {
      this.isOpened = !this.isOpened;
    },
    getOtherGroupData(nodeId) {
      return groupService
        .getCategorie(SpinalGraphService.getInfo(nodeId))
        .then(res => {
          let parent = res ? res[0] : undefined;

          if (parent) {
            // let type = parent.type.get();
            let relationName =
              groupService.constants.CATEGORY_TO_GROUP_RELATION;

            return SpinalGraphService.getChildren(parent.id.get(), [
              relationName
            ]).then(children => {
              return children
                .filter(child => {
                  return child.id.get() !== nodeId;
                })
                .map(el => {
                  // console.log("el", el);
                  return {
                    id: el.id.get(),
                    name: el.name.get(),
                    color: el.color ? el.color.get() : "#000000",
                    children: el.childrenIds
                  };
                });
            });
          }
        });
    },
    elementExistInCategory(item) {
      let id = item.id;
      let parent = this.categorySumary.find(el => {
        return el.children.indexOf(id) !== -1;
      });

      if (typeof parent !== "undefined") {
        item["groupName"] = parent.name;
        item["groupColor"] = parent.color;
        return true;
      }

      return false;
    }
  },
  watch: {
    search: function(newValue) {
      newValue = newValue.trim();
      // console.log("newValue", newValue);
      if (newValue.length === 0) {
        this.tempList = this.data;
      } else {
        this.tempList = this.data.filter(el => {
          return el.name.toLowerCase().includes(newValue);
        });
      }
    }
  }
  // computed: {
  //   isOpened: function() {
  //     return this.search.trim().length > 0;
  //   }
  // }
};
</script>

<style scoped>
.mdContent {
  width: 100%;
  height: 100%;
}

.header {
  /* text-align: center;
  font-size: 16px; */
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: row-reverse;
}

/* .header .searchDiv {
  width: 60%;
  height: 100%;
  padding-top: 10px;
} */

._container {
  width: 100%;
  height: calc(100% - 40px);
  overflow: hidden;
}

._container .listItem {
  width: 100%;
  height: calc(100% - 80px);
  overflow: hidden;
  overflow-y: auto;
}

.empty {
  /* width: 100%;
  height: 200px; */
  width: 40%;
  text-align: center;
  font-size: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  margin: auto;
}

.listContainer {
  border-bottom: 1px solid white;
}

.listContainer:hover {
  cursor: pointer;
  background-color: gray;
}

.paginationContent {
  width: 40%;
  margin: auto;
  height: 40px;
}

.paginationContent {
  width: 100%;
  height: 40px;
}

.groupColor {
  width: 24px;
  height: 24px;
  border: 1px solid white;
}

.spiner {
  position: absolute;
  top: calc(50% - 30px);
  right: calc(50% - 30px);
}
</style>


<style>
.listContainer .md-list-item-content {
  padding-left: 5px;
  /* padding-top: 4px;
  padding-bottom: 4px; */
}

/*
//////////////////////////////////////////////////////////////////
*/

.buscar-caja {
  /* position: absolute; */
  /* top: 50%;
  left: 50%; */
  /* right: 0; */
  /* transform: translate(-50%, -50%); */
  /* background: #2f3640; */
  height: 35px;
  border-radius: 40px;
  margin-top: 5px;
  /* padding: 10px; */
}

.buscar-caja.isOpened {
  background: #2f3640;
}

/* .buscar-caja:hover > .buscar-txt, */
.buscar-caja > .buscar-txt.isOpened {
  width: 240px;
  padding: 0 6px;
}

/* .buscar-caja:hover > .buscar-btn {
  background: white;
  color: black;
} */

.buscar-btn {
  color: #e84118;
  float: right;
  width: 40px;
  height: 35px;
  border-radius: 50%;
  /* background: #2f3640; */
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.4s;
  color: white;
  cursor: pointer;
}

.buscar-btn > i {
  font-size: 30px;
}

.buscar-txt {
  border: none;
  background: none;
  outline: none;
  float: left;
  padding: 0;
  color: white;
  font-size: 16px;
  transition: 0.4s;
  line-height: 40px;
  width: 0px;
  /* font-weight: bold; */
}
</style>


