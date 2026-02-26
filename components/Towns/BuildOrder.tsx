import { Button, Group, Table, Text, Title, Tooltip } from "@mantine/core";
import React, { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { BuildingDTO } from "../../lib/buildings";
import { NodePlain } from "../../lib/towns";
import { SpriteDTO } from "../../lib/sprites";
import { TownGraphState } from "./store";
import { useStoreFromContext } from "./TownGraphStoreProvider";
import SpriteSheet from "../SpriteSheet/SpriteSheet";

const ICON_SIZE = 18;

type CostEntry = { type: string; amount: number };

type BuildOrderItem = {
  label: string;
  key: string;
  cost: CostEntry[];
  isResearch: boolean;
};

function topologicalSort(
  selectedKeys: Set<string>,
  keyToNode: { [key: string]: NodePlain }
): string[] {
  const inDegree = new Map<string, number>();
  selectedKeys.forEach((key) => {
    inDegree.set(key, 0);
  });

  selectedKeys.forEach((key) => {
    const node = keyToNode[key];
    node.parentKeys.forEach((parentKey) => {
      if (selectedKeys.has(parentKey)) {
        inDegree.set(key, (inDegree.get(key) || 0) + 1);
      }
    });
  });

  const queue: string[] = [];
  inDegree.forEach((deg, key) => {
    if (deg === 0) queue.push(key);
  });
  queue.sort();

  const result: string[] = [];
  while (queue.length > 0) {
    const current = queue.shift()!;
    result.push(current);
    const node = keyToNode[current];
    node.childKeys.forEach((childKey) => {
      if (selectedKeys.has(childKey)) {
        const newDeg = (inDegree.get(childKey) || 1) - 1;
        inDegree.set(childKey, newDeg);
        if (newDeg === 0) {
          queue.push(childKey);
          queue.sort();
        }
      }
    });
  }
  return result;
}

function buildOrderItems(
  sortedKeys: string[],
  selectedResearchIds: Set<number>,
  keyToNode: { [key: string]: NodePlain },
  nameToBuilding: { [key: string]: BuildingDTO }
): BuildOrderItem[] {
  const items: BuildOrderItem[] = [];

  sortedKeys.forEach((key) => {
    const node = keyToNode[key];
    const building = nameToBuilding[node.name];
    if (!building) return;

    const label = node.level > 1 ? `${node.name} (${node.level})` : node.name;

    let cost: CostEntry[];
    if (node.level === 1) {
      cost = building.requirements?.costEntries || [];
    } else {
      const upgradeIndex = node.level - 2;
      cost = building.levelUpgrades?.[upgradeIndex]?.costEntries || [];
    }

    items.push({ label, key, cost, isResearch: false });

    if (node.level === 1 && building.stacks) {
      building.stacks.forEach((stack) => {
        stack.research.forEach((research) => {
          if (selectedResearchIds.has(research.id)) {
            items.push({
              label: `${research.name || stack.name}`,
              key: `research-${research.id}`,
              cost: research.costEntries,
              isResearch: true,
            });
          }
        });
      });
    }
  });

  return items;
}

const CostDisplay: React.FC<{
  entries: CostEntry[];
  resourceIcons: { [name: string]: SpriteDTO };
}> = ({ entries, resourceIcons }) => {
  if (entries.length === 0) return null;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 24 }}>
      {entries.map((c, i) => {
        const icon = resourceIcons[c.type];
        const resize = icon ? ICON_SIZE / icon.height : undefined;
        return (
          <Tooltip key={i} label={c.type}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              {icon ? (
                <SpriteSheet
                  spriteSheet={icon}
                  folder="icons"
                  resize={resize}
                  inline
                />
              ) : null}
              <span>{c.amount}</span>
            </span>
          </Tooltip>
        );
      })}
    </span>
  );
};

const CumulativeDisplay: React.FC<{
  cumulative: Map<string, number>;
  resourceIcons: { [name: string]: SpriteDTO };
}> = ({ cumulative, resourceIcons }) => {
  if (cumulative.size === 0) return null;
  const entries = Array.from(cumulative.entries());
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 24 }}>
      {entries.map(([type, amount], i) => {
        const icon = resourceIcons[type];
        const resize = icon ? ICON_SIZE / icon.height : undefined;
        return (
          <Tooltip key={i} label={type}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              {icon ? (
                <SpriteSheet
                  spriteSheet={icon}
                  folder="icons"
                  resize={resize}
                  inline
                />
              ) : null}
              <span>{amount}</span>
            </span>
          </Tooltip>
        );
      })}
    </span>
  );
};

const selector = (state: TownGraphState) => ({
  selectedKeys: state.selectedKeys,
  selectedResearchIds: state.selectedResearchIds,
  resetSelection: state.resetSelection,
});

const BuildOrder: React.FC<{
  nameToBuilding: { [key: string]: BuildingDTO };
  keyToNode: { [key: string]: NodePlain };
  resourceIcons: { [name: string]: SpriteDTO };
}> = ({ nameToBuilding, keyToNode, resourceIcons }) => {
  const { selectedKeys, selectedResearchIds, resetSelection } =
    useStoreFromContext(useShallow(selector));

  const { items, cumulativeCosts } = useMemo(() => {
    if (selectedKeys.size === 0) {
      return {
        items: [] as BuildOrderItem[],
        cumulativeCosts: [] as Map<string, number>[],
      };
    }
    const sorted = topologicalSort(selectedKeys, keyToNode);
    const items = buildOrderItems(
      sorted,
      selectedResearchIds,
      keyToNode,
      nameToBuilding
    );

    const cumulativeCosts: Map<string, number>[] = [];
    const running = new Map<string, number>();
    items.forEach((item) => {
      item.cost.forEach(({ type, amount }) => {
        running.set(type, (running.get(type) || 0) + amount);
      });
      cumulativeCosts.push(new Map(running));
    });

    return { items, cumulativeCosts };
  }, [selectedKeys, selectedResearchIds, keyToNode, nameToBuilding]);

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <Group position="apart" mt="1.5em" mb="0.5em">
        <Title order={2}>Build Order</Title>
        <Button variant="subtle" compact onClick={resetSelection}>
          Reset
        </Button>
      </Group>
      <Table striped highlightOnHover>
        <thead>
          <tr>
            <th>Build</th>
            <th>Cost</th>
            <th>Total Cost So Far</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.key}>
              <td>
                <Text
                  size="sm"
                  color={item.isResearch ? "dimmed" : undefined}
                  italic={item.isResearch}
                >
                  {item.isResearch ? `↳ ${item.label}` : item.label}
                </Text>
              </td>
              <td>
                <CostDisplay
                  entries={item.cost}
                  resourceIcons={resourceIcons}
                />
              </td>
              <td>
                <CumulativeDisplay
                  cumulative={cumulativeCosts[index]}
                  resourceIcons={resourceIcons}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default BuildOrder;
