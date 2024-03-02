import {
  Container,
  Text,
  Title,
} from "@mantine/core";
import { GetStaticPaths, NextPage } from "next";
import { withStaticBase } from "../../lib/staticProps";

import { useMemo } from "react";
import ReactFlow, { Handle, MarkerType, Position } from "reactflow";
import PageHead from "../../components/PageHead/PageHead";
import SpriteSheet from "../../components/SpriteSheet/SpriteSheet";
import { BuildingDTO, getBuilding, getBuildings } from "../../lib/buildings";
import { FactionDTO, getFaction, getFactions } from "../../lib/factions";
import { TermsDTO } from "../../lib/terms";
import {
  PositionedComponentPlain,
  NodePlain,
  TownDataPlain,
  createTownData,
  Coordinate
} from "../../lib/towns";

import 'reactflow/dist/style.css';


const BuildingNode: React.FC<{
  data: {
    node: NodePlain,
    building: BuildingDTO,
  },
}> = ({
  data,
}) => {
  const { node, building } = data;
  const hasChildren = node.childKeys.length > 0;
  const hasParents = node.parentKeys.length > 0;
  return (
    <>
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
      <Text align="center" size={9}>{node.key}</Text>
    </>
  );
}

/** Places Node components into rows.
 *  This method is useful for dynamically resizing the grid for small screens.
 */
function getComponentOffsets(
  components: PositionedComponentPlain[],
  numColumns: number = 6,
): { [key: number]: Coordinate } {
  const componentIdToOffset: { [key: number]: Coordinate } = {};

  // Components are closely connected, so we can't break them up between rows.
  const maxComponentWidth = Math.max(...components.map(
    ({ positioning }) => positioning.dimensions.width));
  const stacksPerRow = Math.max(numColumns, maxComponentWidth);

  const offset: Coordinate = { x: 0, y: 0 };
  let heightSoFar = 0;
  for (const { component, positioning: { dimensions } } of components) {
    if ((offset.x + dimensions.width) <= stacksPerRow) {
      // Same row.
      componentIdToOffset[component.id] = { ...offset };
      offset.x += dimensions.width;
    } else {
      // New row
      offset.x = 0;
      offset.y = heightSoFar;
      componentIdToOffset[component.id] = { ...offset };
      offset.x = dimensions.width;
    }
    heightSoFar = Math.max(heightSoFar, offset.y + dimensions.height);
  }

  return componentIdToOffset
}

const TownGraph: React.FC<{
  nameToBuilding: { [key: string]: BuildingDTO },
  townData: TownDataPlain,
}> = ({
  nameToBuilding,
  townData,
}) => {
  const componentIdToOffset = getComponentOffsets(
    townData.components, 8);
  const reactflowNodes = [] as any[];
  const reactflowEdges = [] as any[];
  townData.components.forEach(({ component, positioning }) => {
    const offset = componentIdToOffset[component.id];
    component.stacks.forEach((stack) => {
      stack.nodes.forEach((node) => {
        const { x, y } = positioning.nodeKeyToPosition[node.key];
        reactflowNodes.push({
          id: node.key,
          type: 'buildingNode',
          data: {
            node,
            building: nameToBuilding[node.name],
          },
          position: {
            x: (offset.x + x - 1) * (64 + 32),
            y: (offset.y + y - 1) * (64 + 64),
          },
        });

        node.childKeys.forEach((childKey) => {
          reactflowEdges.push({
            id: `${node.key}-${childKey}`,
            source: node.key,
            target: childKey,
            markerEnd: {
              type: MarkerType.Arrow,
              color: '#f39a25',
            },
            style: {
              stroke: '#f39a25',
            },
          });
        });
      });
    });
  });

  const nodeTypes = useMemo(() => ({ buildingNode: BuildingNode }), []);

  return (
    <div style={{ minWidth:800, width: 1000, height: 800 }}>
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={reactflowNodes}
        edges={reactflowEdges}
        proOptions={{ hideAttribution: true }}
      />
    </div>
  );
};

const FactionTown: NextPage<{
  faction: FactionDTO,
  nameToBuilding: { [key: string]: BuildingDTO },
  townData: TownDataPlain,
}> = ({
  faction,
  nameToBuilding,
  townData,
}) => {
  return (
    <>
      <PageHead
        title={`${faction.name} Town Build - SoC.gg`}
        description={`Town build calculator for the ${faction.name} faction from Songs of Conquest.`}
      />
      <Container>
        <Title>{faction.name} Town Build</Title>
        <TownGraph
          nameToBuilding={nameToBuilding}
          townData={townData}
        />
      </Container>
    </>
  );
};

export default FactionTown;

export const getStaticProps = withStaticBase(async (context) => {
  const factionType = context.params!.faction as string;
  const faction = getFaction(factionType, context.locale!);
  if (!faction) {
    return {
      notFound: true,
    };
  }
  const factionBuildings = getBuildings(context.locale!)
    .filter(building => (building.factionName === faction.name))
    .map(building => getBuilding(building.type, context.locale!));
  const townData = createTownData(factionBuildings as BuildingDTO[]);

  const nameToBuilding: { [key: string]: BuildingDTO } = {};
  factionBuildings.forEach((building) => {
    if (!building) { return; }
    nameToBuilding[building.name] = building;
  });

  const terms: TermsDTO = {};
  return {
    props: {
      faction,
      nameToBuilding,
      townData,
      terms,
    },
    revalidate: false,
  };
});

export const getStaticPaths: GetStaticPaths = async () => {
  const factions = getFactions("en")
    .filter((faction) => (faction.type !== "Neutral"))
    .map((faction) => ({
      params: {
        faction: faction.type,
      },
    }));

  return {
    paths: factions,
    fallback: "blocking",
  };
};
