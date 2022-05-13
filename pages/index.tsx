import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import clientPromise from "../lib/db";
import styles from "../styles/Home.module.css";
import { TermDB, TermDTO } from "../types/terms";
import { SkillDB, SkillDTO } from "../types/skills";
import Term from "../components/Term";
import { WardenDB, WardenDTO } from "../types/wardens";

const Home: NextPage<{
  skills: SkillDTO[];
  terms: TermDTO[];
  wardens: WardenDTO[];
}> = ({ skills, terms, wardens }) => {
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
                    <div>
                      <Term terms={terms} type="level" count={level.level} />
                    </div>
                    {level.term && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: level.term
                            .replace(
                              "<hl>",
                              `<span class="${styles.highlight}">`
                            )
                            .replace("</hl>", "</span>"),
                        }}
                      />
                    )}
                    {level.modifierData?.map((modifier) => (
                      <div key={modifier.type}>
                        <Term
                          terms={terms}
                          type="modifier"
                          id={modifier.type}
                          applicationType={modifier.applicationType}
                          count={modifier.amountToAdd}
                        />
                      </div>
                    ))}
                    {level.resourcesIncome &&
                      `Income +${level.resourcesIncome[0].amount} of ${level.resourcesIncome[0].type}`}
                    {level.durations?.map((duration) => (
                      <div key={duration.type}>
                        {terms
                          .find(
                            (term) =>
                              term.type === "bacteriaDuration" && !term.id
                          )
                          ?.term.replace(" {0}", "")}{" "}
                        <span className={styles.positive}>
                          {duration.duration}
                        </span>{" "}
                        <Term
                          terms={terms}
                          type="bacteriaDuration"
                          id={duration.type}
                          count={duration.duration}
                        />
                      </div>
                    ))}
                  </li>
                ))}
                <li>
                  <Term terms={terms} type="availableTo" />
                  <div>
                    {wardens
                      .filter((warden) =>
                        warden.skillPools.some((skillPool) =>
                          skillPool.skills.some(
                            (skillPoolSkill) =>
                              skillPoolSkill.skill === skill.id
                          )
                        )
                      )
                      .sort((a, b) => a.term.localeCompare(b.term))
                      .map((warden) => (
                        <span key={warden.name}>{warden.term}</span>
                      ))}
                  </div>
                </li>
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
          term: terms?.find((term) => term.locale === locale)?.term || null,
          ...rest,
        })),
        term: terms.find((term) => term.locale === locale)?.term || null,
        loreTerm:
          loreTerms?.find((term) => term.locale === locale)?.term || null,
      }))
      .toArray();

    const termsCollection = client.db().collection<TermDB>("terms");
    const terms = await termsCollection
      .find({}, { projection: { _id: 0 } })
      .map(({ terms, ...rest }) => ({
        ...rest,
        term: terms.find((term) => term.locale === locale)?.term || null,
      }))
      .toArray();

    const wardensCollection = client.db().collection<WardenDB>("wardens");
    const wardens = await wardensCollection
      .find({}, { projection: { _id: 0 } })
      .map(({ terms, ...rest }) => ({
        ...rest,
        term: terms.find((term) => term.locale === locale)?.term || null,
      }))
      .toArray();

    return {
      props: { skills, terms, wardens },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { skills: [], terms: [], wardens: [] },
    };
  }
};
