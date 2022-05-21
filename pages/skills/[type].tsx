import { GetStaticPaths, NextPage } from "next";
import { withStaticBase } from "../../lib/staticProps";

import { Stack, Text, Title } from "@mantine/core";
import SpriteSheet from "../../components/SpriteSheet/SpriteSheet";
import { getTerm, TermsDTO } from "../../lib/terms";
import { Fragment } from "react";
import { getSkill, getSkills, SkillDTO } from "../../lib/skills";
import Head from "next/head";

const Skill: NextPage<{
  skill: SkillDTO;
  terms: TermsDTO;
}> = ({ skill, terms }) => {
  return (
    <>
      <Head>
        <title>{skill.name} - SoC.gg</title>
        <meta
          name="description"
          content={`${skill.name} skill details of Songs of Conquest`}
        />
      </Head>
      <Stack>
        <SpriteSheet spriteSheet={skill.icon} />

        <Stack>
          <Title order={2}>{skill.name}</Title>
          <Text size="sm">{skill.lore}</Text>
        </Stack>

        <Stack>
          {skill.levels.map((level, index) => (
            <Fragment key={index}>
              <Title
                order={3}
                dangerouslySetInnerHTML={{ __html: level.name }}
              />
              {level.description && (
                <Text dangerouslySetInnerHTML={{ __html: level.description }} />
              )}
              {level.modifierData.map((modifier) => (
                <Text
                  key={modifier.type}
                  dangerouslySetInnerHTML={{ __html: modifier.description }}
                />
              ))}
              {level.resourcesIncome.map((resourceIncome) => (
                <Text key={resourceIncome.type}>
                  {`${terms.production} +${resourceIncome.amount} ${resourceIncome.name}`}
                </Text>
              ))}
            </Fragment>
          ))}
        </Stack>
      </Stack>
    </>
  );
};

export default Skill;

export const getStaticProps = withStaticBase(async (context) => {
  const type = context.params!.type as string;
  const locale = context.locale!;

  const skill = getSkill(type, locale);

  if (!skill) {
    return {
      notFound: true,
    };
  }

  const terms: TermsDTO = {
    production: getTerm("Common/Details/GeneratesResources", locale),
  };

  return {
    props: {
      skill,
      terms,
    },
    revalidate: false,
  };
});

export const getStaticPaths: GetStaticPaths = async () => {
  const skills = getSkills("en").map((skill) => ({
    params: {
      type: skill.type,
    },
  }));
  return {
    paths: skills,
    fallback: "blocking",
  };
};
