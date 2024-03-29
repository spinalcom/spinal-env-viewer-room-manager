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

  <div>
    <md-autocomplete v-model="iconSelected"
                     :md-options="icons"
                     @md-changed="getIcons"
                     @md-opened="getIcons">
      <label>Icon</label>
      <template slot="md-autocomplete-item"
                slot-scope="{ item }">
        <div>
          <md-icon>{{ item }}</md-icon>
          &nbsp; &nbsp;
          {{ item }}
        </div>
      </template>
    </md-autocomplete>
  </div>

  <!-- <div class="myiconDiv">
    <div class="header">
      <div class="md-subheading">Select Icon</div>
      <div class="select">
        <md-field>
          <label for="category">Category</label>

          <md-select v-model="categorySelected"
                     name="category"
                     id="category"
                     md-dense>
            <md-option value="none">All</md-option>
            <md-option v-for="(category, index) in categories"
                       :key="index"
                       :value="category">{{ category }}</md-option>
          </md-select>
        </md-field>
      </div>
    </div>

    <md-content class="_container md-scrollbar">
      <div v-for="(res, index) in iconsDisplayed"
           :key="index"
           class="iconsContainer">
        <div class="subHeader">{{ res.name }}</div>
        <div class="icons">
          <div class="icon"
               v-for="(icon, index2) in res.icons"
               :key="index2"
               @click="selectIcon(icon.id)"
               :class="{ selectedIcon: isSelected(icon.id) }">
            <md-icon>{{ icon.id }}</md-icon>
          </div>
        </div>
      </div>
    </md-content>
  </div> -->
</template>

<script>
import allIcons from "../../../js/icons.json";

export default {
  name: "iconComponent",
  props: {
    selected: {
      type: String,
    },
  },
  data() {
    this.allIcons = Object.values(allIcons);
    this.categories = this.getAllCategories();
    return {
      iconsDisplayed: Object.values(allIcons),
      iconSelected: null,
      categorySelected: "none",
      icons: [],
    };
  },
  mounted() {
    if (typeof this.selected !== "undefined") {
      this.iconSelected = this.selected;
    }
  },
  methods: {
    filterIcons() {
      let category =
        this.categorySelected !== "none" ? this.categorySelected : undefined;
      this.iconsDisplayed = this.getIconsByCategory(category);
    },
    getAllCategories() {
      return this.allIcons.map((el) => el.name);
    },

    getIconsByCategory(categoryName) {
      if (typeof categoryName !== "undefined") {
        let category = this.allIcons.find((el) => el.name === categoryName);
        if (typeof category !== "undefined") {
          return [category];
        }
      } else {
        return this.allIcons;
      }

      return [];
    },

    selectIcon(icon) {
      this.iconSelected = icon;
      this.$emit("selectIcon", icon);
    },

    isSelected(icon) {
      return this.iconSelected === icon;
    },

    getIcons(searchTerm) {
      this.icons = new Promise((resolve) => {
        setTimeout(() => {
          let icons = this.iconsNames();
          if (!searchTerm) {
            resolve(icons);
          } else {
            const term = searchTerm.toLowerCase();

            resolve(icons.filter((el) => el.toLowerCase().includes(term)));
          }
        }, 500);
      });
    },

    iconsNames() {
      if (!this.allIcons) return [];
      return this.allIcons.reduce((arr, item) => {
        arr.push(...item.icons.map((el) => el.id));
        return arr;
      }, []);
    },
  },

  watch: {
    categorySelected: function () {
      this.filterIcons();
    },
    selected() {
      this.iconSelected = this.selected;
    },
  },
};
</script>

<style scoped>
.myiconDiv {
  width: 500px;
  height: 100%;
}

.myiconDiv .header {
  width: 100%;
  height: 80px;
}

.myiconDiv ._container {
  width: 99%;
  height: calc(100% - 70px);
  overflow: auto;
  overflow-x: hidden;
  display: flex;
  margin-bottom: 10px;
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

.selectedIcon {
  border: 1px solid blue;
}
</style>
