import { GetStaticPaths, NextPage } from "next";
import { withStaticBase } from "../../lib/staticProps";
import skillCollection from "../../lib/collections/skill.json";
import bacteriaCollection from "../../lib/collections/bacteria.json";

import { Stack, Text, Title } from "@mantine/core";
import SpriteSheet from "../../components/SpriteSheet/SpriteSheet";
import { getTerm } from "../../lib/terms";
import { Fragment } from "react";

const Skill: NextPage<{ skill: any }> = ({ skill }) => {
  return (
    <Stack>
      <Title order={4}>{skill.name}</Title>
      <Text size="sm">{skill.lore}</Text>
      <SpriteSheet spriteSheet={skill.icon} />

      <Stack>
        {skill.levels.map((level: any, index: number) => (
          <Fragment key={index}>
            <Text dangerouslySetInnerHTML={{ __html: level.name }} />
            <Text dangerouslySetInnerHTML={{ __html: level.description }} />
            {level.bacteria.modifierData?.map((modifier: any) => (
              <Text
                key={modifier.type}
                dangerouslySetInnerHTML={{ __html: modifier.description }}
              />
            ))}
          </Fragment>
        ))}
      </Stack>
    </Stack>
  );
};

export default Skill;

export const getStaticProps = withStaticBase(async (context) => {
  const type = context.params!.type;

  const skill = skillCollection.find((skill) => skill.type === type);
  if (!skill) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      skill: {
        type: skill.type,
        name: getTerm(`Skills/${skill.type}`, context.locale!),
        lore: getTerm(`Skills/${skill.type}/Lore`, context.locale!),
        icon: skill.icon,
        levels: skill.levels.map((level, index) => {
          const bacteria = bacteriaCollection.find(
            (bacteria) => bacteria.id === level.bacterias[0].type
          )!;
          return {
            name: getTerm(`Common/Level`, context.locale!, index + 1),
            description: getTerm(
              `Skills/${skill.type}/Level${index + 1}/Description`,
              context.locale!
            ),
            bacteria: {
              modifierData:
                bacteria.modifierData?.map((modifier) => ({
                  type: modifier.type,
                  description: getTerm(
                    `Modifiers/${modifier.modifier.replace(
                      "Troop",
                      ""
                    )}/Description`,
                    context.locale!,
                    modifier.amountToAdd,
                    modifier.applicationType
                  ),
                })) || [],
            },
          };
        }),
      },
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
