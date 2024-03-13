import { Text } from "@mantine/core";
import { Handle, Position } from "reactflow";
import SpriteSheet from "../../../components/SpriteSheet/SpriteSheet";
import { BuildingDTO } from "../../../lib/buildings";
import { NodePlain } from "../../../lib/towns";
import { NODE_SIZE, TOWN_GRAPH_COLORS } from "../constants";

const BuildingNode: React.FC<{
  data: {
    node: NodePlain;
    building: BuildingDTO;
    numNodesInStack: number;
    selected: boolean;
  };
}> = ({ data }) => {
  const { node, building, numNodesInStack, selected } = data;
  const hasChildren = node.childKeys.length > 0;
  const hasParents = node.parentKeys.length > 0;
  const nodeText =
    numNodesInStack > 1 ? `${node.name} (${node.level})` : node.name;
  return (
    <div>
      <div
        style={{
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
