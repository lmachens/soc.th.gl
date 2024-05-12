import { GetStaticPaths, NextPage } from "next";

import { Group, Stack, Table, Text, Title } from "@mantine/core";
import Lore from "../../../components/Lore/Lore";
import PageHead from "../../../components/PageHead/PageHead";
import { useTerms } from "../../../components/Terms/Terms";
import {
  RandomEventDTO,
  getRandomEvent,
  getRandomEvents,
} from "../../../lib/randomEvents";
import { withStaticBase } from "../../../lib/staticProps";
import { TermsDTO, getTerm } from "../../../lib/terms";

const RandomEvent: NextPage<{ randomEvent: RandomEventDTO }> = ({
  randomEvent,
}) => {
  const terms = useTerms();

  return (
    <>
      <PageHead
        title={`${randomEvent.name} - SoC.th.gl`}
        description={`${randomEvent.description} - ${randomEvent.name} (Songs of Conquest)`}
      />
      <Stack align="flex-start">
        <Group>
          <Stack spacing="xs">
            <Title order={2}>{randomEvent.name}</Title>
            <Text>{randomEvent.factionName}</Text>
            <Lore text={randomEvent.description} />
          </Stack>
        </Group>
        <Table>
          <tbody>
            <tr>
              <td>{terms.chanceOfHappening}</td>
              <td>{Math.floor(randomEvent.chanceOfHappening * 100)}%</td>
            </tr>
            <tr>
              <td>Event Chain Name</td>
              <td>{randomEvent.eventChainName}</td>
            </tr>
            <tr>
              <td>Event Recipient</td>
              <td>{randomEvent.eventRecipient}</td>
            </tr>
            <tr>
              <td>Requirements</td>
              <td>
                <Text color="dimmed">
                  {randomEvent.requirementEvaluationType === "AND"
                    ? terms.evaluationAND
                    : terms.evaluationOR}
                </Text>
                {randomEvent.requirements.map((requirement) => (
                  <Text key={requirement.requirementType}>
                    {requirement.requirementType}
                  </Text>
                ))}
              </td>
            </tr>
            <tr>
              <td>Rewards</td>
              <td>
                {randomEvent.rewards.map((reward, index) => {
                  if (typeof reward === "string") {
                    return <Text key={index}>{reward}</Text>;
                  }
                  return (
                    <div key={index}>
                      <Text>{reward.name}</Text>
                      {reward.modifierData.map((modifier) => (
                        <Text
                          key={modifier.type}
                          dangerouslySetInnerHTML={{
                            __html: modifier.description,
                          }}
                        />
                      ))}
                      {reward.resourcesIncome.map((resourceIncome) => (
                        <Text key={resourceIncome.type}>
                          {`${terms.production} +${resourceIncome.amount} ${resourceIncome.name}`}
                        </Text>
                      ))}
                    </div>
                  );
                })}
              </td>
            </tr>
            <tr>
              <td>Penalties</td>
              <td>{randomEvent.penalties.join(", ")}</td>
            </tr>
          </tbody>
        </Table>
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
    chanceOfHappening: getTerm(
      "Adventure/RandomEventsMenu/Details/ChanceOfHappening",
      locale
    )
      .replace(": {0}%", "")
      .replace(": {0} %", ""),
    evaluationAND: getTerm(
      "Adventure/RandomEventsMenu/Details/EvaluationType/AND",
      locale
    ),
    evaluationOR: getTerm(
      "Adventure/RandomEventsMenu/Details/EvaluationType/OR",
      locale
    ),
    faction: getTerm("Adventure/TeamQueueHUD/Faction", locale),
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
    const [faction, name] = randomEvent.id.split("/");
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
