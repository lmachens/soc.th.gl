import { useMemo } from "react";
import ReactFlow, { MarkerType } from "reactflow";
import { BuildingDTO } from "../../../lib/buildings";
import { Coordinate, Dimensions, PositionedComponentPlain, TownDataPlain } from "../../../lib/towns";
import { BuildingNode } from "./BuildingNode";

import 'reactflow/dist/style.css';

/** Places Node components into rows.
 *  This function is useful for dynamically resizing the grid for small screens.
 */
export function getComponentOffsets(
  components: PositionedComponentPlain[],
  numColumns: number = 6
): {
  componentIdToOffset: { [key: number]: Coordinate },
  dimensions: Dimensions,
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

export const TownGraph: React.FC<{
  nameToBuilding: { [key: string]: BuildingDTO; };
  townData: TownDataPlain;
}> = ({
  nameToBuilding, townData,
}) => {
  const { componentIdToOffset } = getComponentOffsets(
    townData.components, 8);
  const reactflowNodes = [] as any[];
  const reactflowEdges = [] as any[];
  townData.components.forEach(({ component, positioning }) => {
    const offset = componentIdToOffset[component.id];
    component.stacks.forEach((stack) => {
      stack.nodes.forEach((node) => {
        const { x, y } = positioning.nodeKeyToPosition[node.key];
        reactflowNodes.push({
          id: node.key,
          type: 'buildingNode',
          data: {
            node,
            building: nameToBuilding[node.name],
            numNodesInStack: stack.numNodes,
          },
          position: {
            x: (offset.x + x - 1) * (64 + 32),
            y: (offset.y + y - 1) * (64 + 64),
          },
        });

        node.childKeys.forEach((childKey) => {
          reactflowEdges.push({
            id: `${node.key}-${childKey}`,
            source: node.key,
            target: childKey,
            markerEnd: {
              type: MarkerType.Arrow,
              color: '#f39a25',
            },
            style: {
              stroke: '#f39a25',
            },
          });
        });
      });
    });
  });

  const nodeTypes = useMemo(() => ({ buildingNode: BuildingNode }), []);

  return (
    <div style={{ minWidth: 800, width: 1000, height: 800 }}>
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={reactflowNodes}
        edges={reactflowEdges}
        proOptions={{ hideAttribution: true }} />
    </div>
  );
};
