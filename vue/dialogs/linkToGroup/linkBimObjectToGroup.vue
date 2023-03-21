<!--
Copyright 2023 SpinalCom - www.spinalcom.com

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
  <md-dialog class="mdDialogContainer"
             :md-active.sync="showDialog"
             @md-closed="closeDialog(false)">
    <md-dialog-title class="dialogTitle">Add bimObject(s) selected to
      group</md-dialog-title>

    <md-dialog-content class="content">
      <div v-show="state === states.normal">
        Do you really want to link {{ selections |  length}} bimObject(s) to the
        group ?
      </div>

      <div v-show="state === states.loading">
        <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
      </div>

      <div v-show="state === states.result"
           class="result">
        <div>linked with success: <span class="success"> {{ linked }}</span>
        </div>
        <div>link failed : <span class="error">{{ notLinked }}</span></div>
      </div>

    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary"
                 :disabled="cancelDisabled()"
                 @click="closeDialog(false)">Close</md-button>
      <md-button class="md-primary"
                 :disabled="yesDisabled()"
                 @click="addBimObject">Yes</md-button>
    </md-dialog-actions>
  </md-dialog>
</template>


<script>
import { bimObjectManagerService } from "spinal-env-viewer-bim-manager-service";
import utilities from "../../../js/utilities";
import { groupManagerService } from "spinal-env-viewer-plugin-group-manager-service";

export default {
  name: "addBimObjectToGroupDialog",
  props: ["onFinised"],

  data() {
    this.states = {
      normal: 0,
      loading: 1,
      result: 2,
    };
    return {
      showDialog: false,
      selections: [],
      state: this.states.loading,
      contextId: null,
      nodeId: null,
      linked: 0,
      notLinked: 0,
    };
  },

  mounted() {
    // EventBus.$on("itemCreated", (id) => {
    //    console.log("hello world", id);
    //    this.getAllData();
    // });
  },
  filters: {
    length(items) {
      return items.reduce((count, { selection }) => {
        count += selection.length;
        return count;
      }, 0);
    },
  },

  methods: {
    async opened({ contextId, nodeId }) {
      this.contextId = contextId;
      this.nodeId = nodeId;

      const selections = this.getObjectSelected();
      if (!selections) return alert("No BimObject selected");

      this.state = this.states.loading;
      this.showDialog = true;

      this.selections = await this.getLeaftSelections(selections);
      this.state = this.states.normal;
    },

    async removed(option) {
      this.showDialog = false;
    },

    closeDialog(closeResult) {
      if (typeof this.onFinised === "function") {
        this.onFinised(closeResult);
      }
    },

    cancelDisabled() {
      return this.state === this.states.loading;
    },

    yesDisabled() {
      return this.state !== this.states.normal;
    },

    getObjectSelected() {
      let selections = window.spinal.ForgeViewer.viewer.getAggregateSelection();
      if (selections.length === 0) return;

      return selections;
    },

    getLeaftSelections(selections) {
      const promises = selections.map((el) => {
        return bimObjectManagerService.getLeafDbIds(el.model, el.selection);
      });

      return Promise.all(promises);
    },

    async addBimObject() {
      try {
        this.state = this.states.loading;

        const arr = this.convertSelectionsToFuncList(
          this.contextId,
          this.nodeId,
          this.selections
        );
        const { successed, failed } = await utilities.consumeBatch(arr);

        this.linked = successed.length;
        this.notLinked = failed.length;

        this.state = this.states.result;
      } catch (error) {
        console.error(error);
        throw error;
      }

      //   Promise.all(selections).then((selected) => {
      //     for (let idx = 0; idx < selected.length; idx++) {
      //       const { model, selection } = selected[idx];

      //       model.getBulkProperties(
      //         selection,
      //         {
      //           propFilter: ["name"],
      //         },
      //         (el) => {
      //           el.forEach((element) => {
      //             window.spinal.BimObjectService.createBIMObject(
      //               element.dbId,
      //               element.name,
      //               model
      //             ).then(() => {
      //               window.spinal.BimObjectService.getBIMObject(
      //                 element.dbId,
      //                 model
      //               ).then((bimObject) => {
      //                 if (bimObject) {
      //                   const bimId = bimObject.id
      //                     ? bimObject.id.get()
      //                     : bimObject.info.id.get();

      //                   groupManagerService.linkElementToGroup(
      //                     contextId,
      //                     groupId,
      //                     bimId
      //                   );
      //                 }
      //               });
      //             });
      //           });
      //         }
      //       );
      //     }
      //   });
    },

    async getBimObjectNode(model, dbId) {
      try {
        const name = await this.getObjectName(model, dbId);
        return spinal.BimObjectService.createBIMObject(dbId, name, model);
      } catch (error) {
        console.error("error", model.id, dbId);
        throw error;
      }
    },

    async addNodeToGroup(contextId, groupId, model, dbId) {
      const node = await this.getBimObjectNode(model, dbId);

      return groupManagerService.linkElementToGroup(
        contextId,
        groupId,
        node.id.get()
      );
    },

    getObjectName(model, dbId) {
      return new Promise((resolve, reject) => {
        model.getBulkProperties([dbId], { propFilter: ["name"] }, (el) => {
          resolve(el[0].name);
        });
      });
    },

    convertSelectionsToFuncList(contextId, groupId, liste) {
      return liste.reduce((arr, { model, selection }) => {
        for (const id of selection) {
          arr.push(() => this.addNodeToGroup(contextId, groupId, model, id));
        }
        return arr;
      }, []);
    },
  },
};
</script>

<style scoped>
.mdDialogContainer {
  width: 400px;
  height: 300px;
}

.mdDialogContainer .dialogTitle {
  text-align: center;
}

.mdDialogContainer .content {
  display: flex;
  justify-content: center;
  align-items: center;
}

.mdDialogContainer .content .result {
  font-size: 1.4em !important;
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.mdDialogContainer .content .result .success {
  color: green;
}

.mdDialogContainer .content .result .error {
  color: red;
}

.mdDialogContainer .content .section {
  width: 33%;
  border: 1px solid grey;
  border-radius: 4% 4% 0 0;
  padding: 15px;
}

/* .mdIcon {
  display: flex;
  align-items: center;
} */
</style>

