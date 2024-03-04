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
  createTownData
} from "../../lib/towns";

import { TownGraph } from "./components/TownGraph";
import { ReactFlowProvider } from "reactflow";
import { AvailableTroops } from "./components/AvailableTroops";
import { UnitSimpleDTO, getUnits } from "../../lib/units";


const FactionTown: NextPage<{
  faction: FactionDTO,
  nameToBuilding: { [key: string]: BuildingDTO },
  townData: TownDataPlain,
  units: UnitSimpleDTO[],
}> = ({
  faction,
  nameToBuilding,
  townData,
  units,
}) => {
    return (
      <>
        <PageHead
          title={`${faction.name} Town Build - SoC.gg`}
          description={`Town build calculator for the ${faction.name} faction from Songs of Conquest.`}
        />
        <Container>
          <Title>{faction.name} Town Build</Title>
          <Title order={3}>Available Troops</Title>
          <AvailableTroops
            units={units}
          />
          <Title order={3}>Town Buildings</Title>
          <ReactFlowProvider>
            <TownGraph
              nameToBuilding={nameToBuilding}
              townData={townData}
            />
          </ReactFlowProvider>
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

  const units = getUnits(context.locale!);
  const factionUnits = units
    .filter(unit => (unit.faction === factionType))
    .filter(unit => (kExcludedUnitNames.indexOf(unit.vanilla.name) === -1));

  const terms: TermsDTO = {};
  return {
    props: {
      faction,
      nameToBuilding,
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
