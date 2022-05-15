import { GetStaticProps } from "next";
import factionCollection from "./collections/faction.json";
import skillCollection from "./collections/skill.json";
import { getTerm } from "./terms";

export type CollectionLink = {
  label: string;
  docs: {
    to: string;
    label: string;
  }[];
};

export const withStaticBase = <T>(getStaticProps: GetStaticProps<T>) => {
  const getStaticPropsWithBase: GetStaticProps<T> = async (context) => {
    const propsResult = await getStaticProps(context);
    const result = {
      props: {},
      ...propsResult,
    };

    const factions = factionCollection
      .filter((faction) => faction.symbolSprite)
      .map((faction) => ({
        to: `/factions/${faction.type}`,
        label: getTerm(`Factions/${faction.type}/Name`, context.locale!),
      }));

    const skills = skillCollection.map((skill) => ({
      to: `/skills/${skill.type}`,
      label: getTerm(`Skills/${skill.type}`, context.locale!),
    }));

    const collectionLinks: CollectionLink[] = [
      {
        label: "Factions",
        docs: [
          {
            to: "/factions",
            label: "All factions",
          },
          ...factions,
        ],
      },
      {
        label: "Skills",
        docs: [
          {
            to: "/skills",
            label: "All skills",
          },
          ...skills,
        ],
      },
    ];

    // @ts-ignore
    result.props.collectionLinks = collectionLinks;

    return result;
  };
  return getStaticPropsWithBase;
};
