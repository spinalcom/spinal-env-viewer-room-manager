import "./js/registerDialogs";
import "./js/event";

import ContextGroupBtn from "./buttons/createContextGroup";
import CreateElement from "./buttons/createElement";
// import DisplayBimObjects from "./buttons/displayBimObject";
import Edit from './buttons/edit';
import LinkRooms from "./buttons/linkRooms";
// import AddToReference from "./buttons/addToReferenceContext";
import ViewChildren from "./buttons/viewBtn";

import FindRoom from "./buttons/findBimRoom";

import {
  spinalContextMenuService
} from "spinal-env-viewer-context-menu-service";


const SIDEBAR = "GraphManagerSideBar";
const HEADERBAR = "GraphManagerTopBar";
const CIRCULARMENU = 'circularMenu';



spinalContextMenuService.registerApp(HEADERBAR, new ContextGroupBtn(), [3]);
spinalContextMenuService.registerApp(SIDEBAR, new CreateElement(), [3]);
spinalContextMenuService.registerApp(SIDEBAR, new ViewChildren(), [31]);
spinalContextMenuService.registerApp(SIDEBAR, new Edit(), [3]);
spinalContextMenuService.registerApp(SIDEBAR, new LinkRooms(), [3]);
spinalContextMenuService.registerApp(CIRCULARMENU, new FindRoom(), [3]);
// spinalContextMenuService.registerApp(SIDEBAR, new AddToReference());



/////////////////////////////////////////////////////////////////////////////////////////////////
//                                     TESTS                                                   //
/////////////////////////////////////////////////////////////////////////////////////////////////

// import {
//   bimObjectManagerService
// } from "../spinal-env-viewer-bim-manager-service";

// import AddBtnFunction from "../spinal-env-viewer-plugin-filter";

// window.tests = {
//   bimObjectManagerService: bimObjectManagerService,
// }


// document.onreadystatechange = () => {
//   console.log("state", document.readyState)
//   if (document.readyState === 'complete') {
//     AddBtnFunction();
//   }
// }