import "./js/registerDialogs";
import "./js/event";

import ContextGroupBtn from "./buttons/createContextGroup";
import CreateElement from "./buttons/createElement";
// import DisplayBimObjects from "./buttons/displayBimObject";
import ColorConfig from './buttons/colorConfig';
import LinkRooms from "./buttons/linkRooms";
import AddToReference from "./buttons/addToReferenceContext";
import ViewChildren from "./buttons/viewBtn";


import {
  spinalContextMenuService
} from "spinal-env-viewer-context-menu-service";

const SIDEBAR = "GraphManagerSideBar";
const HEADERBAR = "GraphManagerTopBar";


spinalContextMenuService.registerApp(HEADERBAR, new ContextGroupBtn());
spinalContextMenuService.registerApp(SIDEBAR, new CreateElement());
spinalContextMenuService.registerApp(SIDEBAR, new ViewChildren());
spinalContextMenuService.registerApp(SIDEBAR, new ColorConfig());
spinalContextMenuService.registerApp(SIDEBAR, new LinkRooms());
spinalContextMenuService.registerApp(SIDEBAR, new AddToReference());