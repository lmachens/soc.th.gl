import { NextPage } from "next";
import { withStaticBase } from "../../lib/staticProps";

import { Grid, Text, Title } from "@mantine/core";
import SpriteSheet from "../../components/SpriteSheet/SpriteSheet";
import PopoverLink from "../../components/PopoverLink/PopoverLink";
import { getUnits, UnitSimpleDTO } from "../../lib/units";

const Units: NextPage<{ units: UnitSimpleDTO[] }> = ({ units }) => {
  return (
    <Grid justify="center" mt="md">
      {units.map((unit) => (
        <Grid.Col key={unit.vanilla.languageKey} sx={{ flexBasis: "auto" }}>
          <PopoverLink
            href={`/factions/${unit.vanilla.languageKey}`}
            popover={
              <>
                <Title order={4}>{unit.vanilla.name}</Title>
                <Text size="sm">{unit.vanilla.description}</Text>
              </>
            }
          >
            <SpriteSheet spriteSheet={unit.vanilla.sprite} />
          </PopoverLink>
        </Grid.Col>
      ))}
    </Grid>
  );
};

export default Units;

export const getStaticProps = withStaticBase(async (context) => {
  const units = getUnits(context.locale!);

  return {
    props: {
      units,
    },
    revalidate: false,
  };
});
