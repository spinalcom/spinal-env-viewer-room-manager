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
   <md-dialog
      class="mdDialogContainer"
      :md-active.sync="showDialog"
      @md-closed="closeDialog(false)"
   >
      <md-dialog-title class="dialogTitle">Manage {{type}} Group</md-dialog-title>
      <md-dialog-content class="content">

         <div class="section">
            <link-template
               :title="'Contexts'"
               :data="data"
               :itemSelected="contextSelected"
               @create="createContext"
               @select="selectContext"
            ></link-template>
         </div>

         <div class="section">
            <link-template
               :title="'Categories'"
               :data="categories"
               :itemSelected="categorySelected"
               @create="createCategory"
               @select="selectCategory"
               :disableBtn="!contextSelected"
            ></link-template>

         </div>

         <div class="section">
            <link-template
               :title="'Groups'"
               :data="groups"
               :itemSelected="groupSelected"
               @create="createGroup"
               @select="selectGroup"
               :disableBtn="!categorySelected"
            ></link-template>
         </div>
      </md-dialog-content>
      <md-dialog-actions>
         <md-button
            class="md-primary"
            @click="closeDialog(false)"
         >Close</md-button>
         <md-button
            class="md-primary"
            :disabled="disabled()"
            @click="closeDialog(true)"
         >Save</md-button>
      </md-dialog-actions>
   </md-dialog>

</template>

<script>
import attributeService from "spinal-env-viewer-plugin-attribute-manager/src/services/index";

import { spinalPanelManagerService } from "spinal-env-viewer-panel-manager-service";
import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import EventBus from "spinal-env-viewer-room-manager/js/event";

import LinkToGroupTemplate from "./linkToGroupTemplate.vue";
import obj from "spinal-model-bmsnetwork/dist/SpinalBms";

export default {
   name: "dialogComponent",
   components: {
      "link-template": LinkToGroupTemplate,
   },
   props: ["onFinised"],
   data() {
      return {
         showDialog: true,
         data: [],
         groups: [],
         categories: [],
         contextSelected: undefined,
         categorySelected: undefined,
         groupSelected: undefined,
         items: [],
         type: undefined,
         callback: undefined,
      };
   },

   mounted() {
      // EventBus.$on("itemCreated", (id) => {
      //    console.log("hello world", id);
      //    this.getAllData();
      // });
   },

   methods: {
      opened(option) {
         this.items = option.itemSelected;
         this.type = option.type;
         this.callback = option.callback;

         this.getAllData();
      },

      removed(option) {
         if (option) {
            this.items.forEach((el) => {
               attributeService.linkItem(
                  this.contextSelected,
                  this.groupSelected,
                  el.id
               );
            });

            if (typeof this.callback !== "undefined") {
               const context = this.data.find(
                  (el) => el.id === this.contextSelected
               );
               const category = this.categories.find(
                  (el) => el.id === this.categorySelected
               );
               const group = this.groups.find(
                  (el) => el.id === this.groupSelected
               );

               this.callback(context, category, group);
            }
         }
         this.showDialog = false;
      },

      closeDialog(closeResult) {
         if (typeof this.onFinised === "function") {
            this.onFinised(closeResult);
         }
      },

      getAllData() {
         attributeService.getAllGroupContext(this.type).then((res) => {
            this.data = res;
            this.updateCategory();
            this.updateGroups();
         });
      },
      // getCategories() {
      //   this.categorySelected = undefined;

      //   if (this.contextSelected) {
      //     let val = this.data.find(el => el.id === this.contextSelected);
      //     if (val) return val.category;
      //   }
      //   return [];
      // },
      getGroups() {
         this.groupSelected = undefined;

         if (this.contextSelected && this.categorySelected) {
            let context = this.data.find(
               (el) => el.id === this.contextSelected
            );
            if (context) {
               let category = context.category.find(
                  (el) => el.id == this.categorySelected
               );

               if (category) return category.groups;
            }
         }
         return [];
      },

      disabled() {
         return !(
            this.contextSelected &&
            this.categorySelected &&
            this.groupSelected
         );
      },

      createContext() {
         spinalPanelManagerService.openPanel("createGroupContextDialog", {
            title: "Create a Grouping Context",
            typePreselected: this.type,
            callback: (id) => {
               const infoModel = SpinalGraphService.getInfo(id);
               if (infoModel) {
                  const info = infoModel.get();
                  info.category = [];

                  this.data = [...this.data, info];
                  this.contextSelected = id;
               }
            },
         });
      },

      createCategory() {
         spinalPanelManagerService.openPanel("createCategoryDialog", {
            title: "add Category",
            contextId: this.contextSelected,
            selectedNode: SpinalGraphService.getInfo(this.contextSelected),
            callback: (id) => {
               const infoModel = SpinalGraphService.getInfo(id);
               if (infoModel) {
                  const info = infoModel.get();
                  info.groups = [];
                  this._addToCategory(info);
                  // this.categories = [...this.categories, info];
                  this.categorySelected = id;
               }
            },
         });
      },

      createGroup() {
         spinalPanelManagerService.openPanel("createGroupDialog", {
            title: "add Group",
            contextId: this.contextSelected,
            selectedNode: SpinalGraphService.getInfo(this.categorySelected),
            callback: (id) => {
               const infoModel = SpinalGraphService.getInfo(id);
               if (infoModel) {
                  const info = infoModel.get();
                  this._addToGroups(info);
                  // this.groups = [...this.groups, info];
                  this.groupSelected = id;
               }
            },
         });
      },

      //////////////////////////////////////////////////////////////////
      // Modify
      //////////////////////////////////////////////////////////////////

      updateCategory() {
         // this.categorySelected = undefined;
         this.categories = [];
         if (this.contextSelected) {
            let val = this.data.find((el) => el.id === this.contextSelected);
            if (val) this.categories = val.category;
         }
      },

      updateGroups() {
         // this.groupSelected = undefined;
         this.groups = [];
         if (this.contextSelected && this.categorySelected) {
            let context = this.data.find(
               (el) => el.id === this.contextSelected
            );
            if (context) {
               let category = context.category.find(
                  (el) => el.id == this.categorySelected
               );

               if (category) this.groups = category.groups;
            }
         }
      },

      selectContext(id) {
         if (this.contextSelected === id) {
            this.contextSelected = undefined;
            return;
         }
         this.contextSelected = id;
      },

      selectCategory(id) {
         if (this.categorySelected === id) {
            this.categorySelected = undefined;
            return;
         }
         this.categorySelected = id;
      },

      selectGroup(id) {
         if (this.groupSelected === id) {
            this.groupSelected = undefined;
            return;
         }
         this.groupSelected = id;
      },

      _addToCategory(obj) {
         if (this.contextSelected) {
            let val = this.data.find((el) => el.id === this.contextSelected);
            if (val) val.category.push(obj);
         }
      },

      _addToGroups(obj) {
         if (this.contextSelected && this.categorySelected) {
            let context = this.data.find(
               (el) => el.id === this.contextSelected
            );
            if (context) {
               let category = context.category.find(
                  (el) => el.id == this.categorySelected
               );

               if (category) category.groups.push(obj);
            }
         }
      },
   },
   watch: {
      contextSelected() {
         this.categorySelected = undefined;
         this.groupSelected = undefined;

         this.updateCategory();
         this.updateGroups();
      },

      categorySelected() {
         this.groupSelected = undefined;

         this.updateGroups();
      },
   },
};
</script>

<style scoped>
.mdDialogContainer {
   width: 60%;
   height: 600px;
}

.mdDialogContainer .dialogTitle {
   text-align: center;
}

.mdDialogContainer .content {
   display: flex;
   justify-content: space-between;
   align-items: stretch;
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

<style>
.mdDialogContainer .md-dialog-container {
   max-width: 100%;
   max-height: 100%;
}
</style>