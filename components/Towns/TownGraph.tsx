import { FC, useEffect, useMemo } from "react";
import ReactFlow from "reactflow";
import { useShallow } from "zustand/react/shallow";

import { TownGraphState } from "./store";
import BuildingNode from "./BuildingNode";

import "reactflow/dist/style.css";
import { useWindowDimensions } from "../../lib/hooks";
import {
  getComponentOffsets,
  getNumNodeColumns,
} from "../../lib/towns/positioning";
import { NODE_MARGIN_BOTTOM, NODE_SIZE } from "../../lib/towns/constants";
import { useStoreFromContext } from "./TownGraphStoreProvider";
import { TownDataPlain } from "../../lib/towns";

const selector = (state: TownGraphState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  toggleNodeSelection: state.toggleNodeSelection,
  resizeGraph: state.resizeGraph,
});

const TownGraph: FC<{
  townData: TownDataPlain;
}> = ({ townData }) => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    toggleNodeSelection,
    resizeGraph,
  } = useStoreFromContext(useShallow(selector));
  const nodeTypes = useMemo(() => ({ buildingNode: BuildingNode }), []);

  const windowDimensions = useWindowDimensions();
  const numNodeColumns = getNumNodeColumns(windowDimensions);
  const { dimensions } = useMemo(() => {
    return getComponentOffsets(townData.components, numNodeColumns);
  }, [townData, numNodeColumns]);

  useEffect(
    () => resizeGraph(townData.components, numNodeColumns),
    [townData.components, numNodeColumns, resizeGraph]
  );

  return (
    <div
      style={{
        width: "100%",
        height: dimensions.height * (NODE_SIZE + NODE_MARGIN_BOTTOM),
      }}
    >
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, node) => toggleNodeSelection(node.id)}
        nodesDraggable={false}
        panOnDrag={true}
        zoomOnScroll={false}
        preventScrolling={false}
        proOptions={{ hideAttribution: true }}
      />
    </div>
  );
};

export default TownGraph;
