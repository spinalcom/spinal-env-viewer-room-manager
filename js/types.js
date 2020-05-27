import geographicService from "spinal-env-viewer-context-geographic-service";
import {
  SpinalBmsEndpoint
} from "spinal-model-bmsnetwork";

export default [{
    name: "Rooms Group",
    type: geographicService.constants.ROOM_TYPE,
  },
  {
    name: "Equipments Group",
    type: geographicService.constants.EQUIPMENT_TYPE,
  },
  {
    name: "Endpoint Group",
    type: SpinalBmsEndpoint.nodeTypeName,
  },
];