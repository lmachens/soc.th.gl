import { GetStaticPaths, NextPage } from "next";
import { withStaticBase } from "../../lib/staticProps";
import factionCollection from "../../lib/collections/faction.json";

import { Grid, Stack, Text, Title } from "@mantine/core";
import SpriteSheet from "../../components/SpriteSheet/SpriteSheet";
import { getTerm, TermsDTO } from "../../lib/terms";
import { FactionDTO, getFaction } from "../../lib/factions";

const Faction: NextPage<{ faction: FactionDTO; terms: TermsDTO }> = ({
  faction,
  terms,
}) => {
  return (
    <Stack>
      <Title order={4}>{faction.name}</Title>
      <SpriteSheet spriteSheet={faction.bannerSprite} />
      <SpriteSheet spriteSheet={faction.symbolSprite} />
      <Text size="sm">{faction.description}</Text>
      <Title order={5}>{terms.wielders}</Title>
      <Grid justify="center" mt="md">
        {faction.commanders.map((commander: any) => (
          <Grid.Col key={commander.id} sx={{ flexBasis: "auto" }}>
            <SpriteSheet spriteSheet={commander.portrait} />
          </Grid.Col>
        ))}
      </Grid>
    </Stack>
  );
};

export default Faction;

export const getStaticProps = withStaticBase(async (context) => {
  const type = context.params!.type as string;
  const faction = getFaction(type, context.locale!);

  if (!faction) {
    return {
      notFound: true,
    };
  }

  const terms: TermsDTO = {
    wielders: getTerm("Common/Wielders", context.locale!),
  };

  return {
    props: {
      faction,
      terms,
    },
    revalidate: false,
  };
});

export const getStaticPaths: GetStaticPaths = async () => {
  const factions = factionCollection
    .filter((faction) => faction.symbolSprite)
    .map((faction) => ({
      params: {
        type: faction.type,
      },
    }));
  return {
    paths: factions,
    fallback: false,
  };
};
