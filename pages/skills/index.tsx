import { NextPage } from "next";
import { withStaticBase } from "../../lib/staticProps";

import { SimpleGrid } from "@mantine/core";
import SpriteSheet from "../../components/SpriteSheet/SpriteSheet";
import { getSkills, SkillSimpleDTO } from "../../lib/skills";
import Head from "next/head";
import Article from "../../components/Article/Article";

const Skills: NextPage<{ skills: SkillSimpleDTO[] }> = ({ skills }) => {
  return (
    <>
      <Head>
        <title>Skills - SoC.gg</title>
        <meta name="description" content="All skills of Songs of Conquest" />
      </Head>
      <SimpleGrid
        breakpoints={[
          { minWidth: 'sm', cols: 1 },
          { minWidth: 'md', cols: 2 },
          { minWidth: 'lg', cols: 3 },
        ]}
      >
        {skills.map((skill) => (
          <Article
            key={skill.type}
            image={<SpriteSheet spriteSheet={skill.icon} />}
            name={skill.name}
            description={skill.lore}
            href={`/skills/${skill.type}`}
          />
        ))}
      </SimpleGrid>
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
