import { NextPage } from "next";
import { withStaticBase } from "../../lib/staticProps";

import { SimpleGrid } from "@mantine/core";
import SpriteSheet from "../../components/SpriteSheet/SpriteSheet";
import Article from "../../components/Article/Article";
import { BuildingSimpleDTO, getBuildings } from "../../lib/buildings";
import PageHead from "../../components/PageHead/PageHead";

const Buildings: NextPage<{ buildings: BuildingSimpleDTO[] }> = ({
  buildings,
}) => {
  return (
    <>
      <PageHead
        title="Buildings - SoC.gg"
        description="All buildings of Songs of Conquest"
      />
      <SimpleGrid
        breakpoints={[
          { minWidth: "sm", cols: 1 },
          { minWidth: "md", cols: 2 },
          { minWidth: "lg", cols: 3 },
        ]}
      >
        {buildings.map((building) => (
          <Article
            key={building.type}
            image={
              <SpriteSheet
                spriteSheet={building.portraits[0]}
                folder="buildings"
              />
            }
            name={building.name}
            description={building.description}
            href={`/buildings/${building.type}`}
          />
        ))}
      </SimpleGrid>
    </>
  );
};

export default Buildings;

export const getStaticProps = withStaticBase(async (context) => {
  const buildings = getBuildings(context.locale!);

  return {
    props: {
      buildings,
      terms: {},
    },
    revalidate: false,
  };
});
