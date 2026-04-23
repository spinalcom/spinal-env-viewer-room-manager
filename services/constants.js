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

module.exports = new GroupServiceConstants();