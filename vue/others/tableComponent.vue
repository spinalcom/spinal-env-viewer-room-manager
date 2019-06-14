
<template>
  <!-- v-model="searched" md-sort="name"
            md-sort-order="asc"
            md-fixed-header -->
  <md-table class="table"
            v-model="searched"
            md-sort="name"
            md-sort-order="asc"
            md-fixed-header>

    <md-table-toolbar class="md-layout md-gutter">
      <div class="md-layout-item md-size-50">

        <md-field>
          <label for="floors">Filter By Floor</label>
          <md-select v-model="filterParams.floorsSelected"
                     name="floors"
                     id="floors"
                     @md-closed="searchOnTable"
                     multiple>
            <md-option v-for="floor in allFloors"
                       :key="floor.id"
                       :value="floor.id">{{floor.name}}</md-option>

          </md-select>
        </md-field>

      </div>

      <div class="md-layout-item md-size-50">

        <md-field md-clearable>
          <md-input placeholder="Search by name..."
                    v-model="filterParams.search"
                    @input="searchOnTable" />
        </md-field>

      </div>
    </md-table-toolbar>

    <md-table-empty-state md-label="No Items found"></md-table-empty-state>

    <md-table-row slot="md-table-row"
                  slot-scope="{item}">
      <!-- <md-table-row slot="md-table-row"
                  v-for="item in searched"> -->
      <md-table-cell md-label="Name"
                     md-sort-by="name">{{item.name}}</md-table-cell>

      <md-table-cell v-for="group in groups"
                     :key="group.id"
                     :md-label="group.name">

        <checkbox-component :groupId="group.id"
                            :elementId="item.id"
                            :contextId="contextId"></checkbox-component>

      </md-table-cell>

    </md-table-row>

  </md-table>
</template>


<script>
import checkboxComponent from "./checkBoxComponent.vue";
import geographicService from "spinal-env-viewer-context-geographic-service";
import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import { Lst } from "spinal-core-connectorjs_type";

export default {
  name: "tableComponent",
  components: {
    "checkbox-component": checkboxComponent
  },
  props: ["searched", "groups", "contextId"],
  data() {
    this.allFloors = [];
    return {
      filterParams: {
        search: null,
        floorsSelected: []
      }
    };
  },
  mounted() {
    let context = SpinalGraphService.getContext(
      geographicService.constants.FLOOR_REFERENCE_CONTEXT
    );

    if (context) {
      SpinalGraphService.getChildren(context.info.id.get(), [
        geographicService.constants.FLOOR_RELATION
      ]).then(res => {
        this.allFloors = new Lst(res).get();
      });
    }
  },
  methods: {
    searchOnTable() {
      this.$emit("filter", this.filterParams);
    }
  },
  watch: {
    filterParams(newValue) {
      this.$emit("filter", newValue);
    }
  }
};
</script>