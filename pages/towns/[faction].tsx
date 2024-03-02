import {
  Container,
  Title,
} from "@mantine/core";
import { GetStaticPaths, NextPage } from "next";
import { withStaticBase } from "../../lib/staticProps";

import PageHead from "../../components/PageHead/PageHead";
import { FactionDTO, getFaction, getFactions } from "../../lib/factions";
import { TermsDTO } from "../../lib/terms";
import { createTownComponents } from "../../lib/towns";
import { BuildingDTO, getBuilding, getBuildings } from "../../lib/buildings";

const FactionTown: NextPage<{
  faction: FactionDTO
}> = ({
  faction
}) => {
    return (
      <>
        <PageHead
          title={`${faction.name} Town Build - SoC.gg`}
          description={`Town build calculator for the ${faction.name} faction from Songs of Conquest.`}
        />
        <Container>
          <Title>{faction.name} Town Build</Title>
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
  const components = createTownComponents(factionBuildings as BuildingDTO[]);
  console.log(components);

  const terms: TermsDTO = {};
  return {
    props: {
      faction,
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
