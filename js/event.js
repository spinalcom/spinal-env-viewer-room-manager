import Vue from 'vue';
import utilities from "./utilities";


const EventBus = new Vue();

EventBus.$on("mouseover", (item) => {
  utilities.getBimObjects(item.id).then(res => {
    console.log("res", res)
    window.spinal.ForgeViewer.viewer.select(res.map(el => el.dbid
      .get()));
  })
})

EventBus.$on("mouseleave", () => {
  window.spinal.ForgeViewer.viewer.select();
})

export default EventBus;