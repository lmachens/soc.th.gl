import { GetStaticProps } from "next";
import { getArtifacts } from "./artifacts";

import { getFactions } from "./factions";
import { getSkills } from "./skills";
import { getTerm } from "./terms";
import { getUnits } from "./units";
import { getWielders } from "./wielders";

export type CollectionLink = {
  label: string;
  docs: {
    to: string;
    label: string;
    description?: string;
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

    const skills = getSkills(locale)
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
      .map((unit) => {
        return {
          to: `/units/${unit.faction}/${unit.vanilla.languageKey}`,
          label: unit.vanilla.name,
          description: unit.faction,
        };
      })
      .sort(sortByLabel);

    const artifacts = getArtifacts(locale)
      .map((artifact) => {
        return {
          to: `/artifacts/${artifact.type}`,
          label: artifact.name,
          description: artifact.description,
        };
      })
      .sort(sortByLabel);

    const collectionLinks: CollectionLink[] = [
      {
        label: getTerm("Factions", locale!),
        docs: [
          {
            to: "/factions",
            label: getTerm("AllFactions", locale!),
          },
          ...factions,
        ],
      },
      {
        label: getTerm("Skills", locale!),
        docs: [
          {
            to: "/skills",
            label: getTerm("AllSkills", locale!),
          },
          ...skills,
        ],
      },
      {
        label: getTerm("Wielders", locale!),
        docs: [
          {
            to: "/wielders",
            label: getTerm("AllWielders", locale!),
          },
          ...wielders,
        ],
      },
      {
        label: getTerm("Units", locale!),
        docs: [
          {
            to: "/units",
            label: getTerm("AllUnits", locale!),
          },
          ...units,
        ],
      },
      {
        label: getTerm("Artifacts", locale!),
        docs: [
          {
            to: "/artifacts",
            label: getTerm("AllArtifacts", locale!),
          },
          ...artifacts,
        ],
      },
    ];

    // @ts-ignore
    result.props.collectionLinks = collectionLinks;

    return result;
  };
  return getStaticPropsWithBase;
};
