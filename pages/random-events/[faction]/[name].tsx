import { GetStaticPaths, NextPage } from "next";

import { Group, Stack, Title } from "@mantine/core";
import {
  getRandomEvent,
  getRandomEvents,
  RandomEventDTO,
} from "../../../lib/randomEvents";
import { useTerms } from "../../../components/Terms/Terms";
import PageHead from "../../../components/PageHead/PageHead";
import Lore from "../../../components/Lore/Lore";
import { withStaticBase } from "../../../lib/staticProps";
import { getTerm, TermsDTO } from "../../../lib/terms";

const RandomEvent: NextPage<{ randomEvent: RandomEventDTO }> = ({
  randomEvent,
}) => {
  const terms = useTerms();

  return (
    <>
      <PageHead
        title={`${randomEvent.name} - SoC.gg`}
        description={`${randomEvent.description} - ${randomEvent.name} (Songs of Conquest)`}
      />
      <Stack align="flex-start">
        <Group>
          <Stack spacing="xs">
            {terms.faction}: {randomEvent.factionName}
            <Title order={2}>{randomEvent.name}</Title>
            {randomEvent.description && <Lore text={randomEvent.description} />}
          </Stack>
        </Group>
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
