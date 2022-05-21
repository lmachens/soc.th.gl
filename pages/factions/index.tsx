import { NextPage } from "next";
import Head from "next/head";
import { withStaticBase } from "../../lib/staticProps";

import { Box, Divider, Grid, Image, Stack, Text, Title } from "@mantine/core";
import SpriteSheet from "../../components/SpriteSheet/SpriteSheet";
import { FactionSimpleDTO, getFactions } from "../../lib/factions";
import { MilestoneIcon } from "@primer/octicons-react";
import AppLink from "../../components/AppLink/AppLink";

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
          <Box
            component="article"
            key={faction.type}
            sx={(theme) => ({
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: theme.spacing.lg,
              [theme.fn.smallerThan("sm")]: {
                gridTemplateColumns: "auto",
                justifyItems: "center",
              },
            })}
          >
            <SpriteSheet spriteSheet={faction.symbolSprite} />
            <Stack>
              <Title order={2}>{faction.name}</Title>
              <Text size="sm">{faction.description}</Text>
              <AppLink href={`/factions/${faction.type}`}>
                <MilestoneIcon /> Learn more
              </AppLink>
            </Stack>
          </Box>
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
