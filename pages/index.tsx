import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import clientPromise from "../lib/db";
import styles from "../styles/Home.module.css";
import { SkillDB, SkillDTO } from "../types/skill";

const Home: NextPage<{
  skills: SkillDTO[];
}> = ({ skills }) => {
  return (
    <div>
      <Head>
        <title>SoC.gg</title>
        <meta name="description" content="Songs of Conquest fansite" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {skills.map((skill) => (
          <div key={skill.name} title={skill.term} className={styles.card}>
            <div
              className={styles.skill}
              style={{
                backgroundPosition: skill.sprite
                  ? `left -${skill.sprite.x}px bottom -${skill.sprite.y}px`
                  : "initial",
              }}
            />
            <div>
              <h3>{skill.term}</h3>
              <p>{skill.loreTerm}</p>
              <ul>
                {skill.levels.map((level) => (
                  <li key={level.level}>
                    <div>Level {level.level}:</div>
                    {level.modifierData &&
                      `${level.term} ${level.modifierData[0].amountToAdd}`}
                    {level.resourcesIncome &&
                      `Income +${level.resourcesIncome[0].amount} of ${level.resourcesIncome[0].type}`}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async (context) => {
  try {
    const { locale } = context;
    const client = await clientPromise;
    const skillsCollection = client.db().collection<SkillDB>("skills");
    const skills = await skillsCollection
      .find({}, { projection: { _id: 0 } })
      .map(({ terms, loreTerms, levels, ...rest }) => ({
        ...rest,
        levels: levels.map(({ terms, ...rest }) => ({
          term: terms?.find((term) => term.locale === locale)?.term || "?",
          ...rest,
        })),
        term: terms.find((term) => term.locale === locale)?.term || "?",
        loreTerm:
          loreTerms?.find((term) => term.locale === locale)?.term || "?",
      }))
      .toArray();

    return {
      props: { skills },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { skills: [] },
    };
  }
};
