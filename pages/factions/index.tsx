import { NextPage } from "next";
import Head from "next/head";
import { withStaticBase } from "../../lib/staticProps";

import { Grid, Text, Title } from "@mantine/core";
import SpriteSheet from "../../components/SpriteSheet/SpriteSheet";
import PopoverLink from "../../components/PopoverLink/PopoverLink";
import { FactionSimpleDTO, getFactions } from "../../lib/factions";

const Factions: NextPage<{ factions: FactionSimpleDTO[] }> = ({ factions }) => {
  return (
    <>
      <Head>
        <title>Factions - SoC.gg</title>
        <meta name="description" content="All factions of Songs of Conquest" />
      </Head>
      <Grid justify="center" mt="md">
        {factions.map((faction) => (
          <Grid.Col key={faction.type} sx={{ flexBasis: "auto" }}>
            <PopoverLink
              href={`/factions/${faction.type}`}
              popover={
                <>
                  <Title order={4}>{faction.name}</Title>
                  <Text size="sm">{faction.description}</Text>
                </>
              }
            >
              <SpriteSheet spriteSheet={faction.bannerSprite} />
            </PopoverLink>
          </Grid.Col>
        ))}
      </Grid>
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
