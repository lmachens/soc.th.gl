import { NextPage } from "next";
import Head from "next/head";
import { withStaticBase } from "../../lib/staticProps";

import { Divider, Grid, Image, Stack, Text } from "@mantine/core";
import SpriteSheet from "../../components/SpriteSheet/SpriteSheet";
import { FactionSimpleDTO, getFactions } from "../../lib/factions";
import AppLink from "../../components/AppLink/AppLink";
import Article from "../../components/Article/Article";

const Factions: NextPage<{ factions: FactionSimpleDTO[] }> = ({ factions }) => {
  return (
    <>
      <Head>
        <title>Factions - SoC.gg</title>
        <meta name="description" content="All factions of Songs of Conquest" />
      </Head>
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

      <Stack>
        {factions.map((faction) => (
          <Article
            key={faction.type}
            image={<SpriteSheet spriteSheet={faction.symbolSprite} />}
            name={faction.name}
            description={faction.description}
            href={`/factions/${faction.type}`}
          />
        ))}
      </Stack>
    </>
  );
};

export default Factions;

export const getStaticProps = withStaticBase(async (context) => {
  const factions = getFactions(context.locale!);

  return {
    props: {
      factions,
    },
    revalidate: false,
  };
});
