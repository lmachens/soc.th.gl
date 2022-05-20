import { NextPage } from "next";
import Head from "next/head";
import { withStaticBase } from "../../lib/staticProps";

import {
  Anchor,
  Box,
  Divider,
  Grid,
  Image,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import SpriteSheet from "../../components/SpriteSheet/SpriteSheet";
import { FactionSimpleDTO, getFactions } from "../../lib/factions";
import Link from "next/link";
import { MilestoneIcon } from "@primer/octicons-react";

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
            <Stack align="center">
              <Image
                src={`/factions/${faction.type}AnimatedFactionBanner.gif`}
                height={200}
                fit="contain"
                alt=""
              />
              <Text>{faction.name}</Text>
            </Stack>
          </Grid.Col>
        ))}
      </Grid>
      <Divider my="md" />
      <Stack>
        {factions.map((faction) => (
          <Box
            key={faction.type}
            sx={(theme) => ({
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: theme.spacing.lg,
            })}
          >
            <SpriteSheet spriteSheet={faction.symbolSprite} />
            <Stack>
              <Title order={4}>{faction.name}</Title>
              <Text size="sm">{faction.description}</Text>
              <Link href={`/factions/${faction.type}`} passHref>
                <Anchor color="gray">
                  <MilestoneIcon /> Learn more
                </Anchor>
              </Link>
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
