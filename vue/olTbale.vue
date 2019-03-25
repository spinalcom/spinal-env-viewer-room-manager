<template>
  <div>
    <md-table-empty-state md-label="No Items found">
    </md-table-empty-state>

    <md-table-row slot="md-table-row"
                  slot-scope="{ item }">

      <md-table-cell md-label="Name"
                     md-sort-by="name">
        {{item.name}}
      </md-table-cell>

      <md-table-cell v-for="group in groups"
                     :key="group.id"
                     :md-label="group.name">

        <!-- :value="areLinked(item.id, group.id)" -->
        <md-checkbox class="md-primary"
                     :value="areLinked(item.id, group.id)"
                     @change="linkElements(group.id,
                         item.id)"></md-checkbox>

      </md-table-cell>

    </md-table-row>
  </div>
</template>