import { NextPage } from "next";
import { withStaticBase } from "../../lib/staticProps";

import { SimpleGrid } from "@mantine/core";
import SpriteSheet from "../../components/SpriteSheet/SpriteSheet";
import { getUnits, UnitSimpleDTO } from "../../lib/units";
import Head from "next/head";
import Article from "../../components/Article/Article";

const Units: NextPage<{ units: UnitSimpleDTO[] }> = ({ units }) => {
  return (
    <>
      <Head>
        <title>Units - SoC.gg</title>
        <meta name="description" content="All units of Songs of Conquest" />
      </Head>
      <SimpleGrid
        breakpoints={[
          { minWidth: "sm", cols: 1 },
          { minWidth: "md", cols: 2 },
          { minWidth: "lg", cols: 3 },
        ]}
      >
        {units.map((unit) => (
          <Article
            key={unit.vanilla.languageKey}
            image={<SpriteSheet spriteSheet={unit.vanilla.sprite} />}
            name={unit.vanilla.name}
            description={unit.vanilla.description}
            href={`/units/${unit.faction}/${unit.vanilla.languageKey}`}
          />
        ))}
      </SimpleGrid>
    </>
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
