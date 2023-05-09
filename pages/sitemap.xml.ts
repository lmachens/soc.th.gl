import { GetServerSideProps } from "next";
import { ArtifactSimpleDTO, getArtifacts } from "../lib/artifacts";
import { BuildingSimpleDTO, getBuildings } from "../lib/buildings";
import { FactionSimpleDTO, getFactions } from "../lib/factions";
import { RandomEventSimpleDTO, getRandomEvents } from "../lib/randomEvents";
import { SkillSimpleDTO, getSkills } from "../lib/skills";
import { SpellSimpleDTO, getSpells } from "../lib/spells";
import { UnitSimpleDTO, getUnits } from "../lib/units";
import { WielderSimpleDTO, getWielders } from "../lib/wielders";

const URL = "https://www.soc.gg";
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
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>${URL}</loc>
     </url>
     <url>
       <loc>${URL}/artifacts</loc>
     </url>
     <url>
       <loc>${URL}/buildings</loc>
     </url>
     <url>
       <loc>${URL}/factions</loc>
     </url>
     <url>
       <loc>${URL}/random-events</loc>
     </url>
     <url>
       <loc>${URL}/skills</loc>
     </url>
     <url>
       <loc>${URL}/spells</loc>
     </url>
     <url>
       <loc>${URL}/units</loc>
     </url>
     <url>
       <loc>${URL}/wielders</loc>
     </url>
     ${data.artifacts
       .map((artifact) => {
         return `
          <url>
              <loc>${`${URL}/artifacts/${artifact.type}`}</loc>
          </url>
        `;
       })
       .join("")}
     ${data.buildings
       .map((building) => {
         return `
          <url>
              <loc>${`${URL}/buildings/${building.type}`}</loc>
          </url>
        `;
       })
       .join("")}
     ${data.factions
       .map((faction) => {
         return `
          <url>
              <loc>${`${URL}/factions/${faction.type}`}</loc>
          </url>
        `;
       })
       .join("")}
     ${data.randomEvents
       .map((randomEvent) => {
         return `
          <url>
              <loc>${`${URL}/random-events/${randomEvent.id}`}</loc>
          </url>
        `;
       })
       .join("")}
     ${data.skills
       .map((skill) => {
         return `
          <url>
              <loc>${`${URL}/skills/${skill.type}`}</loc>
          </url>
        `;
       })
       .join("")}
     ${data.spells
       .map((spell) => {
         return `
          <url>
              <loc>${`${URL}/spells/${spell.type}`}</loc>
          </url>
        `;
       })
       .join("")}
     ${data.units
       .map((unit) => {
         return `
          <url>
              <loc>${`${URL}/units/${unit.faction}/${unit.vanilla.languageKey}`}</loc>
          </url>
        `;
       })
       .join("")}
     ${data.wielders
       .map((wielder) => {
         return `
          <url>
              <loc>${`${URL}/wielders/${wielder.type}`}</loc>
          </url>
        `;
       })
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
    (faction) => faction.symbolSprite
  );
  const randomEvents = getRandomEvents(locale);
  const skills = getSkills(locale);
  const spells = getSpells(locale);
  const units = getUnits(locale);
  const wielders = getWielders(locale);

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
