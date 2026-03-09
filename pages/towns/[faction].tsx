import { Container, Text, Title } from "@mantine/core";
import { GetStaticPaths, NextPage } from "next";
import { withStaticBase } from "../../lib/staticProps";

import PageHead from "../../components/PageHead/PageHead";
import { BuildingDTO, getBuilding, getBuildings } from "../../lib/buildings";
import { FactionDTO, getFaction, getFactions } from "../../lib/factions";
import { TermsDTO, getSiteTerm, getTerm } from "../../lib/terms";
import {
  EXCLUDED_UNIT_NAMES,
  TownDataPlain,
  createTownData,
  getNodeKey,
} from "../../lib/towns";

import { ReactFlowProvider } from "reactflow";
import { UnitSimpleDTO, getUnits } from "../../lib/units";
import { useMemo } from "react";
import TownGraph from "../../components/Towns/TownGraph";
import { computeInitialGraphData } from "../../components/Towns/store";
import TownGraphStoreProvider from "../../components/Towns/TownGraphStoreProvider";
import AvailableTroops from "../../components/Towns/AvailableTroops";
import BuildOrder from "../../components/Towns/BuildOrder";
import { useTerms } from "../../components/Terms/Terms";
import { getIcon } from "../../lib/icons";
import { SpriteDTO } from "../../lib/sprites";

const FactionTown: NextPage<{
  faction: FactionDTO;
  nameToBuilding: { [key: string]: BuildingDTO };
  unitKeyToBuildingKey: { [key: string]: string };
  unitKeyToRequiredResearch: { [key: string]: number[] };
  townData: TownDataPlain;
  units: UnitSimpleDTO[];
  resourceIcons: { [localizedName: string]: SpriteDTO };
}> = ({
  faction,
  unitKeyToBuildingKey,
  unitKeyToRequiredResearch,
  nameToBuilding,
  townData,
  units,
  resourceIcons,
}) => {
  const terms = useTerms();
  const { initialNodes, initialEdges } = useMemo(
    () => computeInitialGraphData(nameToBuilding, townData.components),
    [townData.components, nameToBuilding]
  );
  return (
    <TownGraphStoreProvider
      initialNodes={initialNodes}
      initialEdges={initialEdges}
      keyToNode={townData.keyToNode}
    >
      <PageHead
        title={`${faction.name} Town Build - SoC.th.gl`}
        description={`Town build calculator for the ${faction.name} faction from Songs of Conquest.`}
      />
      <Container>
        <Title
          order={1}
          style={{
            marginBottom: "0.5em",
          }}
        >
          {faction.name} Town Build
        </Title>
        <Text component="p">{terms.townBuildDescription}</Text>
        <Title
          order={2}
          style={{
            marginTop: "1em",
            marginBottom: "0.5em",
          }}
        >
          Available Troops
        </Title>
        <AvailableTroops
          units={units}
          unitKeyToBuildingKey={unitKeyToBuildingKey}
          unitKeyToRequiredResearch={unitKeyToRequiredResearch}
        />
        <BuildOrder
          nameToBuilding={nameToBuilding}
          keyToNode={townData.keyToNode}
          resourceIcons={resourceIcons}
        />
        <Title
          order={2}
          style={{
            marginTop: "1.5em",
            marginBottom: "1.5em",
          }}
        >
          Town Buildings
        </Title>
        <ReactFlowProvider>
          <TownGraph townData={townData} />
        </ReactFlowProvider>
      </Container>
    </TownGraphStoreProvider>
  );
};

export default FactionTown;

export const getStaticProps = withStaticBase(async (context) => {
  const locale = context.locale! as string;
  const factionType = context.params!.faction as string;
  const faction = getFaction(factionType, locale);
  if (!faction) {
    return {
      notFound: true,
    };
  }
  const factionBuildings = getBuildings(locale)
    .filter((building) => building.factionName === faction.name)
    .map((building) => getBuilding(building.type, locale));
  if (factionBuildings.length === 0) {
    return { notFound: true };
  }
  const townData = createTownData(factionBuildings as BuildingDTO[]);

  const nameToBuilding: { [key: string]: BuildingDTO } = {};
  const unitKeyToBuildingKey: { [key: string]: string } = {};
  const unitKeyToRequiredResearch: { [key: string]: number[] } = {};
  factionBuildings.forEach((building) => {
    if (!building) {
      return;
    }
    nameToBuilding[building.name] = building;
    building.incomePerLevel?.forEach((income) => {
      income?.troopIncomes?.forEach((troopIncome) => {
        unitKeyToBuildingKey[troopIncome.unitKey] = getNodeKey(
          building.name,
          income.level
        );
        unitKeyToRequiredResearch[troopIncome.unitKey] =
          troopIncome.requiredResearch || [];
      });
    });
  });

  const units = getUnits(locale);
  const factionUnits = units
    .filter((unit) => unit.faction === factionType)
    .filter((unit) => EXCLUDED_UNIT_NAMES.indexOf(unit.vanilla.name) === -1);

  const RESOURCE_TYPE_TO_ICON_NAME: { [key: string]: string } = {
    Gold: "ResourceIconGold",
    Wood: "ResourceIconWood",
    Stone: "ResourceIconStone",
    Glimmerweave: "ResourceIconGlimmer",
    AncientAmber: "ResourceIconAmber",
    CelestialOre: "ResourceIconCelestialOre",
  };
  const resourceIcons: { [localizedName: string]: SpriteDTO } = {};
  Object.entries(RESOURCE_TYPE_TO_ICON_NAME).forEach(([rawType, iconName]) => {
    const localizedName = getTerm(`Common/Resource/${rawType}`, locale);
    const icon = getIcon(iconName);
    if (icon) {
      resourceIcons[localizedName] = icon;
    }
  });

  const terms: TermsDTO = {
    townBuildDescription: getSiteTerm("townBuildDescription", locale),
  };
  return {
    props: {
      faction,
      nameToBuilding,
      unitKeyToBuildingKey,
      unitKeyToRequiredResearch,
      townData,
      units: factionUnits,
      resourceIcons,
      terms,
    },
    revalidate: false,
  };
});

export const getStaticPaths: GetStaticPaths = async () => {
  const factions = getFactions("en") // Keep as "en" for routing.
    .filter((faction) => faction.type !== "Neutral" && faction.name)
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
