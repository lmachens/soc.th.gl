import { Coordinate, Dimensions, PositionedComponentPlain } from '../../lib/towns';

/** Places Node components into rows.
 *  This function is useful for dynamically resizing the grid for small screens.
 */
export function getComponentOffsets(
  components: PositionedComponentPlain[],
  numColumns: number = 6
): {
  componentIdToOffset: { [key: number]: Coordinate; };
  dimensions: Dimensions;
} {
  const componentIdToOffset: { [key: number]: Coordinate; } = {};

  // Components are closely connected, so we can't break them up between rows.
  const maxComponentWidth = Math.max(...components.map(
    ({ positioning }) => positioning.dimensions.width));
  const stacksPerRow = Math.max(numColumns, maxComponentWidth);

  const offset: Coordinate = { x: 0, y: 0 };
  let heightSoFar = 0;
  for (const { component, positioning: { dimensions } } of components) {
    if ((offset.x + dimensions.width) <= stacksPerRow) {
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
    dimensions: { width: stacksPerRow, height: heightSoFar },
  };
}
