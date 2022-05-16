import { GetStaticProps } from "next";

import skillCollection from "./collections/skill.json";
import { getFactions } from "./factions";
import { getTerm } from "./terms";

export type CollectionLink = {
  label: string;
  docs: {
    to: string;
    label: string;
  }[];
};

const sortByLabel = (a: { label: string }, b: { label: string }) =>
  a.label.localeCompare(b.label);

export const withStaticBase = <T>(getStaticProps: GetStaticProps<T>) => {
  const getStaticPropsWithBase: GetStaticProps<T> = async (context) => {
    const propsResult = await getStaticProps(context);
    const result = {
      props: {},
      ...propsResult,
    };

    const factions = getFactions(context.locale!)
      .filter((faction) => faction.symbolSprite)
      .map((faction) => ({
        to: `/factions/${faction.type}`,
        label: getTerm(`Factions/${faction.type}/Name`, context.locale!),
      }))
      .sort(sortByLabel);

    const skills = skillCollection
      .map((skill) => ({
        to: `/skills/${skill.type}`,
        label: getTerm(`Skills/${skill.type}`, context.locale!),
      }))
      .sort(sortByLabel);

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
