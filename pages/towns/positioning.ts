import {
  Coordinate,
  Dimensions,
  PositionedComponentPlain,
} from "../../lib/towns";
import { MAX_COMPONENT_WIDTH, NODE_MARGIN_RIGHT, NODE_SIZE } from "./constants";
import {
  APP_NAVBAR_WIDTH_LG,
  APP_NAVBAR_WIDTH_SM,
} from "../../components/AppNavbar/AppNavbar";

/** Places Node components into rows.
 *  This function is useful for dynamically resizing the grid for small screens.
 */
export function getComponentOffsets(
  components: PositionedComponentPlain[],
  desiredNumColumns: number = 10
): {
  componentIdToOffset: { [key: number]: Coordinate };
  dimensions: Dimensions;
} {
  const componentIdToOffset: { [key: number]: Coordinate } = {};

  // Components are closely connected, so we can't break them up between rows.
  const widestComponentNumColumns = Math.max(
    ...components.map(({ positioning }) => positioning.dimensions.width)
  );
  const numColumns = Math.max(desiredNumColumns, widestComponentNumColumns);

  const offset: Coordinate = { x: 0, y: 0 };
  let heightSoFar = 0;
  for (const {
    component,
    positioning: { dimensions },
  } of components) {
    if (offset.x + dimensions.width <= numColumns) {
      // Same row.
      componentIdToOffset[component.id] = { ...offset };
      offset.x += dimensions.width;
    } else {
      // New row
      offset.x = 0;
      offset.y = heightSoFar;
      componentIdToOffset[component.id] = { ...offset };
      offset.x = dimensions.width;
    }
    heightSoFar = Math.max(heightSoFar, offset.y + dimensions.height);
  }

  return {
    componentIdToOffset,
    dimensions: { width: numColumns, height: heightSoFar },
  };
}

/**
 * Determines the number of columns to use for the town graph.
 *
 * Because we render the town graph in ReactFlow with explicitly calculated
 * node positions, we need to manually make the graph responsive.
 * Moreover, we can't narrow the graph beyond the width of the widest
 * node connected component.
 *
 * The non-responsiveness of the graph is compensated for by the ability to pan.
 */
export const getNumNodeColumns = (windowDimensions: Dimensions) => {
  const columnSpacing = [
    {
      numColumns: 10,
      unavailableWidth:
        APP_NAVBAR_WIDTH_LG +
        /* error margin = */ (NODE_SIZE + NODE_MARGIN_RIGHT),
    },
    { numColumns: 8, unavailableWidth: APP_NAVBAR_WIDTH_SM },
  ];
  const possibleSpacing = columnSpacing.filter(
    ({ numColumns, unavailableWidth }) => {
      const availableWidth = windowDimensions.width - unavailableWidth;
      const neededGraphWidth = numColumns * (NODE_SIZE + NODE_MARGIN_RIGHT);
      if (availableWidth >= neededGraphWidth) {
        return true;
      } else {
        return false;
      }
    }
  );
  if (possibleSpacing.length > 0) {
    return (
      Math.max(...possibleSpacing.map(({ numColumns }) => numColumns)) ||
      MAX_COMPONENT_WIDTH
    );
  } else {
    return MAX_COMPONENT_WIDTH;
  }
};
