import { useMemo } from "react";
import ReactFlow, { Edge, MarkerType, Node } from "reactflow";
import { useShallow } from "zustand/react/shallow";

import { BuildingDTO } from "../../../lib/buildings";
import { Coordinate, Dimensions, PositionedComponentPlain, TownDataPlain } from "../../../lib/towns";
import createUseTownStore, { TownGraphState } from "../store";
import { BuildingNode } from "./BuildingNode";

import 'reactflow/dist/style.css';
import { kAppNavbarWidthLg, kAppNavbarWidthSm } from "../../../components/AppNavbar/AppNavbar";
import { useWindowDimensions } from "../../../lib/hooks";
import { kMaxComponentWidth, kNodeMarginBottom, kNodeMarginRight, kNodeSize } from "./constants";

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
const useResponsiveNumNodeColumns = () => {
  const windowDimensions = useWindowDimensions();
  const columnSpacing = [
    {
      numColumns: 10,
      unavailableWidth: kAppNavbarWidthLg + (
        /* error margin = */ kNodeSize + kNodeMarginRight)
    },
    { numColumns: 8, unavailableWidth: kAppNavbarWidthSm },
  ];
  const possibleSpacing = columnSpacing.filter(
    ({ numColumns, unavailableWidth }) => {
      const availableWidth = windowDimensions.width - unavailableWidth;
      const neededGraphWidth = numColumns * (
        kNodeSize + kNodeMarginRight);
      if (availableWidth >= neededGraphWidth) {
        return true;
      } else {
        return false;
      }
    }
  );
  return Math.max(
    ...possibleSpacing.map(({ numColumns }) => numColumns)
  ) || kMaxComponentWidth;
}

export const TownGraph: React.FC<{
  nameToBuilding: { [key: string]: BuildingDTO; };
  townData: TownDataPlain;
}> = ({
  nameToBuilding, townData,
}) => {
  const numNodeColumns = useResponsiveNumNodeColumns();

  const { componentIdToOffset, dimensions } = useMemo(() => getComponentOffsets(
    townData.components, numNodeColumns), [townData, numNodeColumns]);
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
              x: (offset.x + x - 1) * (
                kNodeSize + kNodeMarginRight),
              y: (offset.y + y - 1) * (
                kNodeSize + kNodeMarginBottom),
            },
          });

          node.childKeys.forEach((childKey) => {
            initialEdges.push({
              id: `${node.key}-${childKey}`,
              source: node.key,
              target: childKey,
              markerEnd: {
                type: MarkerType.Arrow,
                color: '#c1c2c5',
              },
              style: {
                stroke: '#c1c2c5',
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
    <div
      style={{
        width: '100%',
        height: dimensions.height * (
          kNodeSize + kNodeMarginBottom),
      }}>
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, node) => toggleNodeSelection(node.id)}
        panOnDrag={true}
        zoomOnScroll={false}
        preventScrolling={false}
        proOptions={{ hideAttribution: true }}
      />
    </div>
  );
};
