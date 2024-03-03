import {
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
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
            if (wasSelected === isSelected) {
              return flowNode;
            } else {
              flowNode.data = {
                ...flowNode.data,
                selected: isSelected,
              };
              return flowNode;
            }
          }),
          selectedKeys,
        });
      },
    }));
};

export default createUseTownStore;
