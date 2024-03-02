import { BuildingDTO } from "./buildings";

function makeUnique(array: any[]) {
  const unique: any[] = [];
  array.forEach((item) => {
    if (unique.indexOf(item) < 0) {
      unique.push(item);
    }
  });
  return unique;
}

function getNodeKey(buildingName: string, tier: number) {
  return `${buildingName}/${tier}`;
}

export type NodePlain = {
  key: string;
  name: string;
  level: number;
  childKeys: string[];
  parentKeys: string[];
};

class Node {
  key: string;
  name: string;
  level: number;
  nextLevelKey: string | null;
  otherRequiredBuildingKeys: string[];
  childKeys: string[];
  parentKeys: string[];

  static #constructNextLevelKey(
    building: BuildingDTO,
    level: number,
  ): string | null {
    const { levelUpgrades = [] } = building;
    const hasNextLevel = (level - 1) < levelUpgrades.length;
    if (hasNextLevel) {
      return getNodeKey(building.name, level + 1);
    } else {
      return null;
    }
  }

  static #constructOtherRequiredBuildingKeys(
    building: BuildingDTO,
    level: number,
  ): string[] {
    if (level === 1) {
      const { requiredBuildings = [] } = building.requirements || {};
      return requiredBuildings.map(buildingName => getNodeKey(buildingName, 1));
    } else if (level > 1) {
      // upgradeIndex = 0 => upgrade to level 2 (1 --> 2)
      // upgradeIndex = 1 => upgrade to level 3 (2 --> 3)
      const upgradeIndex = level - 2;
      const { levelUpgrades = [] } = building;
      if (upgradeIndex < levelUpgrades.length) {
        return levelUpgrades[upgradeIndex].requiredBuildings.map(
          (requiredName) => getNodeKey(requiredName, 1)
        );
      } else {
        return [];
      }
    } else {
      throw Error(`Invalid level ${level} for building: ${building.name}`);
    }
  }

  constructor(building: BuildingDTO, level: number) {
    this.key = getNodeKey(building.name, level);
    this.name = building.name;
    this.level = level;
    this.nextLevelKey = Node.#constructNextLevelKey(building, level);
    this.otherRequiredBuildingKeys = Node.#constructOtherRequiredBuildingKeys(
      building, level);
    this.childKeys = [];
    this.parentKeys = [];
  }

  get isRoot() {
    return (
      (this.level === 1) &&
      (this.otherRequiredBuildingKeys.length === 0)
    );
  }

  toPlain(): NodePlain {
    return {
      key: this.key,
      name: this.name,
      level: this.level,
      childKeys: this.childKeys,
      parentKeys: this.parentKeys,
    };
  }
}

export type NodeStackPlain = {
  nodes: NodePlain[];
  childNodeKeys: string[];
};

class NodeStack {
  nodes: Node[];
  childNodeKeys: string[];

  constructor(nodes: Node[]) {
    this.nodes = nodes;
    this.childNodeKeys = makeUnique(
      this.nodes.map(node => node.childKeys).flat());
  }

  get numNodes() {
    return this.nodes.length;
  }

  toPlain(): NodeStackPlain {
    return {
      nodes: this.nodes.map(node => node.toPlain()),
      childNodeKeys: this.childNodeKeys,
    };
  }
}

export type ComponentPlain = {
  id: number;
  stacks: NodeStackPlain[];
};

class Component {
  id: number;
  stacks: NodeStack[];

  constructor(id: number, nodes: Node[]) {
    this.id = id;
    this.stacks = buildStacks(nodes);
  }

  get numNodes() {
    return this.stacks.reduce((total, stack) => total + stack.numNodes, 0);
  }

  toPlain(): ComponentPlain {
    return {
      id: this.id,
      stacks: this.stacks.map(stack => stack.toPlain()),
    };
  }
}

function buildStacks(nodes: Node[]): NodeStack[] {
  const keyToNode = new Map<string, Node>();
  nodes.map(node => keyToNode.set(node.key, node));

  function buildOneStack(node: Node) {
    let currentNode = node;
    const stackNodes = [currentNode];
    while (currentNode.nextLevelKey) {
      currentNode = keyToNode.get(currentNode.nextLevelKey) as Node;
      stackNodes.push(currentNode);
    }
    return new NodeStack(stackNodes);
  }

  const stacks: NodeStack[] = [];
  nodes.forEach((node) => {
    // Create a new stack only for tier 1 nodes.
    if (node.level !== 1) { return; }
    stacks.push(buildOneStack(node));
  });

  return stacks.sort((a, b) => {
    const aBefore = -1;
    const aSame = 0;

    // Children after parents.
    const bRootNode = keyToNode.get(b.nodes[0].key) as Node;
    const aPointsToB = a.childNodeKeys.indexOf(bRootNode.key) >= 0;
    if (aPointsToB) {
      return aBefore;
    }
    return aSame;
  });
}

function separateNodesIntoComponents(
  keyToNode: Map<string, Node>,
): Map<number, Node[]> {
  const nodeKeyToComponentId = new Map();
  let currentId = 0;

  function markComponentDFS(node: Node) {
    nodeKeyToComponentId.set(node.key, currentId);
    const adjacentNodeKeys = node.childKeys.concat(node.parentKeys);
    for (const adjacentNodeKey of adjacentNodeKeys) {
      if (nodeKeyToComponentId.has(adjacentNodeKey)) {
        continue;
      }
      const childNode = keyToNode.get(adjacentNodeKey);
      if (!childNode) {
        console.error(
          `Non-existent key ${adjacentNodeKey} adjacent to key ${node.key}`);
        return;
      }
      markComponentDFS(childNode);
    }
  }

  for (const node of keyToNode.values()) {
    if (!node.isRoot) {
      continue;
    }
    if (!nodeKeyToComponentId.has(node.key)) {
      markComponentDFS(node);
      currentId += 1;
    }
  }

  const componentIdToNodes = new Map<number, Node[]>();
  for (const [nodeKey, componentId] of nodeKeyToComponentId.entries()) {
    if (!componentIdToNodes.has(componentId)) {
      componentIdToNodes.set(componentId, []);
    }
    // @ts-ignore
    componentIdToNodes.get(componentId).push(keyToNode.get(nodeKey));

  }
  return componentIdToNodes;
}

function createNodes(
  factionBuildings: BuildingDTO[]
): Map<string, Node> {
  const keyToNode = new Map();

  // Create an child/parent-less Node for each level of each building.
  factionBuildings.forEach((building) => {
    const baseNode = new Node(building, 1);
    keyToNode.set(baseNode.key, baseNode)
    building?.levelUpgrades?.forEach((_, index) => {
      const levelNode = new Node(building, index + 2);
      keyToNode.set(levelNode.key, levelNode);
    });
  });

  // Add adjacency info to each node.
  // A is a parent of B and B is a child of A if one of the following holds:
  // *   A is a requirement for B
  // *   A is the previous level of B
  keyToNode.forEach((node) => {
    const { nextLevelKey } = node;
    if (nextLevelKey) {
      const nextLevelNode = keyToNode.get(nextLevelKey)
      node.childKeys.push(nextLevelNode.key);
      nextLevelNode.parentKeys.push(node.key);
    }
    node.otherRequiredBuildingKeys.forEach((requiredBuildingKey: string) => {
      const requiredNode = keyToNode.get(requiredBuildingKey);
      requiredNode.childKeys.push(node.key);
      node.parentKeys.push(requiredNode.key);
    });
  });

  return keyToNode;
}

type Coordinate = {
  x: number;
  y: number;
};

type Dimensions = {
  width: number;
  height: number;
};

export type ComponentPositioningPlain = {
  nodeKeyToPosition: { [key: string]: Coordinate };
  dimensions: Dimensions;
};

class ComponentPositioning {
  nodeKeyToPosition: Map<string, Coordinate>;
  dimensions: Dimensions;

  constructor(
    nodeKeyToPosition: Map<string, Coordinate>,
    dimensions: Dimensions
  ) {
    this.nodeKeyToPosition = nodeKeyToPosition;
    this.dimensions = dimensions;
  }

  toPlain(): ComponentPositioningPlain {
    const nodeKeyToPositionPlain: { [key: string]: Coordinate } = {};
    this.nodeKeyToPosition.forEach((position, key) => {
      nodeKeyToPositionPlain[key] = position;
    });
    return {
      nodeKeyToPosition: nodeKeyToPositionPlain,
      dimensions: this.dimensions,
    };
  }
};

function getComponentPositioning(
  component: Component,
  keyToNode: Map<string, Node>,
): ComponentPositioning {
  const nodeKeyToPosition = new Map<string, Coordinate>();


  // DFS all the node y-positions.
  const nodeKeyToY = new Map<string, number>();
  function setNodeY(node: Node): number {
    if (nodeKeyToY.has(node.key)) {
      return nodeKeyToY.get(node.key) as number;
    }
    let maxParentY = 0;
    node.parentKeys.forEach((parentKey) => {
      const parentNode = keyToNode.get(parentKey);
      const parentY = setNodeY(parentNode as Node);
      maxParentY = Math.max(maxParentY, parentY);
    });
    const y = maxParentY + 1;
    nodeKeyToY.set(node.key, y);
    return y;
  }
  keyToNode.forEach((node) => {
    setNodeY(node);
  });

  const dimensions = { width: 0, height: 0 };
  component.stacks.forEach((stack, stackIndex) => {
    stack.nodes.forEach((node) => {
      // Stacks are sorted so that each stack's nodes have x = stackIndex + 1.
      const x = stackIndex + 1;
      const y = nodeKeyToY.get(node.key) as number;
      // Possibly update component's dimensions.
      dimensions.width = Math.max(dimensions.width, x);
      dimensions.height = Math.max(dimensions.height, y);
      nodeKeyToPosition.set(node.key, { x, y });
    });
  });

  return new ComponentPositioning(nodeKeyToPosition, dimensions);
}

type PositionedComponentPlain = {
  component: ComponentPlain;
  positioning: ComponentPositioningPlain;
};


class PositionedComponent {
  component: Component;
  positioning: ComponentPositioning;

  constructor(component: Component, positioning: ComponentPositioning) {
    this.component = component;
    this.positioning = positioning;
  }

  toPlain(): PositionedComponentPlain {
    return {
      component: this.component.toPlain(),
      positioning: this.positioning.toPlain(),
    };
  }
}

export type TownDataPlain = {
  keyToNode: { [key: string]: NodePlain };
  components: PositionedComponentPlain[];
};

class TownData {
  keyToNode: Map<string, Node>;
  components: PositionedComponent[];

  constructor(
    keyToNode: Map<string, Node>,
    components: PositionedComponent[]
  ) {
    this.keyToNode = keyToNode;
    this.components = components;
  }

  toPlain(): TownDataPlain {
    const keyToNodePlain: { [key: string]: NodePlain } = {};
    this.keyToNode.forEach((node, key) => {
      keyToNodePlain[key] = node.toPlain();
    });
    return {
      keyToNode: keyToNodePlain,
      components: this.components.map(component => component.toPlain()),
    };
  }
};

export function createTownData(
  factionBuildings: BuildingDTO[]
): TownDataPlain {
  const keyToNode = createNodes(factionBuildings);
  const componentIdToNodes = separateNodesIntoComponents(keyToNode);

  const positionedComponents = Array.from(componentIdToNodes.values()).map(
    (nodes, componentId) => {
      const component = new Component(componentId, nodes);
      return new PositionedComponent(
        component,
        getComponentPositioning(component, keyToNode)
      );
    });

  return (new TownData(keyToNode, positionedComponents)).toPlain();
}
