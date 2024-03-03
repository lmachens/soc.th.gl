import { Text } from "@mantine/core";
import { Handle, Position } from "reactflow";
import SpriteSheet from "../../../components/SpriteSheet/SpriteSheet";
import { BuildingDTO } from "../../../lib/buildings";
import { NodePlain } from "../../../lib/towns";

export const BuildingNode: React.FC<{
  data: {
    node: NodePlain;
    building: BuildingDTO;
    numNodesInStack: number;
  },
}> = ({
  data,
}) => {
  const { node, building, numNodesInStack } = data;
  const hasChildren = node.childKeys.length > 0;
  const hasParents = node.parentKeys.length > 0;
  const nodeText = (numNodesInStack > 1)
    ? `${node.name} (${node.level})`
    : node.name;
  return (
    <div>
      <div style={{
        width: 64,
        height: 64,
        background: '#1a1b1e',
        borderRadius: 8,
        border: '1px solid #f39a25',
      }}>
        {hasParents && (
          <Handle
            type="target"
            position={Position.Top}
            style={{
              opacity: 0,
            }} />
        )}
        <SpriteSheet
          spriteSheet={building.portraits[node.level - 1]}
          folder="buildings" />
        {hasChildren && (
          <Handle
            type="source"
            position={Position.Bottom}
            style={{
              opacity: 0,
            }} />
        )}
        <Text
          align="center"
          size={11}
        >
          <mark style={{ background: '#1a1b1e', color: 'inherit' }}>
            {nodeText}
          </mark>
        </Text>
      </div>
    </div>
  );
};
