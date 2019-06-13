<template>
  <div class="_container md-layout md-gutter">
    <div class="previousContainer">Previous</div>
    <div class="currentPageContainer">Current</div>
    <div class="nextContainer">Next</div>
  </div>
</template>

<script>
export default {
  name: "paginationComponent",
  data() {
    return {};
  },
  methods: {}
};
</script>

<style scoped>
._container {
  width: 100%;
  height: 40px;
  background: red;
  display: flex;
  flex-direction: row;
}

.previousContainer,
.currentPageContainer,
.nextContainer {
  display: inline;
}

.previousContainer {
  align-self: flex-start;
}

.currentPageContainer {
  align-self: center;
}

.nextContainer {
  align-self: flex-end;
}
</style>
