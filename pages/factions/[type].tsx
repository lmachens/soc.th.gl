import { GetStaticPaths, NextPage } from "next";
import { withStaticBase } from "../../lib/staticProps";
import factionCollection from "../../lib/collections/faction.json";

import { Grid, Stack, Text, Title } from "@mantine/core";
import SpriteSheet from "../../components/SpriteSheet/SpriteSheet";
import { getTerm } from "../../lib/terms";

const Faction: NextPage<{ faction: any }> = ({ faction }) => {
  return (
    <Stack>
      <Title order={4}>{faction.name}</Title>
      <SpriteSheet spriteSheet={faction.bannerSprite} />
      <SpriteSheet spriteSheet={faction.symbolSprite} />
      <Text size="sm">{faction.description}</Text>
      <Title order={5}>Commanders</Title>
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
  const type = context.params!.type;

  const faction = factionCollection.find((faction) => faction.type === type);
  if (!faction) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      faction: {
        type: faction.type,
        name: getTerm(`Factions/${faction.languageKey}/Name`, context.locale!),
        description: getTerm(
          `Factions/${faction.languageKey}/Description`,
          context.locale!
        ),
        bannerSprite: faction.bannerSprite || null,
        symbolSprite: faction.symbolSprite || null,
        commanders: faction.commanders.map((commander) => ({
          id: commander.id,
          portrait: commander.portrait,
          type: commander.type,
        })),
      },
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
