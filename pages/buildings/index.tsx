import { NextPage } from "next";
import { withStaticBase } from "../../lib/staticProps";

import { SimpleGrid } from "@mantine/core";
import SpriteSheet from "../../components/SpriteSheet/SpriteSheet";
import Article from "../../components/Article/Article";
import { BuildingSimpleDTO, getBuildings } from "../../lib/buildings";
import PageHead from "../../components/PageHead/PageHead";

const SORT_BY = ["name"];
const sortHandle =
  (sortBy: string) => (a: BuildingSimpleDTO, b: BuildingSimpleDTO) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
    }
    return 0;
  };

const Buildings: NextPage<{ buildings: BuildingSimpleDTO[] }> = ({
  buildings,
}) => {
  const sortedBuildings = buildings.sort(sortHandle(SORT_BY[0]));

  return (
    <>
      <PageHead
        title="Buildings - SoC.th.gl"
        description="All buildings of Songs of Conquest"
      />
      <SimpleGrid
        breakpoints={[
          { minWidth: "sm", cols: 1 },
          { minWidth: "md", cols: 2 },
          { minWidth: "lg", cols: 3 },
        ]}
      >
        {sortedBuildings.map((building) => (
          <Article
            key={building.type}
            image={
              <SpriteSheet
                spriteSheet={building.portraits[0]}
                folder="buildings"
              />
            }
            name={building.name}
            subtitle={building.factionName}
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
