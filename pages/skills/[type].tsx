import { GetStaticPaths, NextPage } from "next";
import { withStaticBase } from "../../lib/staticProps";

import { Stack, Text, Title } from "@mantine/core";
import SpriteSheet from "../../components/SpriteSheet/SpriteSheet";
import { getTerm, TermsDTO } from "../../lib/terms";
import { Fragment } from "react";
import { getSkill, getSkills, SkillDTO } from "../../lib/skills";
import { useTerms } from "../../components/Terms/Terms";
import PageHead from "../../components/PageHead/PageHead";

const Skill: NextPage<{
  skill: SkillDTO;
}> = ({ skill }) => {
  const terms = useTerms();
  return (
    <>
      <PageHead
        title={`${skill.name} - SoC.th.gl`}
        description={`${skill.lore} - ${skill.name} (Songs of Conquest)`}
      />

      <Stack>
        <SpriteSheet spriteSheet={skill.icon} folder="skills" />

        <Stack>
          <Title order={2}>{skill.name}</Title>
          <Text size="sm">{skill.lore}</Text>
        </Stack>

        <Stack>
          {skill.levels.map((level, index) => (
            <Fragment key={index}>
              <Title
                order={3}
                dangerouslySetInnerHTML={{ __html: level.levelName }}
              />
              {level.levelDescription && (
                <Text
                  dangerouslySetInnerHTML={{ __html: level.levelDescription }}
                />
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

              {level.settings?.bacterias?.map((bacteria) => (
                <Fragment key={bacteria.bacteriaType}>
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
                </Fragment>
              ))}
              {level.settings && level.duration && (
                <Text>{level.duration}</Text>
              )}
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
