import { GetStaticPaths, NextPage } from "next";
import { withStaticBase } from "../../lib/staticProps";
import skillCollection from "../../lib/collections/skill.json";

import { Stack, Text, Title } from "@mantine/core";
import SpriteSheet from "../../components/SpriteSheet/SpriteSheet";
import { getTerm, TermsDTO } from "../../lib/terms";
import { Fragment } from "react";
import { getSkill, SkillDTO } from "../../lib/skills";

const Skill: NextPage<{
  skill: SkillDTO;
  terms: TermsDTO;
}> = ({ skill, terms }) => {
  return (
    <Stack>
      <Title order={4}>{skill.name}</Title>
      <Text size="sm">{skill.lore}</Text>
      <SpriteSheet spriteSheet={skill.icon} />

      <Stack>
        {skill.levels.map((level: any, index: number) => (
          <Fragment key={index}>
            <Title order={5} dangerouslySetInnerHTML={{ __html: level.name }} />
            {level.description && (
              <Text dangerouslySetInnerHTML={{ __html: level.description }} />
            )}
            {level.modifierData.map((modifier: any) => (
              <Text
                key={modifier.type}
                dangerouslySetInnerHTML={{ __html: modifier.description }}
              />
            ))}
            {level.resourcesIncome.map((resourceIncome: any) => (
              <Text key={resourceIncome.type}>
                {`${terms.production} +${resourceIncome.amount} ${terms.gold}`}
              </Text>
            ))}
          </Fragment>
        ))}
      </Stack>
    </Stack>
  );
};

export default Skill;

export const getStaticProps = withStaticBase(async (context) => {
  const type = context.params!.type as string;

  const skill = getSkill(type, context.locale!);

  if (!skill) {
    return {
      notFound: true,
    };
  }

  const terms: TermsDTO = {
    production: getTerm("Common/Details/GeneratesResources", context.locale!),
    gold: getTerm("Common/Resource/Gold", context.locale!),
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
  const skills = skillCollection.map((skill) => ({
    params: {
      type: skill.type,
    },
  }));
  return {
    paths: skills,
    fallback: false,
  };
};
