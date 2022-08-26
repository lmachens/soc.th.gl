import { GetStaticPaths, NextPage } from "next";
import { withStaticBase } from "../../../lib/staticProps";

import { Box, Group, Stack, Table, Text, Title } from "@mantine/core";
import SpriteSheet from "../../../components/SpriteSheet/SpriteSheet";
import { getTerm, TermsDTO } from "../../../lib/terms";
import { RandomEventDTO, getRandomEvent, getRandomEvents } from "../../../lib/randomEvents";
import Lore from "../../../components/Lore/Lore";
import { useTerms } from "../../../components/Terms/Terms";
import AppLink from "../../../components/AppLink/AppLink";
import PageHead from "../../../components/PageHead/PageHead";
import Article from "../../../components/Article/Article";

const RandomEvent: NextPage<{ randomEvent: RandomEventDTO }> = ({ randomEvent }) => {
  const terms = useTerms();

  return (
    <>
      <PageHead
        title={`${randomEvent.name} - SoC.gg`}
        description={`${randomEvent.description} - ${randomEvent.name} (Songs of Conquest)`}
      />
      <Stack align="flex-start">
        <Group>
          {/* <SpriteSheet spriteSheet={randomEvent.portraits[0]} folder="randomEvents" /> */}
          <Stack spacing="xs">
            <Title order={2}>{randomEvent.name}</Title>
            {randomEvent.description && <Lore text={randomEvent.description} />}
          </Stack>
        </Group>
        {/* <Table>
          <tbody>
            <tr>
              <td>{terms.faction}</td>
              <td>{randomEvent.faction}</td>
            </tr>
            <tr>
              <td>{terms.cost}</td>
              <td>
                {randomEvent.requirements?.costEntries
                  .map((value) => `${value.amount} ${value.type}`)
                  .join(", ")}
                {randomEvent.levelUpgrades
                  ?.filter((levelUpgrade) => levelUpgrade.costEntries.length)
                  .map((levelUpgrade, index) => (
                    <div key={index + 2}>
                      <span>
                        {terms.level} {index + 2}:{" "}
                      </span>
                      {levelUpgrade.costEntries
                        .map((value) => `${value.amount} ${value.type}`)
                        .join(", ")}
                    </div>
                  ))}
              </td>
            </tr>
            <tr>
              <td>{terms.requiredBuildings}</td>
              <td>
                {randomEvent.requirements.requiredBuildings.length === 0 && "-"}
                {randomEvent.requirements.requiredBuildings.join(", ")}
                {randomEvent.levelUpgrades
                  ?.filter(
                    (levelUpgrade) => levelUpgrade.requiredBuildings.length
                  )
                  .map((levelUpgrade, index) => (
                    <div key={index + 2}>
                      <span>
                        {terms.level} {index + 2}:{" "}
                      </span>
                      {levelUpgrade.requiredBuildings.join(", ")}
                    </div>
                  ))}
              </td>
            </tr>
            <tr>
              <td>{terms.viewRadius}</td>
              <td>{randomEvent.baseViewRadius}</td>
            </tr>
            {randomEvent.incomePerLevel && (
              <tr>
                <td colSpan={2}>
                  <Text
                    sx={(theme) => ({
                      color: theme.colors[theme.primaryColor][5],
                    })}
                  >
                    {terms.income} / {terms.troopIncome}
                  </Text>
                </td>
              </tr>
            )}
            {randomEvent.incomePerLevel?.map((incomePerLevel) => (
              <tr key={incomePerLevel.level}>
                <td>
                  {terms.level} {incomePerLevel.level}
                </td>
                <td>
                  {incomePerLevel.resources.map((resource) => (
                    <Text key={resource.type} size="sm" mr="xs">
                      {resource.amount} {resource.type}
                    </Text>
                  ))}
                  {incomePerLevel.troopIncomes.map((troopIncome) => (
                    <AppLink
                      key={troopIncome.name}
                      href={`/units/${troopIncome.factionKey}/${troopIncome.unitKey}`}
                      mr="xs"
                    >
                      {troopIncome.size} {troopIncome.name}
                    </AppLink>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {randomEvent.stacks && (
          <>
            <Title order={3}>Research</Title>
            {randomEvent.stacks.map((stack) => (
              <Article
                key={stack.name}
                image={<SpriteSheet spriteSheet={stack.icon} folder="icons" />}
                name={stack.name}
                description={stack.description}
              >
                <Stack>
                  {stack.research.map((research, index) => (
                    <Box key={research.id}>
                      <Title order={4}>Level {index + 1}</Title>
                      <Text>
                        {terms.cost}:{" "}
                        <Text component="span">
                          {research.costEntries
                            .map((value) => `${value.amount} ${value.type}`)
                            .join(", ")}
                        </Text>
                      </Text>
                      <Text>
                        {research.bacterias.map((bacteria) => (
                          <Box key={bacteria.bacteriaType}>
                            {bacteria.modifierData.map((modifier) => (
                              <Text
                                key={modifier.type}
                                dangerouslySetInnerHTML={{
                                  __html: modifier.description,
                                }}
                              />
                            ))}
                            {bacteria.resourcesIncome.map((resourceIncome) => (
                              <Text key={resourceIncome.type}>
                                {`${terms.production} +${resourceIncome.amount} ${resourceIncome.name}`}
                              </Text>
                            ))}
                          </Box>
                        ))}
                      </Text>
                    </Box>
                  ))}
                </Stack>
              </Article>
            ))}
          </>
        )} */}
      </Stack>
    </>
  );
};

export default RandomEvent;

export const getStaticProps = withStaticBase(async (context) => {
  const locale = context.locale!;
  const faction = context.params!.faction as string;
  const name = context.params!.name as string;
  const randomEvent = getRandomEvent(`${faction}/${name}`, locale);
  if (!randomEvent) {
    return {
      notFound: true,
    };
  }

  const terms: TermsDTO = {
    // requirements: getTerm("Adventure/BuildMenu/Requirements", locale),
    // requiredBuildings: getTerm("Units/Tooltip/BuildingsThatProduce", locale),
    // cost: getTerm("Common/Resource/Cost", locale),
    // income: getTerm("Adventure/BuildMenu/Income", locale),
    // troopIncome: getTerm("Adventure/MapEntityHUD/TroopIncome/Header", locale),
    // level: getTerm("Common/Stats/Level/Header", locale),
    // viewRadius: getTerm("Commanders/Details/CommanderStat/View", locale),
    // faction: getTerm("Adventure/TeamQueueHUD/Faction", locale),
    // production: getTerm("Common/Details/GeneratesResources", locale),
  };

  return {
    props: {
      randomEvent,
      terms,
    },
    revalidate: false,
  };
});

export const getStaticPaths: GetStaticPaths = async () => {
  const randomEvents = getRandomEvents("en").map((randomEvent) => {
    const [faction, name] = randomEvent.uniqueName.split("/");
    return {
      params: {
        faction,
        name,
      },
    };
  });

  return {
    paths: randomEvents,
    fallback: "blocking",
  };
};
