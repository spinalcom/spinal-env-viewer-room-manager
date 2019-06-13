<template>
  <div class="buscar-caja">

    <md-menu md-direction="bottom-start">

      <a class="md-icon-button buscar-btn"
         md-menu-trigger>
        <md-icon>filter_list</md-icon>
      </a>

      <md-menu-content>
        <md-menu-item>My Item 1</md-menu-item>
        <md-menu-item>My Item 2</md-menu-item>
        <md-menu-item>My Item 3</md-menu-item>
      </md-menu-content>

    </md-menu>

  </div>
</template>


<script>
export default {
  name: "filterMenu",
  data() {
    return {};
  },
  methods: {}
};
</script>