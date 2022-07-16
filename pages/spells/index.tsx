import { NextPage } from "next";
import { withStaticBase } from "../../lib/staticProps";

import { SimpleGrid } from "@mantine/core";
import SpriteSheet from "../../components/SpriteSheet/SpriteSheet";
import Article from "../../components/Article/Article";
import { getSpells, SpellSimpleDTO } from "../../lib/spells";
import PageHead from "../../components/PageHead/PageHead";

const Spells: NextPage<{ spells: SpellSimpleDTO[] }> = ({ spells }) => {
  return (
    <>
      <PageHead
        title="Spells - SoC.gg"
        description="All spells of Songs of Conquest"
      />
      <SimpleGrid
        breakpoints={[
          { minWidth: "sm", cols: 1 },
          { minWidth: "md", cols: 2 },
          { minWidth: "lg", cols: 3 },
        ]}
      >
        {spells.map((spell) => (
          <Article
            key={spell.type}
            image={<SpriteSheet spriteSheet={spell.icon} folder="spells" />}
            name={spell.name}
            description={spell.description}
            href={`/spells/${spell.type}`}
          />
        ))}
      </SimpleGrid>
    </>
  );
};

export default Spells;

export const getStaticProps = withStaticBase(async (context) => {
  const spells = getSpells(context.locale!);

  return {
    props: {
      spells,
      terms: {},
    },
    revalidate: false,
  };
});
