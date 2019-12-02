import geographicService from "spinal-env-viewer-context-geographic-service";
import {
  SpinalGraphService
} from "spinal-env-viewer-graph-service";
import {
  ROOMS_GROUP,
  EQUIPMENTS_GROUP,
  EQUIPMENTS_TO_ELEMENT_RELATION,
  ROOMS_TO_ELEMENT_RELATION,
  ROOMS_GROUP_CONTEXT,
  ROOMS_GROUP_RELATION,
  EQUIPMENTS_GROUP_RELATION
} from "../services/service";

let ItemsColoredMap = new Map();
let BimElementsColor = new Map();

let utilities = {
  colorElement(node, isColored) {
    let id = node.id.get();

    return this.getNodesToColor(node).then(res => {
      res.nodes.forEach(el => {
        if (!isColored) {
          this.colorBimObjectGroup(id, el, res.relationName, res
            .color);
        } else {
          this.restaureBimObjectColor(id, el, res.relationName);
        }
      });
    });
  },
  restaureBimObjectColor(id, node, relationName) {
    return SpinalGraphService.getChildren(node.id.get(), [relationName]).then(
      children => {
        //   ItemsColoredMap.delete(node.id.get());
        ItemsColoredMap.delete(id);

        children.forEach(child => {

          window.v.setThemingColor(
            child.dbid.get(),
            // eslint-disable-next-line no-undef
            new THREE.Vector4(0, 0, 0, 0)
          );

          let allColors = BimElementsColor.get(child.dbid.get());

          if (allColors) {
            //   allColors = allColors.filter(el => el.id !== node.id.get());
            allColors = allColors.filter(el => el.id !== id);
            BimElementsColor.set(child.dbid.get(), allColors);

            if (allColors.length > 0) {
              let color = allColors[0].color;
              window.v.setThemingColor(
                child.dbid.get(),
                // eslint-disable-next-line no-undef
                new THREE.Vector4(
                  color.r / 255,
                  color.g / 255,
                  color.b / 255,
                  0.7
                )
              );
            }
          }
        });
      }
    );
  },
  colorBimObjectGroup(id, node, relationName, argColor) {
    return SpinalGraphService.getChildren(node.id.get(), [relationName]).then(
      children => {
        let nodeColor;

        if (argColor) {
          nodeColor = argColor;
        } else {
          nodeColor = node.color ? node.color.get() : "#000000";
        }

        let color = this.convertHexColorToRGB(nodeColor);

        children.forEach(child => {
          //   ItemsColoredMap.set(node.id.get(), node.id.get());
          ItemsColoredMap.set(id, id);

          let BimColors = BimElementsColor.get(child.dbid.get()) ?
            BimElementsColor.get(child.dbid.get()) : [];

          BimColors.push({
            id: id, //node.id.get(),
            color: color
          });

          BimElementsColor.set(child.dbid.get(), BimColors);

          window.v.setThemingColor(
            child.dbid.get(),
            // eslint-disable-next-line no-undef
            new THREE.Vector4(color.r / 255, color.g / 255, color.b /
              255, 0.7)
          );
        });
      }
    );
  },
  convertHexColorToRGB(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } :
      null;
  },
  async getNodesToColor(node) {
    let type = node.type.get();
    let res = {};
    if (type === ROOMS_GROUP) {
      res["color"] = node.color.get();
      res["nodes"] = await SpinalGraphService.getChildren(node.id.get(), [
        ROOMS_TO_ELEMENT_RELATION
      ]);
      res["relationName"] = geographicService.constants.EQUIPMENT_RELATION;
    } else if (type === EQUIPMENTS_GROUP) {
      res["nodes"] = [node];
      res["relationName"] = EQUIPMENTS_TO_ELEMENT_RELATION;
    }
    return res;
  },
  colorContext(context, isColored) {
    let relationName =
      context.type.get() === ROOMS_GROUP_CONTEXT ?
      ROOMS_GROUP_RELATION :
      EQUIPMENTS_GROUP_RELATION;

    SpinalGraphService.getChildren(context.id.get(), [relationName]).then(
      children => {
        children.forEach(child => {
          this.colorElement(child, isColored);
        });
      }
    );
  }
};

export {
  utilities,
  ItemsColoredMap
};