import { GetStaticPaths, NextPage } from "next";
import { withStaticBase } from "../../lib/staticProps";

import { Image, Stack, Text, Title } from "@mantine/core";
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
        <Stack>
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
            />
          ))}
        </Stack>
        <Title order={2}>{terms.units}</Title>

        <Stack>
          {faction.units.map((unit) => (
            <Article
              key={unit.vanilla.languageKey}
              image={<SpriteSheet spriteSheet={unit.vanilla.sprite} />}
              name={unit.vanilla.name}
              description={unit.vanilla.description}
              href={`/units/${faction.type}/${unit.vanilla.languageKey}`}
            />
          ))}
        </Stack>
      </Stack>
    </>
  );
};

export default Faction;

export const getStaticProps = withStaticBase(async (context) => {
  const type = context.params!.type as string;
  const faction = getFaction(type, context.locale!);
  if (!faction) {
    return {
      notFound: true,
    };
  }
  const terms: TermsDTO = {
    wielders: getTerm("Common/Wielders", context.locale!),
    units: getTerm("Tutorial/CodexCategory/Units", context.locale!),
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
