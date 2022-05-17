import { GetStaticPaths, NextPage } from "next";
import { withStaticBase } from "../../lib/staticProps";

import { Stack, Text, Title } from "@mantine/core";
import SpriteSheet from "../../components/SpriteSheet/SpriteSheet";
import { getUnit, getUnits, UnitDTO } from "../../lib/units";

const Unit: NextPage<{ unit: UnitDTO }> = ({ unit }) => {
  return (
    <Stack>
      <Title order={4}>{unit.vanilla.name}</Title>
      <SpriteSheet spriteSheet={unit.vanilla.sprite} />
      <Text size="sm">{unit.vanilla.description}</Text>
    </Stack>
  );
};

export default Unit;

export const getStaticProps = withStaticBase(async (context) => {
  const type = context.params!.type as string;
  const unit = getUnit(type, context.locale!);
  if (!unit) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      unit,
    },
    revalidate: false,
  };
});

export const getStaticPaths: GetStaticPaths = async () => {
  const units = getUnits("en").map((unit) => ({
    params: {
      type: unit.vanilla.languageKey,
    },
  }));

  return {
    paths: units,
    fallback: "blocking",
  };
};
