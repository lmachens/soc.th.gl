import { useEffect, useMemo } from "react";
import ReactFlow, { Edge, MarkerType, Node } from "reactflow";
import { useShallow } from "zustand/react/shallow";

import { BuildingDTO } from "../../../lib/buildings";
import { TownDataPlain } from "../../../lib/towns";
import createUseTownStore, { TownGraphState } from "../store";
import { BuildingNode } from "./BuildingNode";

import 'reactflow/dist/style.css';
import { useWindowDimensions } from "../../../lib/hooks";
import { getComponentOffsets, getNumNodeColumns } from '../positioning';
import { kNodeMarginBottom, kNodeMarginRight, kNodeSize } from "./constants";

const selector = (state: TownGraphState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  toggleNodeSelection: state.toggleNodeSelection,
  resizeGraph: state.resizeGraph,
});

export const TownGraph: React.FC<{
  nameToBuilding: { [key: string]: BuildingDTO; };
  townData: TownDataPlain;
}> = ({
  nameToBuilding, townData,
}) => {
  const computeInitialGraphData = () => {
    const initialNodes = [] as Node[];
    const initialEdges = [] as Edge[];
    const { componentIdToOffset } = getComponentOffsets(townData.components, 10);
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
    computeInitialGraphData, [
      townData,
      nameToBuilding,
    ]);
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
    resizeGraph,
  } = useTownStore(
    useShallow(selector),
  );
  const nodeTypes = useMemo(() => ({ buildingNode: BuildingNode }), []);

  const windowDimensions = useWindowDimensions();
  const numNodeColumns = getNumNodeColumns(windowDimensions);
  const { dimensions } = useMemo(() => {
    return getComponentOffsets(
      townData.components, numNodeColumns);
    },
    [
      townData,
      numNodeColumns
    ]
  );

  useEffect(() => {
    resizeGraph(townData.components, numNodeColumns);
    console.log('Resizing graph');
  }, [townData.components, numNodeColumns, resizeGraph]);

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
