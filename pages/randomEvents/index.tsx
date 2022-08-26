import { NextPage } from "next";
import { withStaticBase } from "../../lib/staticProps";

import { SimpleGrid } from "@mantine/core";
import Article from "../../components/Article/Article";
import { RandomEventSimpleDTO, getRandomEvents } from "../../lib/randomEvents";
import PageHead from "../../components/PageHead/PageHead";

const SORT_BY = ["name"];
const sortHandle =
  (sortBy: string) => (a: RandomEventSimpleDTO, b: RandomEventSimpleDTO) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
    }
    return 0;
  };

const RandomEvents: NextPage<{ randomEvents: RandomEventSimpleDTO[] }> = ({
  randomEvents,
}) => {
  const sortedRandomEvents = randomEvents.sort(sortHandle(SORT_BY[0]));

  return (
    <>
      <PageHead
        title="Random Events - SoC.gg"
        description="All Random Events in Songs of Conquest"
      />
      <SimpleGrid
        breakpoints={[
          { minWidth: "sm", cols: 1 },
          { minWidth: "md", cols: 2 },
          { minWidth: "lg", cols: 3 },
        ]}
      >
        {sortedRandomEvents.map((randomEvent) => (
          <Article
            // key={building.type}
            name={randomEvent.name}
            subtitle={randomEvent.faction}
            description={randomEvent.description}
            href={`/randomEvents/${randomEvent.uniqueName}`}
          />
        ))}
      </SimpleGrid>
    </>
  );
};

export default RandomEvents;

export const getStaticProps = withStaticBase(async (context) => {
  const randomEvents = getRandomEvents(context.locale!);

  return {
    props: {
      randomEvents,
      terms: {},
    },
    revalidate: false,
  };
});
