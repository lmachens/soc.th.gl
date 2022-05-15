import { NextPage } from "next";
import { withStaticBase } from "../../lib/staticProps";
import factionCollection from "../../lib/collections/faction.json";

import { Grid, Text, Title } from "@mantine/core";
import SpriteSheet from "../../components/SpriteSheet/SpriteSheet";
import PopoverLink from "../../components/PopoverLink/PopoverLink";
import { getTerm } from "../../lib/terms";

const Factions: NextPage<{ factions: any[] }> = ({ factions }) => {
  return (
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
            <SpriteSheet spriteSheet={faction.symbolSprite} />
          </PopoverLink>
        </Grid.Col>
      ))}
    </Grid>
  );
};

export default Factions;

export const getStaticProps = withStaticBase(async (context) => {
  const factions = factionCollection
    .filter((faction) => faction.symbolSprite)
    .map((faction) => ({
      type: faction.type,
      name: getTerm(`Factions/${faction.languageKey}/Name`, context.locale!),
      description: getTerm(
        `Factions/${faction.languageKey}/Description`,
        context.locale!
      ),
      symbolSprite: faction.symbolSprite || null,
    }));
  return {
    props: {
      factions,
    },
    revalidate: false,
  };
});
