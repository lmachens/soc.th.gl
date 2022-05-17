import { NextPage } from "next";
import { withStaticBase } from "../../lib/staticProps";

import { Grid, Text, Title } from "@mantine/core";
import SpriteSheet from "../../components/SpriteSheet/SpriteSheet";
import PopoverLink from "../../components/PopoverLink/PopoverLink";
import { getWielders, WielderSimpleDTO } from "../../lib/wielders";

const Wielders: NextPage<{ wielders: WielderSimpleDTO[] }> = ({ wielders }) => {
  return (
    <Grid justify="center" mt="md">
      {wielders.map((wielder) => (
        <Grid.Col key={wielder.type} sx={{ flexBasis: "auto" }}>
          <PopoverLink
            href={`/wielders/${wielder.type}`}
            popover={
              <>
                <Title order={4}>{wielder.name}</Title>
                <Text size="sm">{wielder.description}</Text>
              </>
            }
          >
            <SpriteSheet spriteSheet={wielder.portrait} />
          </PopoverLink>
        </Grid.Col>
      ))}
    </Grid>
  );
};

export default Wielders;

export const getStaticProps = withStaticBase(async (context) => {
  const wielders = getWielders(context.locale!);

  return {
    props: {
      wielders,
    },
    revalidate: false,
  };
});
