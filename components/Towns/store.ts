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
} from "reactflow";
import { createStore } from "zustand";

import {
  Coordinate,
  Dimensions,
  NodePlain,
  PositionedComponentPlain,
} from "../../lib/towns";
import {
  NODE_MARGIN_BOTTOM,
  NODE_MARGIN_RIGHT,
  NODE_SIZE,
  TOWN_GRAPH_COLORS,
} from "../../lib/towns/constants";
import { getComponentOffsets } from "../../lib/towns/positioning";
import { BuildingDTO } from "../../lib/buildings";

export type TownGraphState = {
  nodes: Node[];
  edges: Edge[];
  selectedKeys: Set<string>;
  selectedResearchIds: Set<number>;
  availableTroopKeys: Set<string>;
  dimensions: Dimensions;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  toggleNodeSelection: (nodeId: string) => void;
  toggleResearchSelection: (nodeId: string, researchId: number) => void;
  resetSelection: () => void;
  resizeGraph: (
    components: PositionedComponentPlain[],
    numNodeColumns: number
  ) => void;
};

export const computeInitialGraphData = (
  nameToBuilding: { [key: string]: BuildingDTO },
  components: PositionedComponentPlain[]
) => {
  // Collect all research IDs that actually gate a unit.
  const unitGatingResearchIds = new Set<number>();
  Object.values(nameToBuilding).forEach((building) => {
    building.incomePerLevel?.forEach((income) => {
      income.troopIncomes?.forEach((troop) => {
        troop.requiredResearch?.forEach((id) =>
          unitGatingResearchIds.add(id)
        );
      });
    });
  });

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
          type: "buildingNode",
          data: {
            node,
            building: nameToBuilding[node.name],
            numNodesInStack: stack.numNodes,
            selected: false,
            level: node.level,
            unitGatingResearchIds,
          },
          position: {
            x: (offset.x + x - 1) * (NODE_SIZE + NODE_MARGIN_RIGHT),
            y: (offset.y + y - 1) * (NODE_SIZE + NODE_MARGIN_BOTTOM),
          },
        });

        node.childKeys.forEach((childKey) => {
          initialEdges.push({
            id: `${node.key}-${childKey}`,
            source: node.key,
            target: childKey,
            markerEnd: {
              type: MarkerType.Arrow,
              color: TOWN_GRAPH_COLORS.selectionNeutral,
            },
            style: {
              stroke: TOWN_GRAPH_COLORS.selectionNeutral,
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
  selectedKeys: Set<string>
) => {
  const node = keyToNode[key];
  selectedKeys.add(node.key);
  node.parentKeys.forEach((parentKey) => {
    selectWithAncestors(parentKey, keyToNode, selectedKeys);
  });
};

const deselectWithDescendants = (
  key: string,
  keyToNode: { [key: string]: NodePlain },
  selectedKeys: Set<string>
) => {
  const node = keyToNode[key];
  selectedKeys.delete(node.key);
  node.childKeys.forEach((childKey) => {
    deselectWithDescendants(childKey, keyToNode, selectedKeys);
  });
};

const getAvailableTroops = (
  nodes: Node[],
  selectedKeys: Set<string>,
  selectedResearchIds: Set<number>
): Set<string> => {
  const activeUnits = new Set<string>();
  nodes.forEach((flowNode) => {
    if (selectedKeys.has(flowNode.id)) {
      const { building, level: buildingLevel } = flowNode.data;
      const { incomePerLevel } = building;
      (incomePerLevel || []).forEach(
        ({
          troopIncomes,
          level: incomeLevel,
        }: {
          troopIncomes: any[];
          level: number;
        }) => {
          if (buildingLevel == incomeLevel) {
            (troopIncomes || []).forEach((income: any) => {
              const { unitKey, requiredResearch } = income;
              const researchSatisfied =
                !requiredResearch ||
                requiredResearch.length === 0 ||
                requiredResearch.every((id: number) =>
                  selectedResearchIds.has(id)
                );
              if (researchSatisfied) {
                activeUnits.add(unitKey);
              }
            });
          }
        }
      );
    }
  });
  return activeUnits;
};

const getResearchIdsForNode = (flowNode: Node): number[] => {
  const { building } = flowNode.data;
  if (!building?.stacks) return [];
  return building.stacks.flatMap((stack: any) =>
    stack.research.map((r: any) => r.id)
  );
};

const createUseTownStore = (
  initialNodes: Node[],
  initialEdges: Edge[],
  keyToNode: { [key: string]: NodePlain }
) => {
  return createStore<TownGraphState>()((set, get) => ({
    nodes: initialNodes,
    edges: initialEdges,
    selectedKeys: new Set([]),
    selectedResearchIds: new Set([]),
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
      const selectedResearchIds = new Set<number>(state.selectedResearchIds);
      const isSelected = state.selectedKeys.has(selectedKey);
      if (isSelected) {
        // Collect research IDs from nodes being deselected
        const deselectedKeys = new Set<string>();
        const collectDeselected = (key: string) => {
          const node = keyToNode[key];
          deselectedKeys.add(node.key);
          node.childKeys.forEach((childKey) => {
            if (selectedKeys.has(childKey)) {
              collectDeselected(childKey);
            }
          });
        };
        collectDeselected(selectedKey);

        // Remove research IDs only from level 1 nodes being deselected
        state.nodes.forEach((flowNode) => {
          if (deselectedKeys.has(flowNode.id) && flowNode.data.level === 1) {
            getResearchIdsForNode(flowNode).forEach((id) =>
              selectedResearchIds.delete(id)
            );
          }
        });

        deselectWithDescendants(selectedKey, keyToNode, selectedKeys);
      } else {
        selectWithAncestors(selectedKey, keyToNode, selectedKeys);
      }

      const availableTroopKeys = getAvailableTroops(
        state.nodes,
        selectedKeys,
        selectedResearchIds
      );

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
            stroke: isSelected
              ? TOWN_GRAPH_COLORS.selectionPrimary
              : TOWN_GRAPH_COLORS.selectionNeutral,
          };
          flowEdge.markerEnd = {
            type: MarkerType.Arrow,
            color: isSelected
              ? TOWN_GRAPH_COLORS.selectionPrimary
              : TOWN_GRAPH_COLORS.selectionNeutral,
          };
          return flowEdge;
        }),
        selectedKeys,
        selectedResearchIds,
        availableTroopKeys,
      });
    },
    toggleResearchSelection: (nodeId: string, researchId: number) => {
      const state = get();

      const selectedResearchIds = new Set<number>(state.selectedResearchIds);
      if (selectedResearchIds.has(researchId)) {
        selectedResearchIds.delete(researchId);
      } else {
        selectedResearchIds.add(researchId);
      }

      const selectedKeys = new Set<string>(state.selectedKeys);
      if (!selectedKeys.has(nodeId)) {
        selectWithAncestors(nodeId, keyToNode, selectedKeys);
      }

      const availableTroopKeys = getAvailableTroops(
        state.nodes,
        selectedKeys,
        selectedResearchIds
      );

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
            stroke: isSelected
              ? TOWN_GRAPH_COLORS.selectionPrimary
              : TOWN_GRAPH_COLORS.selectionNeutral,
          };
          flowEdge.markerEnd = {
            type: MarkerType.Arrow,
            color: isSelected
              ? TOWN_GRAPH_COLORS.selectionPrimary
              : TOWN_GRAPH_COLORS.selectionNeutral,
          };
          return flowEdge;
        }),
        selectedKeys,
        selectedResearchIds,
        availableTroopKeys,
      });
    },
    resetSelection: () => {
      const state = get();
      set({
        nodes: state.nodes.map((flowNode) => {
          if (flowNode.data.selected) {
            flowNode.data = { ...flowNode.data, selected: false };
          }
          return flowNode;
        }),
        edges: state.edges.map((flowEdge) => ({
          ...flowEdge,
          style: {
            ...flowEdge.style,
            stroke: TOWN_GRAPH_COLORS.selectionNeutral,
          },
          markerEnd: {
            type: MarkerType.Arrow,
            color: TOWN_GRAPH_COLORS.selectionNeutral,
          },
        })),
        selectedKeys: new Set<string>(),
        selectedResearchIds: new Set<number>(),
        availableTroopKeys: new Set<string>(),
      });
    },
    dimensions: { width: 0, height: 0 },
    resizeGraph: (
      components: PositionedComponentPlain[],
      numNodeColumns: number
    ) => {
      const { componentIdToOffset, dimensions } = getComponentOffsets(
        components,
        numNodeColumns
      );

      const nodeKeyToPosition: {
        [key: string]: { position: Coordinate };
      } = {};
      components.forEach(({ component, positioning }) => {
        const offset = componentIdToOffset[component.id];
        component.stacks.forEach((stack) => {
          stack.nodes.forEach((node) => {
            const { x, y } = positioning.nodeKeyToPosition[node.key];
            nodeKeyToPosition[node.key] = {
              position: {
                x: (offset.x + x - 1) * (NODE_SIZE + NODE_MARGIN_RIGHT),
                y: (offset.y + y - 1) * (NODE_SIZE + NODE_MARGIN_BOTTOM),
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
            position: position?.position || flowNode.position,
          };
        }),
        dimensions,
      });
    },
  }));
};

export default createUseTownStore;
