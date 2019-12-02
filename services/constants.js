// ////////////////////////////////////////////////////
// // ROOMS
// ////////////////////////////////////////////////////
// const ROOMS_GROUP_CONTEXT = "RoomsGroupContext";
// const ROOMS_GROUP = "RoomsGroup";
// const ROOMS_GROUP_RELATION = "hasRoomsGroup";
// const ROOMS_TO_ELEMENT_RELATION = "groupHasRooms";
// const ROOMS_CATEGORY = "Rooms_category";
// const ROOMS_CATEGORY_RELATION = "hasRoomsCategory";



// ///////////////////////////////////////////////////////
// // BimObject
// ///////////////////////////////////////////////////////
// const EQUIPMENTS_GROUP_CONTEXT = "EquipmentGroupContext";
// const EQUIPMENTS_GROUP = "EquipmentGroup";
// const EQUIPMENTS_GROUP_RELATION = "hasEquipmentsGroup";
// const EQUIPMENTS_TO_ELEMENT_RELATION = "groupHasEquipments";
// const EQUIPMENTS_CATEGORY = "Equipment_category";
// const EQUIPMENTS_CATEGORY_RELATION = "hasEquipmentsCategory";



// const typeLst = [
//   ROOMS_GROUP_CONTEXT,
//   ROOMS_GROUP,
//   ROOMS_CATEGORY,
//   EQUIPMENTS_GROUP_CONTEXT,
//   EQUIPMENTS_GROUP,
//   EQUIPMENTS_CATEGORY
// ]



// const TYPE_AND_RELATION = new Map();
// TYPE_AND_RELATION.set(ROOMS_GROUP_CONTEXT, ROOMS_CATEGORY_RELATION)
// TYPE_AND_RELATION.set(ROOMS_GROUP, ROOMS_TO_ELEMENT_RELATION)
// TYPE_AND_RELATION.set(ROOMS_CATEGORY, ROOMS_GROUP_RELATION)
// TYPE_AND_RELATION.set(EQUIPMENTS_GROUP_CONTEXT, EQUIPMENTS_CATEGORY_RELATION)
// TYPE_AND_RELATION.set(EQUIPMENTS_GROUP, EQUIPMENTS_TO_ELEMENT_RELATION)
// TYPE_AND_RELATION.set(EQUIPMENTS_CATEGORY, EQUIPMENTS_GROUP_RELATION)

// const CONTEXT_TYPE = "groupingContext";
// const CATEGORY_TYPE = "groupingCategory";

// ///////////////////////////////////////////
// //            Groups Types               //
// ///////////////////////////////////////////
// const ROOMS_GROUP = "roomsGroup";
// const EQUIPMENTS_GROUP = "equipmentGroup";
// const ENDPOINT_GROUP = "endpointGroup"

// ///////////////////////////////////////////
// //            Relations                  //
// ///////////////////////////////////////////

// const CONTEXT_TO_CATEGORY_RELATION = "hasCategory";
// const CATEGORY_TO_GROUP_RELATION = "hasGroup";
// const GROUP_TO_ROOMS_RELATION = "groupHasRooms";
// const GROUP_TO_EQUIPMENTS_RELATION = "groupHasEquipments";
// const GROUP_TO_ENDPOINT_RELATION = "groupHasEndpoints";



class GroupServiceConstants {
  constructor() {
    ///////////////////////////////////////
    // CONTEXT
    ///////////////////////////////////////
    this.ROOMS_GROUP_CONTEXT = "RoomsGroupContext";
    this.EQUIPMENTS_GROUP_CONTEXT = "EquipmentGroupContext";
    this.ENDPOINTS_GROUP_CONTEXT = "EndpointGroupContext";

    this.CONTEXTS_TYPES = [
      this.ROOMS_GROUP_CONTEXT,
      this.EQUIPMENTS_GROUP_CONTEXT,
      this.ENDPOINTS_GROUP_CONTEXT
    ];

    //Category

    this.CATEGORY_TYPE = "groupingCategory";

    ///////////////////////////////////////////
    //            Groups Types               //
    ///////////////////////////////////////////
    this.ROOMS_GROUP = "roomsGroup";
    this.EQUIPMENTS_GROUP = "equipmentGroup";
    this.ENDPOINT_GROUP = "endpointGroup";

    this.GROUPS_TYPES = [
      this.ROOMS_GROUP,
      this.EQUIPMENTS_GROUP,
      this.ENDPOINT_GROUP
    ];

    ///////////////////////////////////////////
    //            Relations                  //
    ///////////////////////////////////////////

    this.CONTEXT_TO_CATEGORY_RELATION = "hasCategory";
    this.CATEGORY_TO_GROUP_RELATION = "hasGroup";
    this.GROUP_TO_ROOMS_RELATION = "groupHasRooms";
    this.GROUP_TO_EQUIPMENTS_RELATION = "groupHasEquipments";
    this.GROUP_TO_ENDPOINT_RELATION = "groupHasEndpoints";

    ////////////////////////////////////////////
    // Maps
    ////////////////////////////////////////////

    this.CONTEXT_GROUP_ASSOCIATION = new Map([
      [this.ROOMS_GROUP_CONTEXT, this.ROOMS_GROUP],
      [this.EQUIPMENTS_GROUP_CONTEXT, this.EQUIPMENTS_GROUP],
      [this.ENDPOINTS_GROUP_CONTEXT, this.ENDPOINT_GROUP]
    ]);

    this.GROUP_RELATION_ASSOCIATION = new Map([
      [this.ROOMS_GROUP, this.GROUP_TO_ROOMS_RELATION],
      [this.EQUIPMENTS_GROUP, this
        .GROUP_TO_EQUIPMENTS_RELATION
      ],
      [this.ENDPOINT_GROUP, this.GROUP_TO_ENDPOINT_RELATION]

    ])
  }

}

export default new GroupServiceConstants();