import { NextPage } from "next";
import { withStaticBase } from "../../lib/staticProps";

import { Divider, Grid, Image, Stack, SimpleGrid, Text } from "@mantine/core";
import SpriteSheet from "../../components/SpriteSheet/SpriteSheet";
import { FactionSimpleDTO, getFactions } from "../../lib/factions";
import AppLink from "../../components/AppLink/AppLink";
import Article from "../../components/Article/Article";
import PageHead from "../../components/PageHead/PageHead";

const Factions: NextPage<{ factions: FactionSimpleDTO[] }> = ({ factions }) => {
  return (
    <>
      <PageHead
        title="Factions - SoC.gg"
        description="All factions of Songs of Conquest"
      />
      <Grid justify="center" mt="md">
        {factions.map((faction) => (
          <Grid.Col key={faction.type} lg={3} md={3} sm={6} xs={6} span={6}>
            <AppLink href={`/factions/${faction.type}`}>
              <Stack align="center">
                <Image
                  src={`/factions/${faction.type}AnimatedFactionBanner.gif`}
                  height={200}
                  fit="contain"
                  alt=""
                />
                <Text>{faction.name}</Text>
              </Stack>
            </AppLink>
          </Grid.Col>
        ))}
      </Grid>
      <Divider my="md" />

      <SimpleGrid
        breakpoints={[
          { minWidth: "sm", cols: 1 },
          { minWidth: "md", cols: 2 },
        ]}
      >
        {factions.map((faction) => (
          <Article
            key={faction.type}
            image={<SpriteSheet spriteSheet={faction.symbolSprite} />}
            name={faction.name}
            description={faction.description}
            href={`/factions/${faction.type}`}
          />
        ))}
      </SimpleGrid>
    </>
  );
};

export default Factions;

export const getStaticProps = withStaticBase(async (context) => {
  const factions = getFactions(context.locale!);

  return {
    props: {
      factions,
      terms: {},
    },
    revalidate: false,
  };
});
