import { Text } from "@mantine/core";
import { Handle, Position } from "reactflow";
import { useShallow } from "zustand/react/shallow";
import SpriteSheet from "../SpriteSheet/SpriteSheet";
import { BuildingDTO } from "../../lib/buildings";
import { NODE_SIZE, TOWN_GRAPH_COLORS } from "../../lib/towns/constants";
import { NodePlain } from "../../lib/towns";
import { FC } from "react";
import { useStoreFromContext } from "./TownGraphStoreProvider";
import { TownGraphState } from "./store";

const RESEARCH_ICON_SIZE = 20;

const selector = (state: TownGraphState) => ({
  selectedResearchIds: state.selectedResearchIds,
  toggleResearchSelection: state.toggleResearchSelection,
});

const BuildingNode: FC<{
  data: {
    node: NodePlain;
    building: BuildingDTO;
    numNodesInStack: number;
    selected: boolean;
    unitGatingResearchIds: Set<number>;
  };
}> = ({ data }) => {
  const { node, building, numNodesInStack, selected, unitGatingResearchIds } =
    data;
  const { selectedResearchIds, toggleResearchSelection } =
    useStoreFromContext(useShallow(selector));
  const hasChildren = node.childKeys.length > 0;
  const hasParents = node.parentKeys.length > 0;
  const nodeText =
    numNodesInStack > 1 ? `${node.name} (${node.level})` : node.name;
  // Only show research icons for stacks whose research gates a unit.
  const unitGatingStacks = (building.stacks || []).filter((stack) =>
    stack.research.some((r) => unitGatingResearchIds.has(r.id))
  );
  return (
    <div>
      <div
        style={{
          position: "relative",
          width: NODE_SIZE,
          height: NODE_SIZE,
          background: TOWN_GRAPH_COLORS.backgroundDark,
          borderRadius: 8,
          border: selected
            ? `1px solid ${TOWN_GRAPH_COLORS.selectionPrimary}`
            : `1px solid ${TOWN_GRAPH_COLORS.selectionNeutral}`,
          cursor: "pointer",
        }}
      >
        {hasParents && (
          <Handle
            type="target"
            position={Position.Top}
            style={{
              opacity: 0,
            }}
          />
        )}
        <SpriteSheet
          spriteSheet={building.portraits[node.level - 1]}
          folder="buildings"
        />
        {hasChildren && (
          <Handle
            type="source"
            position={Position.Bottom}
            style={{
              opacity: 0,
            }}
          />
        )}
        {node.level === 1 && unitGatingStacks.length > 0 && (
          <div
            style={{
              position: "absolute",
              bottom: 2,
              right: 2,
              display: "flex",
              gap: 2,
            }}
          >
            {unitGatingStacks.map((stack) => {
              const research = stack.research[0];
              if (!research) return null;
              const isResearchSelected = selectedResearchIds.has(research.id);
              return (
                <div
                  key={research.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleResearchSelection(node.key, research.id);
                  }}
                  style={{
                    width: RESEARCH_ICON_SIZE,
                    height: RESEARCH_ICON_SIZE,
                    borderRadius: 4,
                    border: isResearchSelected
                      ? `1px solid ${TOWN_GRAPH_COLORS.selectionPrimary}`
                      : `1px solid ${TOWN_GRAPH_COLORS.selectionNeutral}`,
                    background: TOWN_GRAPH_COLORS.backgroundDark,
                    cursor: "pointer",
                    overflow: "hidden",
                  }}
                >
                  <SpriteSheet
                    spriteSheet={stack.icon}
                    folder="icons"
                    resize={RESEARCH_ICON_SIZE / 110}
                  />
                </div>
              );
            })}
          </div>
        )}
        <Text align="center" size={11}>
          <mark
            style={{
              background: TOWN_GRAPH_COLORS.backgroundDark,
              color: selected
                ? TOWN_GRAPH_COLORS.selectionPrimary
                : TOWN_GRAPH_COLORS.selectionNeutral,
            }}
          >
            {nodeText}
          </mark>
        </Text>
      </div>
    </div>
  );
};

export default BuildingNode;
