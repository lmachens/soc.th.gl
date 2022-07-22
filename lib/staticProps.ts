import { GetStaticProps } from "next";
import { getArtifacts } from "./artifacts";
import { getBuildings } from "./buildings";

import { getFactions } from "./factions";
import { getSkills } from "./skills";
import { getSpells } from "./spells";
import { getSiteTerm, getTerm, TermsDTO } from "./terms";
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

export const withStaticBase = <T extends { terms?: TermsDTO }>(
  getStaticProps: GetStaticProps<T>
) => {
  const getStaticPropsWithBase: GetStaticProps<
    | (T & {
        collectionLinks: CollectionLink[];
        terms: TermsDTO;
      })
    | T
  > = async (context) => {
    const propsResult = await getStaticProps(context);
    if (
      (propsResult as { notFound: true; revalidate?: number | boolean })
        .notFound
    ) {
      return propsResult;
    }

    const locale = context.locale!;
    const factions = getFactions(locale).filter(
      (faction) => faction.symbolSprite
    );
    const factionLinks = factions
      .map((faction) => ({
        to: `/factions/${faction.type}`,
        label: faction.name,
      }))
      .sort(sortByLabel);

    const skills = getSkills(locale);
    const skillLinks = skills
      .map((skill) => ({
        to: `/skills/${skill.type}`,
        label: getTerm(`Skills/${skill.type}`, locale),
      }))
      .sort(sortByLabel);

    const wielders = getWielders(locale)
      .map((wielder) => ({
        to: `/wielders/${wielder.type}`,
        label: wielder.name,
        description: wielder.factionName,
      }))
      .sort(sortByLabel);

    const units = getUnits(locale)
      .map((unit) => {
        let label = unit.vanilla.name;
        if (unit.upgraded) {
          label += ` / ${unit.upgraded.name}`;
        }
        if (unit.superUpgraded) {
          label += ` / ${unit.superUpgraded.name}`;
        }

        return {
          to: `/units/${unit.faction}/${unit.vanilla.languageKey}`,
          label,
          description: unit.faction,
        };
      })
      .sort(sortByLabel);

    const artifacts = getArtifacts(locale)
      .map((artifact) => {
        return {
          to: `/artifacts/${artifact.type}`,
          label: artifact.name,
        };
      })
      .sort(sortByLabel);

    const buildings = getBuildings(locale);
    const buildingLinks = buildings
      .map((building) => ({
        to: `/buildings/${building.type}`,
        label: building.name,
        description: building.factionName,
      }))
      .sort(sortByLabel);

    const spells = getSpells(locale);
    const spellLinks = spells
      .map((spell) => ({
        to: `/spells/${spell.type}`,
        label: spell.name,
      }))
      .sort(sortByLabel);

    const collectionLinks: CollectionLink[] = [
      {
        label: getSiteTerm("Factions", locale),
        docs: [
          {
            to: "/factions",
            label: getSiteTerm("AllFactions", locale),
          },
          ...factionLinks,
        ],
      },
      {
        label: getSiteTerm("Skills", locale),
        docs: [
          {
            to: "/skills",
            label: getSiteTerm("AllSkills", locale),
          },
          ...skillLinks,
        ],
      },
      {
        label: getSiteTerm("Wielders", locale),
        docs: [
          {
            to: "/wielders",
            label: getSiteTerm("AllWielders", locale),
          },
          ...wielders,
        ],
      },
      {
        label: getSiteTerm("Units", locale),
        docs: [
          {
            to: "/units",
            label: getSiteTerm("AllUnits", locale),
          },
          ...units,
        ],
      },
      {
        label: getSiteTerm("Artifacts", locale),
        docs: [
          {
            to: "/artifacts",
            label: getSiteTerm("AllArtifacts", locale),
          },
          ...artifacts,
        ],
      },
      {
        label: getSiteTerm("Buildings", locale),
        docs: [
          {
            to: "/buildings",
            label: getSiteTerm("AllBuildings", locale),
          },
          ...buildingLinks,
        ],
      },
      {
        label: getSiteTerm("Spells", locale),
        docs: [
          {
            to: "/spells",
            label: getSiteTerm("AllSpells", locale),
          },
          ...spellLinks,
        ],
      },
    ];

    // Terms loaded for every page
    const terms: TermsDTO = {
      DiscordTooltip: getSiteTerm("DiscordTooltip", locale),
      GitHubTooltip: getSiteTerm("GitHubTooltip", locale),
      LearnMore: getSiteTerm("LearnMore", locale),
      Search: getSiteTerm("Search", locale),
      About: getSiteTerm("About", locale),
      Sitemap: getSiteTerm("Sitemap", locale),
      PrivacyPolicy: getSiteTerm("PrivacyPolicy", locale),
      OfficalLinks: getSiteTerm("OfficalLinks", locale),
      Discord: getSiteTerm("Discord", locale),
      SongsOfConquest: getSiteTerm("SongsOfConquest", locale),
      Download: getSiteTerm("Download", locale),
      Steam: getSiteTerm("Steam", locale),
      GoG: getSiteTerm("GoG", locale),
      EpicGames: getSiteTerm("EpicGames", locale),
    };

    const pagePropsResult = propsResult as {
      props: T;
      revalidate?: number | boolean;
    };

    const result: {
      props: T & {
        collectionLinks: CollectionLink[];
        terms: TermsDTO;
      };
      revalidate?: number | boolean;
    } = {
      props: {
        ...pagePropsResult.props,
        collectionLinks,
        terms: { ...terms, ...(pagePropsResult.props.terms || {}) },
      },
      revalidate: pagePropsResult.revalidate,
    };

    return result;
  };
  return getStaticPropsWithBase;
};
