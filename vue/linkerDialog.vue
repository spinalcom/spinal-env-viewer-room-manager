<template>
  <md-dialog :md-active.sync="showDialog"
             @md-closed="closeDialog(false)"
             class="dialog">
    <md-dialog-title class="title">Link</md-dialog-title>

    <md-dialog-content class="dialogContainer">

      <!-- <md-table v-model="searched"
                class="table"
                md-sort="name"
                md-sort-order="asc"
                md-fixed-header>
        <md-table-toolbar class="md-layout md-gutter">

          <div class="md-layout-item md-size-50">

            <md-field>
              <label for="floors">Filter By Floor</label>
              <md-select v-model="floorsSelected"
                         name="floors"
                         id="floors"
                         multiple>
                <md-option value="fight-club">Fight Club</md-option>
                <md-option value="godfather">Godfather</md-option>
                <md-option value="godfather-ii">Godfather II</md-option>
                <md-option value="godfather-iii">Godfather III</md-option>
                <md-option value="godfellas">Godfellas</md-option>
                <md-option value="pulp-fiction">Pulp Fiction</md-option>
                <md-option value="scarface">Scarface</md-option>
              </md-select>
            </md-field>

          </div>

          <div class="md-layout-item md-size-50">

            <md-field md-clearable>
              <md-input placeholder="Search by name..."
                        v-model="search"
                        @input="searchOnTable" />
            </md-field>

          </div>
        </md-table-toolbar>

        <md-table-empty-state md-label="No Items found"></md-table-empty-state>

        <md-table-row slot="md-table-row"
                      slot-scope="{ item }">

          <md-table-cell md-label="Name"
                         md-sort-by="name">
          </md-table-cell>

        </md-table-row>


      </md-table> -->

      <table-component @filter="searchOnTable"
                       :searched="searched"
                       :groups="groups"
                       :contextId="contextId"></table-component>

    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary"
                 @click="closeDialog(false)">Close</md-button>
      <!-- <md-button class="md-primary"
                 @click="closeDialog(true)">Save</md-button> -->
    </md-dialog-actions>
  </md-dialog>

</template>

<script>
import { groupService, ROOMS_GROUP_CONTEXT } from "../js/service";
import tableComponent from "./tableComponent.vue";
import { Lst } from "spinal-core-connectorjs_type";
import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import geographicService from "spinal-env-viewer-context-geographic-service";

export default {
  name: "linkRoomDialog",
  props: ["onFinised"],
  components: {
    "table-component": tableComponent
  },
  data() {
    this.contextId = null;
    return {
      showDialog: true,
      inputValue: "",
      // search: null,
      searched: [],
      groups: [],
      elements: [],
      allData: []
    };
  },
  methods: {
    opened(option) {
      option.then(res => {
        if (res) {
          this.groups = new Lst(res.groups).get();
          this.elements = new Lst(res.elements).get();
          this.searched = new Lst(res.elements).get();
          this.contextId = res.contextId;

          this.allData = this.getList(this.groups, this.elements);
        }
      });
    },

    removed() {
      this.showDialog = false;
    },
    closeDialog(closeResult) {
      if (typeof this.onFinised === "function") {
        this.onFinised(closeResult);
      }
    },
    searchOnTable(params) {
      this.filterByFloor(params.floorsSelected).then(res => {
        if (params.search && params.search.trim().length > 0) {
          this.searched = res.filter(el => {
            return el.name.toLowerCase().includes(params.search.toLowerCase());
          });
        } else {
          this.searched = res;
        }
      });
    },

    filterByFloor(floorsIds) {
      if (floorsIds.length === 0) {
        return Promise.resolve(this.elements);
      } else {
        let promises = [];
        let contextType = SpinalGraphService.getInfo(this.contextId).type.get();

        let type =
          contextType === ROOMS_GROUP_CONTEXT
            ? geographicService.constants.ROOM_TYPE
            : geographicService.constants.EQUIPMENT_TYPE;

        for (let index = 0; index < floorsIds.length; index++) {
          const id = floorsIds[index];
          promises.push(
            SpinalGraphService.findNodes(
              id,
              geographicService.constants.GEOGRAPHIC_RELATIONS,
              node => {
                return node.info.type.get() === type;
              }
            )
          );
        }

        return Promise.all(promises).then(el => {
          let res = [];
          for (let found of el) {
            let foundInfo = found.map(x => x.info);
            res.push(...foundInfo);
          }
          return new Lst(res).get();
        });
      }
    },

    getList(groups, elements) {
      let res = [];

      elements.forEach(element => {
        let obj = [element.name];

        groups.forEach(async group => {
          obj.push(
            await groupService.elementIsLinkedToGroup(group.id, element.id)
          );
        });
        res.push(obj);
      });
      return res;
    }
  }
};
</script>

<style scoped>
.dialog {
  width: calc(80%);
  height: 60%;
}

.dialog .title {
  text-align: center;
  font-size: 18px;
}

.dialog .table {
  width: 100%;
  height: 100%;
}
</style>
