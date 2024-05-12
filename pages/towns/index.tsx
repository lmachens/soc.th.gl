import { NextPage } from "next";
import { withStaticBase } from "../../lib/staticProps";

import { Grid, Image, Stack, Text, Title } from "@mantine/core";
import AppLink from "../../components/AppLink/AppLink";
import PageHead from "../../components/PageHead/PageHead";
import { FactionSimpleDTO, getFactions } from "../../lib/factions";

const Factions: NextPage<{ factions: FactionSimpleDTO[] }> = ({ factions }) => {
  return (
    <>
      <PageHead
        title="Town Builds - SoC.th.gl"
        description="Town build calculators for each faction from Songs of Conquest."
      />
      <Title>Town Build Calculators</Title>
      <Grid justify="center" mt="md">
        {factions.map((faction) => (
          <Grid.Col key={faction.type} lg={3} md={3} sm={6} xs={6} span={6}>
            <AppLink href={`/towns/${faction.type}`}>
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
    </>
  );
};

export default Factions;

export const getStaticProps = withStaticBase(async (context) => {
  const factions = getFactions(context.locale!).filter(
    (faction) => faction.symbolSprite
  );

  return {
    props: {
      factions,
      terms: {},
    },
    revalidate: false,
  };
});
