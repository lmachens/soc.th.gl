import {
  Container,
  Title,
} from "@mantine/core";
import { GetStaticPaths, NextPage } from "next";
import { withStaticBase } from "../../lib/staticProps";

import PageHead from "../../components/PageHead/PageHead";
import { FactionDTO, getFaction, getFactions } from "../../lib/factions";
import { TermsDTO } from "../../lib/terms";
import { createTownComponents, ComponentPlain } from "../../lib/towns";
import { BuildingDTO, getBuilding, getBuildings } from "../../lib/buildings";

const TownComponent: React.FC<{
  component: ComponentPlain,
}> = ({
  component,
}) => {
  return (
    <div>
      {component.stacks.map(stack => (
        stack.nodes.map(node => (
          <div key={node.key}>{node.key}</div>
        ))
      )).flat()}
    </div>
  );
};

const FactionTown: NextPage<{
  faction: FactionDTO,
  components: ComponentPlain[],
}> = ({
  faction,
  components,
}) => {
  return (
    <>
      <PageHead
        title={`${faction.name} Town Build - SoC.gg`}
        description={`Town build calculator for the ${faction.name} faction from Songs of Conquest.`}
      />
      <Container>
        <Title>{faction.name} Town Build</Title>
        {components?.map(component => (
          <TownComponent
            key={component.id}
            component={component}
          />
        ))}
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

  const terms: TermsDTO = {};
  return {
    props: {
      faction,
      components: components.map(component => component.toPlain()),
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
