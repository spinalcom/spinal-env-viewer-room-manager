
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

    <div v-if="tempList.length > 0 && !loaded"
         class="_container">
      <md-list class="listItem md-scrollbar">
        <md-list-item class="listContainer"
                      v-for="(item, index) in tempList"
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
      <!-- <pagination-component class="paginationContent"></pagination-component> -->
    </div>

    <div class="_container empty"
         v-if="tempList.length === 0 && !loaded">
      No Data found !
    </div>

    <div class="_container empty"
         v-if="loaded">
      Loading...
    </div>

  </md-content>
</template>

<script>
import filterMenu from "../filterMenu/menu.vue";

import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import { groupService, ROOMS_GROUP } from "../../js/service";
const {
  spinalPanelManagerService
} = require("spinal-env-viewer-panel-manager-service");

// import paginationComponent from "../pagination/paginationComponent.vue";

import EventBus from "../../js/event";

export default {
  name: "linkPanelContent",
  components: {
    // "pagination-component": paginationComponent,
    "filter-menu": filterMenu
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
      loaded: true
    };
  },
  methods: {
    opened(option) {
      this.loaded = true;
      this.contextId = option.contextId;
      this.groupId = option.nodeId;

      this.title =
        "Link " + (option.type === ROOMS_GROUP ? "Rooms" : "BimObject");
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
        this.getDataLinked(option.nodeId)
      ]).then(res => {
        this.data = res[0];
        this.tempList = res[0];
        this.dataLinked = res[1];
        this.loaded = false;
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
    },
    openSearchBar() {
      this.isOpened = !this.isOpened;
    }
  },
  watch: {
    search: function(newValue) {
      newValue = newValue.trim();
      console.log("newValue", newValue);
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
  font-size: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
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


