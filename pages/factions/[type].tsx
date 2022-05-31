import { GetStaticPaths, NextPage } from "next";
import { withStaticBase } from "../../lib/staticProps";

import { Group, Image, Stack, Text, Title, SimpleGrid } from "@mantine/core";
import SpriteSheet from "../../components/SpriteSheet/SpriteSheet";
import { getTerm, TermsDTO } from "../../lib/terms";
import { FactionDTO, getFaction, getFactions } from "../../lib/factions";
import Head from "next/head";
import Article from "../../components/Article/Article";

const Faction: NextPage<{ faction: FactionDTO; terms: TermsDTO }> = ({
  faction,
  terms,
}) => {
  return (
    <>
      <Head>
        <title>{faction.name} - SoC.gg</title>
        <meta name="description" content={faction.description} />
      </Head>
      <Stack>
        <Image
          src={`/factions/${faction.type}AnimatedFactionBanner.gif`}
          height={200}
          fit="contain"
          alt=""
        />

        <Stack>
          <Title order={2}>{faction.name}</Title>
          <Text size="sm">{faction.description}</Text>
        </Stack>

        <Title order={2}>{terms.wielders}</Title>
        <SimpleGrid
          breakpoints={[
            { minWidth: 'sm', cols: 1 },
            { minWidth: 'md', cols: 2 },
            { minWidth: 'lg', cols: 3 },
          ]}
        >
          {faction.commanders.map((commander) => (
            <Article
              key={commander.type}
              image={
                <SpriteSheet
                  spriteSheet={commander.portrait}
                  folder="wielders"
                  resize={0.5}
                />
              }
              name={commander.name}
              description={commander.description}
              href={`/wielders/${commander.type}`}
            >
              <Group>
                <Text color="dimmed" size="sm">
                  {terms.offense}{" "}
                  <Text component="span" color="gray" size="sm">
                    {commander.stats.offense}
                  </Text>
                </Text>
                <Text color="dimmed" size="sm">
                  {terms.defense}{" "}
                  <Text component="span" color="gray" size="sm">
                    {commander.stats.defense}
                  </Text>
                </Text>
                <Text color="dimmed" size="sm">
                  {terms.movement}{" "}
                  <Text component="span" color="gray" size="sm">
                    {commander.stats.movement}
                  </Text>
                </Text>
                <Text color="dimmed" size="sm">
                  {terms.viewRadius}{" "}
                  <Text component="span" color="gray" size="sm">
                    {commander.stats.viewRadius}
                  </Text>
                </Text>
              </Group>
            </Article>
          ))}
        </SimpleGrid>
        <Title order={2}>{terms.units}</Title>

        <SimpleGrid
          breakpoints={[
            { minWidth: 'sm', cols: 1 },
            { minWidth: 'md', cols: 2 },
            { minWidth: 'lg', cols: 3 },
          ]}
        >
          {faction.units.map((unit) => (
            <Article
              key={unit.vanilla.languageKey}
              image={<SpriteSheet spriteSheet={unit.vanilla.sprite} />}
              name={unit.vanilla.name}
              description={unit.vanilla.description}
              href={`/units/${faction.type}/${unit.vanilla.languageKey}`}
            />
          ))}
        </SimpleGrid>
      </Stack>
    </>
  );
};

export default Faction;

export const getStaticProps = withStaticBase(async (context) => {
  const type = context.params!.type as string;
  const locale = context.locale! as string;
  const faction = getFaction(type, context.locale!);
  if (!faction) {
    return {
      notFound: true,
    };
  }
  const terms: TermsDTO = {
    wielders: getTerm("Common/Wielders", locale),
    units: getTerm("Tutorial/CodexCategory/Units", locale),
    offense: getTerm("Commanders/Details/CommanderStat/Offense", locale),
    defense: getTerm("Commanders/Details/CommanderStat/Defense", locale),
    movement: getTerm("Commanders/Details/CommanderStat/Movement", locale),
    viewRadius: getTerm("Commanders/Details/CommanderStat/View", locale),
  };

  return {
    props: {
      faction,
      terms,
    },
    revalidate: false,
  };
});

export const getStaticPaths: GetStaticPaths = async () => {
  const factions = getFactions("en")
    .filter((faction) => faction.symbolSprite)
    .map((faction) => ({
      params: {
        type: faction.type,
      },
    }));

  return {
    paths: factions,
    fallback: "blocking",
  };
};
