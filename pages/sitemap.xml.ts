import { GetServerSideProps } from "next";
import { ArtifactSimpleDTO, getArtifacts } from "../lib/artifacts";
import { BuildingSimpleDTO, getBuildings } from "../lib/buildings";
import { FactionSimpleDTO, getFactions } from "../lib/factions";
import { RandomEventSimpleDTO, getRandomEvents } from "../lib/randomEvents";
import { SkillSimpleDTO, getSkills } from "../lib/skills";
import { SpellSimpleDTO, getSpells } from "../lib/spells";
import { UnitSimpleDTO, getUnits } from "../lib/units";
import { WielderSimpleDTO, getWielders } from "../lib/wielders";
import locales from "../lib/collections/locale.json";

const URL = "https://soc.th.gl";

const SUPPORTED_LOCALES = locales
  .filter((locale) => locale.code)
  .filter((locale) => locale.code !== "sv")
  .map((locale) => locale.code as string);

function urlWithLocale(path: string, locale: string): string {
  if (locale === "en") {
    return `${URL}${path}`;
  }
  return `${URL}/${locale}${path}`;
}

function generateSiteMap(data: {
  artifacts: ArtifactSimpleDTO[];
  buildings: BuildingSimpleDTO[];
  factions: FactionSimpleDTO[];
  randomEvents: RandomEventSimpleDTO[];
  skills: SkillSimpleDTO[];
  spells: SpellSimpleDTO[];
  units: UnitSimpleDTO[];
  wielders: WielderSimpleDTO[];
}) {
  const staticPages = [
    "",
    "/artifacts",
    "/buildings",
    "/factions",
    "/random-events",
    "/skills",
    "/spells",
    "/units",
    "/wielders",
    "/towns",
    "/savegames",
    "/privacy",
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
     ${staticPages
       .map((page) =>
         SUPPORTED_LOCALES.map(
           (locale) => `
     <url>
       <loc>${urlWithLocale(page, locale)}</loc>
       ${SUPPORTED_LOCALES.map(
         (altLocale) =>
           `<xhtml:link rel="alternate" hreflang="${altLocale}" href="${urlWithLocale(page, altLocale)}" />`
       ).join("\n       ")}
     </url>`
         ).join("")
       )
       .join("")}
     ${data.factions
       .map((faction) =>
         SUPPORTED_LOCALES.map(
           (locale) => `
     <url>
       <loc>${urlWithLocale(`/towns/${faction.type}`, locale)}</loc>
       ${SUPPORTED_LOCALES.map(
         (altLocale) =>
           `<xhtml:link rel="alternate" hreflang="${altLocale}" href="${urlWithLocale(`/towns/${faction.type}`, altLocale)}" />`
       ).join("\n       ")}
     </url>`
         ).join("")
       )
       .join("")}
     ${data.artifacts
       .map((artifact) =>
         SUPPORTED_LOCALES.map(
           (locale) => `
     <url>
       <loc>${urlWithLocale(`/artifacts/${artifact.type}`, locale)}</loc>
       ${SUPPORTED_LOCALES.map(
         (altLocale) =>
           `<xhtml:link rel="alternate" hreflang="${altLocale}" href="${urlWithLocale(`/artifacts/${artifact.type}`, altLocale)}" />`
       ).join("\n       ")}
     </url>`
         ).join("")
       )
       .join("")}
     ${data.buildings
       .map((building) =>
         SUPPORTED_LOCALES.map(
           (locale) => `
     <url>
       <loc>${urlWithLocale(`/buildings/${building.type}`, locale)}</loc>
       ${SUPPORTED_LOCALES.map(
         (altLocale) =>
           `<xhtml:link rel="alternate" hreflang="${altLocale}" href="${urlWithLocale(`/buildings/${building.type}`, altLocale)}" />`
       ).join("\n       ")}
     </url>`
         ).join("")
       )
       .join("")}
     ${data.factions
       .map((faction) =>
         SUPPORTED_LOCALES.map(
           (locale) => `
     <url>
       <loc>${urlWithLocale(`/factions/${faction.type}`, locale)}</loc>
       ${SUPPORTED_LOCALES.map(
         (altLocale) =>
           `<xhtml:link rel="alternate" hreflang="${altLocale}" href="${urlWithLocale(`/factions/${faction.type}`, altLocale)}" />`
       ).join("\n       ")}
     </url>`
         ).join("")
       )
       .join("")}
     ${data.randomEvents
       .map((randomEvent) =>
         SUPPORTED_LOCALES.map(
           (locale) => `
     <url>
       <loc>${urlWithLocale(`/random-events/${randomEvent.id}`, locale)}</loc>
       ${SUPPORTED_LOCALES.map(
         (altLocale) =>
           `<xhtml:link rel="alternate" hreflang="${altLocale}" href="${urlWithLocale(`/random-events/${randomEvent.id}`, altLocale)}" />`
       ).join("\n       ")}
     </url>`
         ).join("")
       )
       .join("")}
     ${data.skills
       .map((skill) =>
         SUPPORTED_LOCALES.map(
           (locale) => `
     <url>
       <loc>${urlWithLocale(`/skills/${skill.type}`, locale)}</loc>
       ${SUPPORTED_LOCALES.map(
         (altLocale) =>
           `<xhtml:link rel="alternate" hreflang="${altLocale}" href="${urlWithLocale(`/skills/${skill.type}`, altLocale)}" />`
       ).join("\n       ")}
     </url>`
         ).join("")
       )
       .join("")}
     ${data.spells
       .map((spell) =>
         SUPPORTED_LOCALES.map(
           (locale) => `
     <url>
       <loc>${urlWithLocale(`/spells/${spell.type}`, locale)}</loc>
       ${SUPPORTED_LOCALES.map(
         (altLocale) =>
           `<xhtml:link rel="alternate" hreflang="${altLocale}" href="${urlWithLocale(`/spells/${spell.type}`, altLocale)}" />`
       ).join("\n       ")}
     </url>`
         ).join("")
       )
       .join("")}
     ${data.units
       .map((unit) =>
         SUPPORTED_LOCALES.map(
           (locale) => `
     <url>
       <loc>${urlWithLocale(`/units/${unit.faction}/${unit.vanilla.languageKey}`, locale)}</loc>
       ${SUPPORTED_LOCALES.map(
         (altLocale) =>
           `<xhtml:link rel="alternate" hreflang="${altLocale}" href="${urlWithLocale(`/units/${unit.faction}/${unit.vanilla.languageKey}`, altLocale)}" />`
       ).join("\n       ")}
     </url>`
         ).join("")
       )
       .join("")}
     ${data.wielders
       .map((wielder) =>
         SUPPORTED_LOCALES.map(
           (locale) => `
     <url>
       <loc>${urlWithLocale(`/wielders/${wielder.type}`, locale)}</loc>
       ${SUPPORTED_LOCALES.map(
         (altLocale) =>
           `<xhtml:link rel="alternate" hreflang="${altLocale}" href="${urlWithLocale(`/wielders/${wielder.type}`, altLocale)}" />`
       ).join("\n       ")}
     </url>`
         ).join("")
       )
       .join("")}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const locale = "en";
  const artifacts = getArtifacts(locale);
  const buildings = getBuildings(locale);
  const factions = getFactions(locale).filter(
    (faction) => faction.symbolSprite && faction.name
  );
  const randomEvents = getRandomEvents(locale);
  const skills = getSkills(locale);
  const spells = getSpells(locale);
  const units = getUnits(locale).filter((u) => u.vanilla.name);
  const wielders = getWielders(locale).filter((w) => w.name);

  const sitemap = generateSiteMap({
    artifacts,
    buildings,
    factions,
    randomEvents,
    skills,
    spells,
    units,
    wielders,
  });
  res.setHeader("Content-Type", "text/xml");
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default SiteMap;
