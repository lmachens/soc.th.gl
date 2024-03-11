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
import { createStore } from 'zustand';

import { Coordinate, Dimensions, NodePlain, PositionedComponentPlain } from '../../lib/towns';
import { kNodeMarginBottom, kNodeMarginRight, kNodeSize } from "./constants";
import { getComponentOffsets } from './positioning';
import { BuildingDTO } from '../../lib/buildings';


export type TownGraphState = {
  nodes: Node[];
  edges: Edge[];
  selectedKeys: Set<string>;
  availableTroopKeys: Set<string>;
  dimensions: Dimensions;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  toggleNodeSelection: (nodeId: string) => void;
  resizeGraph: (
    components: PositionedComponentPlain[],
    numNodeColumns: number,
  ) => void;
};

export const computeInitialGraphData = (
  nameToBuilding: { [key: string]: BuildingDTO; },
  components: PositionedComponentPlain[],
) => {
  const initialNodes = [] as Node[];
  const initialEdges = [] as Edge[];
  const { componentIdToOffset } = getComponentOffsets(components);
  components.forEach(({ component, positioning }) => {
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
            level: node.level,
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

const getAvailableTroops = (
  nodes: Node[],
  selectedKeys: Set<string>,
): Set<string> => {
  const activeUnits = new Set<string>();
  nodes.forEach((flowNode) => {
    if (selectedKeys.has(flowNode.id)) {
      const { building, level: buildingLevel } = flowNode.data;
      const { incomePerLevel } = building;
      (incomePerLevel || []).forEach(({
        troopIncomes,
        level: incomeLevel
      }: { troopIncomes: any[], level: number }) => {
        (troopIncomes || []).forEach((income: any) => {
          const { unitKey } = income;
          if (buildingLevel == incomeLevel) {
            activeUnits.add(unitKey);
          }
        });
      });
    }
  });
  return activeUnits;
};

const createUseTownStore = (
  initialNodes: Node[],
  initialEdges: Edge[],
  keyToNode: { [key: string]: NodePlain },
) => {
  return createStore<TownGraphState>()((set, get) => ({
      nodes: initialNodes,
      edges: initialEdges,
      selectedKeys: new Set([]),
      availableTroopKeys: new Set([]),
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

        const availableTroopKeys = getAvailableTroops(state.nodes, selectedKeys);

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
              stroke: isSelected ? '#f6b156' : '#c1c2c5',
            };
            flowEdge.markerEnd = {
              type: MarkerType.Arrow,
              color: isSelected ? '#f6b156' : '#c1c2c5',
            };
            return flowEdge;
          }),
          selectedKeys,
          availableTroopKeys,
        });
      },
      dimensions: { width: 0, height: 0 },
      resizeGraph: (
        components: PositionedComponentPlain[],
        numNodeColumns: number,
      ) => {
        const { componentIdToOffset, dimensions } = getComponentOffsets(
          components, numNodeColumns);

        const nodeKeyToPosition: {
          [key: string]: { position: Coordinate } } = {};
        components.forEach(({ component, positioning }) => {
          const offset = componentIdToOffset[component.id];
          component.stacks.forEach((stack) => {
            stack.nodes.forEach((node) => {
              const { x, y } = positioning.nodeKeyToPosition[node.key];
              nodeKeyToPosition[node.key] = {
                position: {
                  x: (offset.x + x - 1) * (kNodeSize + kNodeMarginRight),
                  y: (offset.y + y - 1) * (kNodeSize + kNodeMarginBottom),
                },
              };
            });
          });
        });

        const { nodes } = get();
        set({
          nodes: nodes.map((flowNode) => {
            const position = nodeKeyToPosition[flowNode.id];
            return {
              ...flowNode,
              position: position?.position || flowNode.position
            };
          }),
          dimensions,
        });
      },
    }));
};

export default createUseTownStore;
