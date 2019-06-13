
<template>
  <!-- <div> -->
  <!-- <div class="header">
      <div class="md-subheading">Select Icon</div>
      <div class="select">
        <md-field>
          <label for="category">Category</label>
          <md-select v-model="categorySelected"
                     @md-selected="filterIcons"
                     name="category"
                     id="category"
                     md-dense>

            <md-option>All</md-option>
            <md-option v-for="(category, index) in categories"
                       :key="index"
                       :value="category">{{category}}</md-option>

          </md-select>
        </md-field>
      </div>
    </div> -->

  <md-content class="_container md-scrollbar">
    <div v-for="(res,index) in iconsDisplayed"
         :key="index"
         class="iconsContainer">
      <!-- <div class="subHeader">{{res.name}}</div> -->
      <div class="icons">
        <div class="icon"
             v-for="(icon,index2) in res"
             :key="index2">
          <md-icon>{{icon}}</md-icon>
        </div>
      </div>
    </div>

  </md-content>

  <!-- </div> -->
</template>

<script>
import * as allIcons from "../../js/materialIcons.json";

export default {
  name: "iconComponent",
  data() {
    this.allIcons = Object.keys(allIcons);
    // this.categories = this.getAllCategories();

    return {
      iconsDisplayed: Object.keys(allIcons),
      iconSelected: null
      //   categorySelected: undefined
    };
  },
  methods: {
    // filterIcons() {
    //   this.iconsDisplayed = this.getIconsByCategory(this.categorySelected);
    // },
    // getAllCategories() {
    //   console.log("allIcons", allIcons, "this.allIcons", this.allIcons);
    //   return this.allIcons.map(el => el.name);
    // },
    // getIconsByCategory(categoryName) {
    //   if (typeof categoryName !== "undefined") {
    //     let category = this.allIcons.find(el => el.name === categoryName);
    //     if (typeof category !== "undefined") {
    //       return [category];
    //     }
    //   } else {
    //     return this.allIcons;
    //   }
    //   return [];
    // }
  }
};
</script>

<style scoped>
._container {
  width: 500px;
  /* height: 500vh; */
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.iconsContainer {
  /* display: flex; */
  flex-direction: column;
}

.subHeader {
  display: block;
  margin-bottom: 10px;
}

.icons {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.icon {
  padding: 3px;
  margin: 5px;
}
</style>
