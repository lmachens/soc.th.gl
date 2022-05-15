import { NextPage } from "next";
import { withStaticBase } from "../../lib/staticProps";
import skillCollection from "../../lib/collections/skill.json";

import { Grid, Text, Title } from "@mantine/core";
import SpriteSheet from "../../components/SpriteSheet/SpriteSheet";
import { getTerm } from "../../lib/terms";
import PopoverLink from "../../components/PopoverLink/PopoverLink";

const Skills: NextPage<{ skills: any[] }> = ({ skills }) => {
  return (
    <Grid justify="center" mt="md">
      {skills.map((skill) => (
        <Grid.Col key={skill.type} sx={{ flexBasis: "auto" }}>
          <PopoverLink
            href={`/skills/${skill.type}`}
            popover={
              <>
                <Title order={4}>{skill.name}</Title>
                <Text color="dimmed" size="sm">
                  {skill.lore}
                </Text>
              </>
            }
          >
            <SpriteSheet spriteSheet={skill.icon} />
          </PopoverLink>
        </Grid.Col>
      ))}
    </Grid>
  );
};

export default Skills;

export const getStaticProps = withStaticBase(async (context) => {
  const skills = skillCollection.map((skill) => ({
    type: skill.type,
    name: getTerm(`Skills/${skill.type}`, context.locale!),
    lore: getTerm(`Skills/${skill.type}/Lore`, context.locale!),
    icon: skill.icon,
  }));

  return {
    props: {
      skills,
    },
    revalidate: false,
  };
});
