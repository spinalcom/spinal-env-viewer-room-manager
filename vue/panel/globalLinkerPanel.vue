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
  <!-- <md-dialog :md-active.sync="showDialog"
             @md-closed="closeDialog(false)"
             class="dialog">
    <md-dialog-title class="title">Link</md-dialog-title> -->

  <!-- <md-dialog-content class="dialogContainer"> -->
  <table-component @filter="searchOnTable"
                   :searched="searched"
                   :groups="groups"
                   :contextId="contextId"></table-component>

  <!-- </md-dialog-content> -->

  <!-- <md-dialog-actions>
    <md-button class="md-primary"
               @click="closeDialog(false)">Close</md-button>
  </md-dialog-actions>
  </md-dialog> -->

</template>

<script>
import { groupService } from "../../services/service";

import tableComponent from "../others/tableComponent.vue";
import { Lst } from "spinal-core-connectorjs_type";
import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import geographicService from "spinal-env-viewer-context-geographic-service";
import bimobjectservice from "spinal-env-viewer-plugin-bimobjectservice";

export default {
  name: "GlobalLinkerPanel",
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
      this.getData(option.nodeId, option.contextId).then(res => {
        if (res) {
          // console.log("res", res);

          this.groups = res.groups;
          this.elements = res.elements.slice(0, 10);
          this.searched = res.elements.slice(0, 10);
          // this.elements = res.elements;
          // this.searched = res.elements;
          this.contextId = res.contextId;
          // console.log("start");
          // this.allData = await this.getList(this.groups, this.elements);
          // console.log("end", this.allData);
        }
      });
    },

    // removed() {
    //   this.showDialog = false;
    // },
    // closeDialog(closeResult) {
    //   if (typeof this.onFinised === "function") {
    //     this.onFinised(closeResult);
    //   }
    // },
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
          contextType === groupService.constants.ROOMS_GROUP_CONTEXT
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

    // getList(groups, elements) {
    //   let res = elements.map(element => {
    //     let obj = [Promise.resolve(element.name)];

    //     const l = groups.map(group => {
    //       return groupService.elementIsLinkedToGroup(group.id, element.id);
    //     });

    //     return Promise.all(obj.concat(l));
    //   });
    //   return Promise.all(res);
    // },

    getData(nodeId, contextId) {
      const contextType = SpinalGraphService.getInfo(contextId).type.get();

      let selectedContextRelation = [
        groupService.constants.CATEGORY_TO_GROUP_RELATION,
        groupService.constants
      ];

      let refContextName =
        contextType === groupService.constants.ROOMS_GROUP_CONTEXT
          ? geographicService.constants.ROOM_REFERENCE_CONTEXT
          : bimobjectservice.constants.BIM_OBJECT_CONTEXT_TYPE;

      let refContextRelation =
        contextType === groupService.constants.ROOMS_GROUP_CONTEXT
          ? geographicService.constants.ROOM_RELATION
          : bimobjectservice.constants.BIM_OBJECT_RELATION_NAME;

      let context = SpinalGraphService.getContext(refContextName);

      return SpinalGraphService.findNodes(
        nodeId,
        selectedContextRelation,
        node => {
          let type = node.getType().get();
          return (
            type === groupService.constants.ROOMS_GROUP ||
            type === groupService.constants.EQUIPMENTS_GROUP
          );
        }
      ).then(async res => {
        return {
          contextId: contextId,
          groups: res.map(el => el.info.get()),
          elements: context
            ? await SpinalGraphService.getChildren(context.info.id.get(), [
                refContextRelation
              ]).then(el => {
                return el.map(x => x.get());
              })
            : []
        };
      });
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
