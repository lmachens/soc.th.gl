import { NextPage } from "next";
import { withStaticBase } from "../../lib/staticProps";

import { Grid, Text, Title } from "@mantine/core";
import SpriteSheet from "../../components/SpriteSheet/SpriteSheet";
import PopoverLink from "../../components/PopoverLink/PopoverLink";
import { getSkills, SkillSimpleDTO } from "../../lib/skills";
import Head from "next/head";

const Skills: NextPage<{ skills: SkillSimpleDTO[] }> = ({ skills }) => {
  return (
    <>
      <Head>
        <title>Skills - SoC.gg</title>
        <meta name="description" content="All skills of Songs of Conquest" />
      </Head>
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
    </>
  );
};

export default Skills;

export const getStaticProps = withStaticBase(async (context) => {
  const skills = getSkills(context.locale!);

  return {
    props: {
      skills,
    },
    revalidate: false,
  };
});
