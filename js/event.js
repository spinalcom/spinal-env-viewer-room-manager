import Vue from 'vue';
import utilities from "./utilities";


const EventBus = new Vue();

EventBus.$on("mouseover", (item) => {
  utilities.getBimObjects(item.id).then(res => {
    // console.log("res", res)
    // window.spinal.ForgeViewer.viewer.select(res.map(el => el.dbid
    //   .get()));

    let selections = [];

    res.forEach(el => {
      let info = el.get();
      let model = window.spinal.BimObjectService.getModelByBimfile(
        info.bimFileId);

      let selected = selections.find(el2 => {
        return el2.model.id === model.id
      });

      if (selected) {
        selected.ids.push(el.dbid);
      } else {
        selections.push({
          model: model,
          ids: [info.dbid]
        })
      }


    })

    window.spinal.ForgeViewer.viewer.impl.selector
      .setAggregateSelection(selections);

  })
})

EventBus.$on("mouseleave", () => {
  window.spinal.ForgeViewer.viewer.select();
})

export default EventBus;