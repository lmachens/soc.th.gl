import { GetStaticPaths, NextPage } from "next";
import { withStaticBase } from "../../lib/staticProps";
import skillCollection from "../../lib/collections/skill.json";
import bacteriaCollection from "../../lib/collections/bacteria.json";

import { Stack, Text, Title } from "@mantine/core";
import SpriteSheet from "../../components/SpriteSheet/SpriteSheet";
import { getTerm } from "../../lib/terms";
import { Fragment } from "react";

const Skill: NextPage<{ skill: any; terms: { [key: string]: string } }> = ({
  skill,
  terms,
}) => {
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
                {terms.production}
                {resourceIncome.amount}
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
            resourcesIncome:
              bacteria.income?.resources.map((resource) => ({
                type: resource.type,
                amount: resource.amount,
                allTimeAmount: resource.allTimeAmount,
              })) || [],
          };
        }),
      },
      terms: {
        production: getTerm(
          "Skills/Production/Level1/Description",
          context.locale!
        ),
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
