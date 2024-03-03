import {
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from 'reactflow';
import { create } from 'zustand';

import { NodePlain } from '../../lib/towns';

export type TownGraphState = {
  nodes: Node[];
  edges: Edge[];
  selectedKeys: Set<string>;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  toggleNodeSelection: (nodeId: string) => void;
};

const selectWithAncestors = (
  key: string,
  keyToNode: { [key: string]: NodePlain },
  selectedKeys: Set<string>,
) => {
  const node = keyToNode[key];
  selectedKeys.add(node.key);
  node.parentKeys.forEach((parentKey) => {
    selectWithAncestors(parentKey, keyToNode, selectedKeys);
  });
}

const deselectWithDescendants = (
  key: string,
  keyToNode: { [key: string]: NodePlain },
  selectedKeys: Set<string>,
) => {
  const node = keyToNode[key];
  selectedKeys.delete(node.key);
  node.childKeys.forEach((childKey) => {
    deselectWithDescendants(childKey, keyToNode, selectedKeys);
  });
}

const createUseTownStore = (
  initialNodes: Node[],
  initialEdges: Edge[],
  keyToNode: { [key: string]: NodePlain },
) => {
  return create<TownGraphState>()((set, get) => ({
      nodes: initialNodes,
      edges: initialEdges,
      selectedKeys: new Set([]),
      onNodesChange: (changes: NodeChange[]) => {
        set({
          nodes: applyNodeChanges(changes, get().nodes),
        });
      },
      onEdgesChange: (changes: EdgeChange[]) => {
        set({
          edges: applyEdgeChanges(changes, get().edges),
        });
      },
      toggleNodeSelection: (selectedKey: string) => {
        const state = get();

        const selectedKeys = new Set<string>(state.selectedKeys);
        const isSelected = state.selectedKeys.has(selectedKey);
        if (isSelected) {
          deselectWithDescendants(selectedKey, keyToNode, selectedKeys);
        } else {
          selectWithAncestors(selectedKey, keyToNode, selectedKeys);
        }

        set({
          nodes: state.nodes.map((flowNode) => {
            const wasSelected = flowNode.data.selected;
            const isSelected = selectedKeys.has(flowNode.id);
            if (wasSelected !== isSelected) {
              flowNode.data = {
                ...flowNode.data,
                selected: isSelected,
              };
            }
            return flowNode;
          }),
          edges: state.edges.map((flowEdge) => {
            const sourceSelected = selectedKeys.has(flowEdge.source);
            const targetSelected = selectedKeys.has(flowEdge.target);
            const isSelected = sourceSelected && targetSelected;
            flowEdge.style = {
              ...flowEdge.style,
              stroke: isSelected ? '#f39a25' : '#c1c2c5',
            };
            flowEdge.markerEnd = {
              type: MarkerType.Arrow,
              color: isSelected ? '#f39a25' : '#c1c2c5',
            };
            return flowEdge;
          }),
          selectedKeys,
        });
      },
    }));
};

export default createUseTownStore;
