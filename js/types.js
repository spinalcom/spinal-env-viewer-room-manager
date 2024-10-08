import { CONTEXT_TYPE, SITE_TYPE, BUILDING_TYPE, FLOOR_TYPE, ZONE_TYPE, ROOM_TYPE, EQUIPMENT_TYPE } from "spinal-env-viewer-context-geographic-service/build/constants";
import { SpinalBmsEndpoint, SpinalBmsDevice, SpinalBmsNetwork, SpinalBmsEndpointGroup } from "spinal-model-bmsnetwork";
import { NOTE_TYPE } from 'spinal-env-viewer-plugin-documentation-service/dist/Models/constants'
import { EVENT_TYPE } from "spinal-env-viewer-task-service";
import { spinalControlPointService } from 'spinal-env-viewer-plugin-control-endpoint-service';
// import { spinalAnalyticService } from "spinal-env-viewer-plugin-analytics-service";

export default [{
  name: "Geographic Context Group",
  type: CONTEXT_TYPE
},
{
  name: "Site Group",
  type: SITE_TYPE
},
{
  name: "Building Group",
  type: BUILDING_TYPE
},
{
  name: "Floor Group",
  type: FLOOR_TYPE
},
{
  name: "Zone Group",
  type: ZONE_TYPE
},
{
  name: "Rooms Group",
  type: ROOM_TYPE,
},
{
  name: "Equipments Group",
  type: EQUIPMENT_TYPE,
},
{
  name: "Endpoint Group",
  type: SpinalBmsEndpoint.nodeTypeName,
},
{
  name: "Device Group",
  type: SpinalBmsDevice.nodeTypeName
},
{
  name: "Network Group",
  type: SpinalBmsNetwork.nodeTypeName
},
{
  name: "EndpointGroup Group",
  type: SpinalBmsEndpointGroup.nodeTypeName
},
{
  name: "Note Group",
  type: NOTE_TYPE
},
{
  name: "Agenda Group",
  type: EVENT_TYPE
},
{
  name: "Control Points group",
  type: spinalControlPointService.CONTROL_POINT_TYPE
},
{
  name: "Analytics group",
  type: "Analytic"// spinalAnalyticService.nodeType
}
];