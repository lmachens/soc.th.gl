import {
  Container,
  Title,
} from "@mantine/core";
import { GetStaticPaths, NextPage } from "next";
import { withStaticBase } from "../../lib/staticProps";

import PageHead from "../../components/PageHead/PageHead";
import { BuildingDTO, getBuilding, getBuildings } from "../../lib/buildings";
import { FactionDTO, getFaction, getFactions } from "../../lib/factions";
import { TermsDTO } from "../../lib/terms";
import {
  kExcludedUnitNames,
  TownDataPlain,
  createTownData,
  getNodeKey
} from "../../lib/towns";

import TownGraph from "./components/TownGraph";
import { ReactFlowProvider } from "reactflow";
import AvailableTroops from "./components/AvailableTroops";
import { UnitSimpleDTO, getUnits } from "../../lib/units";
import TownGraphStoreProvider from "./components/TownGraphStoreProvider";
import { computeInitialGraphData } from "./store";
import { useMemo } from "react";


const FactionTown: NextPage<{
  faction: FactionDTO,
  nameToBuilding: { [key: string]: BuildingDTO },
  unitKeyToBuildingKey: { [key: string]: string },
  townData: TownDataPlain,
  units: UnitSimpleDTO[],
}> = ({
  faction,
  unitKeyToBuildingKey,
  nameToBuilding,
  townData,
  units,
}) => {
  const { initialNodes, initialEdges } = useMemo(
    () => computeInitialGraphData(nameToBuilding, townData.components),
    [
      townData.components,
      nameToBuilding,
    ]
  );
  return (
    <TownGraphStoreProvider
      initialNodes={initialNodes}
      initialEdges={initialEdges}
      keyToNode={townData.keyToNode}
    >
      <PageHead
        title={`${faction.name} Town Build - SoC.gg`}
        description={`Town build calculator for the ${faction.name} faction from Songs of Conquest.`}
      />
      <Container>
        <Title order={1} style={{
          marginBottom: '0.5em'
        }}>
          {faction.name} Town Build
        </Title>
        <Title order={2} style={{
          marginTop: '1em',
          marginBottom: '0.5em',
        }}>
          Available Troops
        </Title>
        <AvailableTroops
          units={units}
          unitKeyToBuildingKey={unitKeyToBuildingKey}
        />
        <Title order={2} style={{
          marginTop: '1.5em',
          marginBottom: '1.5em',
        }}>
          Town Buildings
        </Title>
        <ReactFlowProvider>
          <TownGraph
            townData={townData}
          />
        </ReactFlowProvider>
      </Container>
    </TownGraphStoreProvider>
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
  const unitKeyToBuildingKey: { [key: string]: string } = {};
  factionBuildings.forEach((building) => {
    if (!building) { return; }
    nameToBuilding[building.name] = building;
    building.incomePerLevel?.forEach((income) => {
      income?.troopIncomes?.forEach((troopIncome) => {
        unitKeyToBuildingKey[troopIncome.unitKey] = getNodeKey(
          building.name, income.level);
      });
    });
  });

  const units = getUnits(context.locale!);
  const factionUnits = units
    .filter(unit => (unit.faction === factionType))
    .filter(unit => (kExcludedUnitNames.indexOf(unit.vanilla.name) === -1));

  const terms: TermsDTO = {};
  return {
    props: {
      faction,
      nameToBuilding,
      unitKeyToBuildingKey,
      townData,
      units: factionUnits,
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
