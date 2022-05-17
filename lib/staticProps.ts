import { GetStaticProps } from "next";

import skillCollection from "./collections/skill.json";
import { getFactions } from "./factions";
import { getTerm } from "./terms";
import { getUnits } from "./units";
import { getWielders } from "./wielders";

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

    const locale = context.locale!;
    const factions = getFactions(locale)
      .filter((faction) => faction.symbolSprite)
      .map((faction) => ({
        to: `/factions/${faction.type}`,
        label: getTerm(`Factions/${faction.type}/Name`, locale),
      }))
      .sort(sortByLabel);

    const skills = skillCollection
      .map((skill) => ({
        to: `/skills/${skill.type}`,
        label: getTerm(`Skills/${skill.type}`, locale),
      }))
      .sort(sortByLabel);

    const wielders = getWielders(locale)
      .map((wielder) => ({
        to: `/wielders/${wielder.type}`,
        label: wielder.name,
      }))
      .sort(sortByLabel);

    const units = getUnits(locale)
      .map((unit) => ({
        to: `/units/${unit.vanilla.languageKey}`,
        label: unit.vanilla.name,
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
      {
        label: "Wielders",
        docs: [
          {
            to: "/wielders",
            label: "All wielders",
          },
          ...wielders,
        ],
      },
      {
        label: "Units",
        docs: [
          {
            to: "/units",
            label: "All units",
          },
          ...units,
        ],
      },
    ];

    // @ts-ignore
    result.props.collectionLinks = collectionLinks;

    return result;
  };
  return getStaticPropsWithBase;
};
