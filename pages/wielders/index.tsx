import { NextPage } from "next";
import { withStaticBase } from "../../lib/staticProps";
import { Group, Select, SimpleGrid } from "@mantine/core";
import SpriteSheet from "../../components/SpriteSheet/SpriteSheet";
import { getWielders, WielderSimpleDTO } from "../../lib/wielders";
import Head from "next/head";
import Article from "../../components/Article/Article";
import { getWielderStatsIcons, IconsDTO } from "../../lib/icons";
import { useState } from "react";
import { getSiteTerm, getTerm } from "../../lib/terms";
import { useTerms } from "../../components/Terms/Terms";

const SORT_BY = ["name", "offense", "defense", "movement", "viewRadius"];
const sortHandle =
  (sortBy: string) => (a: WielderSimpleDTO, b: WielderSimpleDTO) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "offense":
        return b.stats.offense - a.stats.offense;
      case "defense":
        return b.stats.defense - a.stats.defense;
      case "movement":
        return b.stats.movement - a.stats.movement;
      case "viewRadius":
        return b.stats.viewRadius - a.stats.viewRadius;
    }
    return 0;
  };

const Wielders: NextPage<{ wielders: WielderSimpleDTO[]; icons: IconsDTO }> = ({
  wielders,
  icons,
}) => {
  const terms = useTerms();
  const [sortBy, setSortBy] = useState(SORT_BY[0]);

  const sortedWielders = wielders.sort(sortHandle(sortBy));

  return (
    <>
      <Head>
        <title>Wielders - SoC.gg</title>
        <meta name="description" content="All wielders of Songs of Conquest" />
      </Head>
      <Select
        label={terms.sortBy}
        value={sortBy}
        onChange={(value) => setSortBy(value || SORT_BY[0])}
        data={SORT_BY.map((sortBy) => ({
          value: sortBy,
          label: terms[sortBy],
        }))}
        sx={{
          maxWidth: 200,
        }}
        mb="lg"
      />
      <SimpleGrid
        breakpoints={[
          { minWidth: "sm", cols: 1 },
          { minWidth: "md", cols: 2 },
          { minWidth: "lg", cols: 3 },
        ]}
      >
        {sortedWielders.map((wielder) => (
          <Article
            key={wielder.type}
            image={
              <SpriteSheet
                spriteSheet={wielder.portrait}
                folder="wielders"
                resize={0.5}
              />
            }
            name={wielder.name}
            subtitle={wielder.factionName}
            description={wielder.description}
            href={`/wielders/${wielder.type}`}
          >
            <Group>
              <Group spacing={0}>
                <SpriteSheet
                  spriteSheet={icons.StatsOffenceRendered}
                  folder="icons"
                  resize={0.5}
                  inline
                />
                {wielder.stats.offense.toString()}
              </Group>
              <Group spacing={0}>
                <SpriteSheet
                  spriteSheet={icons.StatsDefenseRendered}
                  folder="icons"
                  resize={0.5}
                  inline
                />
                {wielder.stats.defense.toString()}
              </Group>
              <Group spacing={0}>
                <SpriteSheet
                  spriteSheet={icons.StatsMovementRendered}
                  folder="icons"
                  resize={0.5}
                  inline
                />
                {wielder.stats.movement.toString()}
              </Group>
              <Group spacing={0}>
                <SpriteSheet
                  spriteSheet={icons.StatsViewRendered}
                  folder="icons"
                  resize={0.5}
                  inline
                />
                {wielder.stats.viewRadius.toString()}
              </Group>
            </Group>
          </Article>
        ))}
      </SimpleGrid>
    </>
  );
};

export default Wielders;

export const getStaticProps = withStaticBase(async (context) => {
  const locale = context.locale!;

  const wielders = getWielders(context.locale!);
  const icons = getWielderStatsIcons();
  const terms = {
    sortBy: getSiteTerm("SortBy", locale),
    name: getTerm("Common/Name", locale),
    offense: getTerm("Commanders/Details/CommanderStat/Offense", locale),
    defense: getTerm("Commanders/Details/CommanderStat/Defense", locale),
    movement: getTerm("Commanders/Details/CommanderStat/Movement", locale),
    viewRadius: getTerm("Commanders/Details/CommanderStat/View", locale),
  };

  return {
    props: {
      wielders,
      icons,
      terms,
    },
    revalidate: false,
  };
});
