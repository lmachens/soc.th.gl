import { GetStaticPaths, NextPage } from "next";
import { withStaticBase } from "../../lib/staticProps";

import { Group, Image, Stack, Text, Title, SimpleGrid } from "@mantine/core";
import SpriteSheet from "../../components/SpriteSheet/SpriteSheet";
import { getSiteTerm, getTerm, TermsDTO } from "../../lib/terms";
import { FactionDTO, getFaction, getFactions } from "../../lib/factions";
import Article from "../../components/Article/Article";
import { useTerms } from "../../components/Terms/Terms";
import PageHead from "../../components/PageHead/PageHead";

const Faction: NextPage<{ faction: FactionDTO }> = ({ faction }) => {
  const terms = useTerms();
  return (
    <>
      <PageHead
        title={`${faction.name} - SoC.th.gl`}
        description={`${faction.description} - ${faction.name} (Songs of Conquest)`}
      />
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
            { minWidth: "sm", cols: 1 },
            { minWidth: "md", cols: 2 },
            { minWidth: "lg", cols: 3 },
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
              href={`/wielders/${commander.type}`}
            >
              <Group>
                {["offense", "defense", "movement", "viewRadius"].map(
                  (identifier) => (
                    <Text key={identifier} color="dimmed" size="sm">
                      {terms[identifier]}{" "}
                      <Text
                        component="span"
                        size="sm"
                        sx={(theme) => ({
                          color: theme.colors.gray[3],
                        })}
                      >
                        {
                          commander.stats[
                            identifier as keyof (typeof commander)["stats"]
                          ]
                        }
                      </Text>
                    </Text>
                  )
                )}
              </Group>
            </Article>
          ))}
        </SimpleGrid>
        <Title order={2}>{terms.units}</Title>

        <SimpleGrid
          breakpoints={[
            { minWidth: "sm", cols: 1 },
            { minWidth: "md", cols: 2 },
            { minWidth: "lg", cols: 3 },
          ]}
        >
          {faction.units.map((unit) => (
            <Article
              key={unit.vanilla.languageKey}
              image={
                <SpriteSheet spriteSheet={unit.vanilla.sprite} folder="units" />
              }
              name={unit.vanilla.name}
              href={`/units/${faction.type}/${unit.vanilla.languageKey}`}
            >
              <Group>
                <Text color="dimmed" size="sm">
                  {terms.damage}{" "}
                  <Text
                    component="span"
                    size="sm"
                    sx={(theme) => ({
                      color: theme.colors.gray[3],
                    })}
                  >
                    {unit.vanilla.stats.damage.min}-
                    {unit.vanilla.stats.damage.max}
                  </Text>
                </Text>
                <Text color="dimmed" size="sm">
                  {terms.health}{" "}
                  <Text
                    component="span"
                    size="sm"
                    sx={(theme) => ({
                      color: theme.colors.gray[3],
                    })}
                  >
                    {unit.vanilla.stats.health}
                  </Text>
                </Text>
                <Text color="dimmed" size="sm">
                  {terms.movement}{" "}
                  <Text
                    component="span"
                    size="sm"
                    sx={(theme) => ({
                      color: theme.colors.gray[3],
                    })}
                  >
                    {unit.vanilla.stats.movement}
                  </Text>
                </Text>
              </Group>
            </Article>
          ))}
        </SimpleGrid>

        <Title order={2}>{terms.buildings}</Title>

        <SimpleGrid
          breakpoints={[
            { minWidth: "sm", cols: 1 },
            { minWidth: "md", cols: 2 },
            { minWidth: "lg", cols: 3 },
          ]}
        >
          {faction.buildings.map((building) => (
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
    buildings: getSiteTerm("Buildings", locale),
    damage: getTerm("Units/Tooltip/Damage", locale),
    health: getTerm("Units/Tooltip/Health", locale),
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
