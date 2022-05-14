import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import clientPromise from "../lib/db";
import Term from "../components/Term";
import { useState } from "react";
import {
  Center,
  Container,
  Grid,
  SimpleGrid,
  Text,
  Timeline,
  Title,
} from "@mantine/core";
import LevelDetails from "../components/LevelDetails";
import SpriteSheet from "../components/SpriteSheet";
import PopoverActionIcon from "../components/PopoverActionIcon";

const SkillBuild: NextPage<{
  factions: any[];
  skills: any[];
  bacterias: any[];
  skillPools: any[];
}> = ({ factions, skills, bacterias, skillPools }) => {
  const [faction, setFaction] = useState<any | null>(null);
  const [commander, setCommander] = useState<any | null>(null);

  const [selectedSkillLevels, setSelectedSkillLevels] = useState<
    { skill: number; level: number }[]
  >([]);

  // useEffect(() => {
  //   setSelectedSkillLevels([]);
  // }, [selectedWarden]);

  const level = selectedSkillLevels?.length + 1 - commander?.skills.length;

  const skillPool =
    commander &&
    skillPools.find((skillPool) => skillPool.id === commander.skillPool);

  const levelPool = skillPool?.pools.find(
    (pool) => level >= pool.levelRange.min && level <= pool.levelRange.max
  );

  const availableSkills = levelPool?.skills
    .filter((levelPoolSkill) => {
      if (
        !levelPoolSkill.requiredSkills.every((requiredSkill) =>
          selectedSkillLevels.some(
            (selectedSkillLevel) =>
              selectedSkillLevel.skill === requiredSkill.skill &&
              selectedSkillLevel.level >= requiredSkill.level
          )
        )
      ) {
        return false;
      }

      const prevSkillLevel = Math.max(
        0,
        ...selectedSkillLevels
          .filter(
            (selectedSkillLevel) =>
              selectedSkillLevel.skill === levelPoolSkill.skill
          )
          .map((selectedSkillLevel) => selectedSkillLevel.level)
      );

      if (prevSkillLevel) {
        const skill = skills.find((skill) => skill.id === levelPoolSkill.skill);

        const nextLevel = skill?.[prevSkillLevel];
        if (!nextLevel) {
          return false;
        }
      }

      return true;
    })
    .map((availableSkill) =>
      skills.find((skill) => skill.id === availableSkill.skill)
    );
  selectedSkillLevels.forEach((selectedSkillLevel) => {
    const skill = skills.find((skill) => skill.id === selectedSkillLevel.skill);

    const nextLevel = skill?.levels[selectedSkillLevel.level];
    if (!nextLevel) {
      return;
    }
    if (
      !selectedSkillLevels.some(
        (otherSkillLevel) =>
          otherSkillLevel.id === selectedSkillLevel.id &&
          otherSkillLevel.level === selectedSkillLevel.level + 1
      ) &&
      !availableSkills.some((availableSkill) => availableSkill.id === skill.id)
    ) {
      availableSkills.push(skill);
    }
  });

  return (
    <Container>
      <Head>
        <title>Skill Builder - SoC.gg</title>
        <meta name="description" content="Songs of Conquest Skill Builder" />
      </Head>

      <Center>
        <Title order={2}>Skill Builder</Title>
      </Center>

      <Grid justify="center" mt="md">
        {!faction &&
          factions.map((faction) => (
            <Grid.Col key={faction.id} sx={{ flexBasis: "auto" }}>
              <PopoverActionIcon
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
                onClick={() => setFaction(faction)}
              >
                <SpriteSheet spriteSheet={faction.symbolSprite} />
              </PopoverActionIcon>
            </Grid.Col>
          ))}
      </Grid>

      {!commander && faction && (
        <Grid justify="center" mt="md">
          {faction.commanders.map((commander) => (
            <Grid.Col key={commander.id} sx={{ flexBasis: "auto" }}>
              <PopoverActionIcon
                popover={
                  <>
                    <Title order={4}>
                      <Term term={`${faction.type}/${commander.type}/Name`} />
                    </Title>
                    <Text size="sm">
                      <Term
                        term={`${faction.type}/${commander.type}/Description`}
                      />
                    </Text>
                  </>
                }
                onClick={() => {
                  setCommander(commander);
                  setSelectedSkillLevels(commander.skills);
                }}
              >
                <SpriteSheet spriteSheet={commander.portrait} />
              </PopoverActionIcon>
            </Grid.Col>
          ))}
        </Grid>
      )}

      {commander && (
        <Timeline
          mt="lg"
          bulletSize={90}
          lineWidth={2}
          styles={{
            itemBullet: {
              background: "none !important",
              border: "none !important",
            },
          }}
        >
          {selectedSkillLevels.map((selectedSkill) => {
            const skill = skills.find(
              (skill) => skill.id === selectedSkill.skill
            )!;
            const skillLevel = skill.levels[selectedSkill.level - 1];
            const bacteria = bacterias.find(
              (bacteria) => bacteria.id === skillLevel.bacterias[0].type
            );

            return (
              <Timeline.Item
                key={skill.type}
                title={
                  <Title order={4}>
                    <Term term={`Skills/${skill.type}`} />{" "}
                    <Term term="Common/Level" count={selectedSkill.level} />
                  </Title>
                }
                sx={{
                  minHeight: 100,
                  paddingLeft: 70,
                }}
                bullet={<SpriteSheet spriteSheet={skill.icon} />}
              >
                <Text color="dimmed" size="sm">
                  <Term term={`Skills/${skill.type}/Lore`} />
                </Text>
                <LevelDetails
                  bacteria={bacteria}
                  type={skill.type}
                  level={selectedSkill.level}
                />
              </Timeline.Item>
            );
          })}

          <Timeline.Item
            title="Choose a skill"
            sx={{
              minHeight: 100,
              paddingLeft: 70,
            }}
            lineVariant="dashed"
          >
            <SimpleGrid cols={3}>
              {availableSkills.map((availableSkill) => {
                const skill = skills.find(
                  (skill) => skill.id === availableSkill.id
                );
                const prevSkillLevel = Math.max(
                  0,
                  ...selectedSkillLevels
                    .filter(
                      (selectedSkillLevel) =>
                        selectedSkillLevel.skill === skill.id
                    )
                    .map((selectedSkillLevel) => selectedSkillLevel.level)
                );

                const skillLevel = skill.levels[prevSkillLevel];
                const bacteria = bacterias.find(
                  (bacteria) => bacteria.id === skillLevel.bacterias[0].type
                );

                return (
                  <PopoverActionIcon
                    key={skill.id}
                    popover={
                      <>
                        <Title order={4}>
                          <Term term={`Skills/${skill.type}`} />{" "}
                          <Term
                            term="Common/Level"
                            count={prevSkillLevel + 1}
                          />
                        </Title>
                        <Text color="dimmed" size="sm">
                          <Term term={`Skills/${skill.type}/Lore`} />
                        </Text>
                        <LevelDetails
                          bacteria={bacteria}
                          type={skill.type}
                          level={prevSkillLevel + 1}
                        />
                      </>
                    }
                    onClick={() => {
                      setSelectedSkillLevels([
                        ...selectedSkillLevels,
                        {
                          skill: skill.id,
                          level: prevSkillLevel + 1,
                        },
                      ]);
                    }}
                  >
                    <SpriteSheet spriteSheet={skill.icon} />
                  </PopoverActionIcon>
                );
              })}
            </SimpleGrid>
          </Timeline.Item>
        </Timeline>
      )}
    </Container>
  );
};

export default SkillBuild;

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
