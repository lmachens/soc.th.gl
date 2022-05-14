import { Center, Container, Grid, Tabs, Text, Title } from "@mantine/core";
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import LevelDetails from "../components/LevelDetails";
import PopoverBox from "../components/PopoverBox";
import SpriteSheet from "../components/SpriteSheet";
import Term from "../components/Term";
import clientPromise from "../lib/db";

const Database: NextPage<{
  factions: any[];
  bacterias: any[];
  skills: any[];
}> = ({ factions, bacterias, skills }) => {
  return (
    <Container>
      <Head>
        <title>Skill Builder - SoC.gg</title>
        <meta name="description" content="Songs of Conquest Database" />
      </Head>

      <Center>
        <Title order={2}>Database</Title>
      </Center>

      <Tabs>
        <Tabs.Tab label="Factions">
          <Grid justify="center" mt="md">
            {factions.map((faction) => (
              <Grid.Col key={faction.id} sx={{ flexBasis: "auto" }}>
                <PopoverBox
                  popover={
                    <>
                      <Title order={4}>
                        <Term term={`Factions/${faction.languageKey}/Name`} />
                      </Title>
                      <Text size="sm">
                        <Term
                          term={`Factions/${faction.languageKey}/Description`}
                        />
                      </Text>
                    </>
                  }
                >
                  <SpriteSheet spriteSheet={faction.symbolSprite} />
                </PopoverBox>
              </Grid.Col>
            ))}
          </Grid>
        </Tabs.Tab>
        <Tabs.Tab label="Skills">
          <Grid justify="center" mt="md">
            {skills.map((skill) => (
              <Grid.Col key={skill.id} sx={{ flexBasis: "auto" }}>
                <PopoverBox
                  popover={
                    <>
                      <Title order={4}>
                        <Term term={`Skills/${skill.type}`} />{" "}
                      </Title>
                      <Text color="dimmed" size="sm">
                        <Term term={`Skills/${skill.type}/Lore`} />
                      </Text>
                      {skill.levels.map((level, index) => (
                        <>
                          <Text>
                            <Term term="Common/Level" count={index + 1} />
                          </Text>
                          <LevelDetails
                            key={index}
                            bacteria={bacterias.find(
                              (bacteria) =>
                                bacteria.id === level.bacterias[0].type
                            )}
                            type={skill.type}
                            level={index + 1}
                          />
                        </>
                      ))}
                    </>
                  }
                >
                  <SpriteSheet spriteSheet={skill.icon} />
                </PopoverBox>
              </Grid.Col>
            ))}
          </Grid>
        </Tabs.Tab>
        <Tabs.Tab label="Commanders">
          <Grid justify="center" mt="md">
            {factions.map((faction) =>
              faction.commanders.map((commander) => (
                <Grid.Col key={commander.id} sx={{ flexBasis: "auto" }}>
                  <PopoverBox
                    popover={
                      <>
                        <Title order={4}>
                          <Term
                            term={`${faction.type}/${commander.type}/Name`}
                          />
                        </Title>
                        <Text size="sm">
                          <Term
                            term={`${faction.type}/${commander.type}/Description`}
                          />
                        </Text>
                      </>
                    }
                  >
                    <SpriteSheet spriteSheet={commander.portrait} />
                  </PopoverBox>
                </Grid.Col>
              ))
            )}
          </Grid>
        </Tabs.Tab>
      </Tabs>
    </Container>
  );
};

export default Database;

export const getStaticProps: GetStaticProps = async (context) => {
  try {
    const client = await clientPromise;

    const localesCollection = client.db().collection("Locales");
    const locale = await localesCollection.findOne({
      code: context.locale || "en",
    });

    const termsCollection = client.db().collection("Terms");
    const terms = await termsCollection
      .find({
        $or: [
          { term: "Common/Level" },
          { term: /^Skill/ },
          { term: /^Loth/ },
          { term: /^Arleon/ },
          { term: /^Barya/ },
          { term: /^Rana/ },
          { term: /^Factions/ },
          { term: /^Modifiers/ },
        ],
      })
      .toArray();
    const termsMap = terms.reduce(
      (curr, term) => ({
        ...curr,
        [term.term]: term.languages[locale!.index],
      }),
      {}
    );

    const factionCollection = client.db().collection("Faction");
    const factions = await factionCollection
      .find({ id: { $ne: 0 } }, { projection: { _id: 0 } })
      .toArray();

    const skillCollection = client.db().collection("Skill");
    const skills = await skillCollection
      .find({ id: { $ne: 0 } }, { projection: { _id: 0 } })
      .toArray();

    const bacterialCollection = client.db().collection("Bacteria");
    const bacterias = await bacterialCollection
      .find({}, { projection: { _id: 0 } })
      .toArray();

    const skillPoolCollection = client.db().collection("SkillPool");
    const skillPools = await skillPoolCollection
      .find({}, { projection: { _id: 0 } })
      .toArray();

    return {
      props: {
        termsMap,
        factions,
        skills,
        bacterias,
        skillPools,
      },
    };
  } catch (e) {
    console.error(e);
    return {
      props: {},
    };
  }
};
