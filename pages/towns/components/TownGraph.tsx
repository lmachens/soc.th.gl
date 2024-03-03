import { useMemo } from "react";
import ReactFlow, { Edge, MarkerType, Node } from "reactflow";
import { useShallow } from "zustand/react/shallow";

import { BuildingDTO } from "../../../lib/buildings";
import createUseTownStore, { TownGraphState } from "../store";
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

const selector = (state: TownGraphState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  toggleNodeSelection: state.toggleNodeSelection,
});

export const TownGraph: React.FC<{
  nameToBuilding: { [key: string]: BuildingDTO; };
  townData: TownDataPlain;
}> = ({
  nameToBuilding, townData,
}) => {
  const { componentIdToOffset } = useMemo(() => getComponentOffsets(
    townData.components, 8), [townData]);
  const computeInitialGraphData = () => {
    const initialNodes = [] as Node[];
    const initialEdges = [] as Edge[];
    townData.components.forEach(({ component, positioning }) => {
      const offset = componentIdToOffset[component.id];
      component.stacks.forEach((stack) => {
        stack.nodes.forEach((node) => {
          const { x, y } = positioning.nodeKeyToPosition[node.key];
          initialNodes.push({
            id: node.key,
            type: 'buildingNode',
            data: {
              node,
              building: nameToBuilding[node.name],
              numNodesInStack: stack.numNodes,
              selected: false,
            },
            position: {
              x: (offset.x + x - 1) * (64 + 32),
              y: (offset.y + y - 1) * (64 + 64),
            },
          });

          node.childKeys.forEach((childKey) => {
            initialEdges.push({
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
    return { initialNodes, initialEdges };
  };
  const { initialNodes, initialEdges } = useMemo(
    computeInitialGraphData, [townData, componentIdToOffset, nameToBuilding]);
  const useTownStore = useMemo(
    () => createUseTownStore(initialNodes, initialEdges, townData.keyToNode),
    [
      initialNodes,
      initialEdges,
      townData.keyToNode,
    ]
);
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    toggleNodeSelection,
  } = useTownStore(
    useShallow(selector),
  );
  const nodeTypes = useMemo(() => ({ buildingNode: BuildingNode }), []);

  return (
    <div style={{ minWidth: 800, width: 1000, height: 800 }}>
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, node) => toggleNodeSelection(node.id)}
        proOptions={{ hideAttribution: true }} />
    </div>
  );
};
