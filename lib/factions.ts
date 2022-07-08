import factionsCollection from "./collections/factions.json";
import { SpriteDTO } from "./sprites";
import { getTerm } from "./terms";
import wieldersCollection from "./collections/wielders.json";
import { BuildingSimpleDTO, getBuildings } from "./buildings";

export const getFactions = (locale: string) => {
  const factions = factionsCollection
    .filter((faction) => faction.symbolSprite)
    .map<FactionSimpleDTO>((faction) => ({
      id: faction.id,
      type: faction.type,
      name: getTerm(`Factions/${faction.languageKey}/Name`, locale),
      description: getTerm(
        `Factions/${faction.languageKey}/Description`,
        locale
      ),
      bannerSprite: faction.bannerSprite!,
      symbolSprite: faction.symbolSprite!,
    }));
  return factions;
};

export const getFaction = (type: string, locale: string) => {
  const factionSrc = factionsCollection.find(
    (faction) => faction.type === type
  );
  if (!factionSrc) {
    return null;
  }

  const faction: FactionDTO = {
    ...factionSrc,
    bannerSprite: factionSrc.bannerSprite!,
    symbolSprite: factionSrc.symbolSprite!,
    name: getTerm(`Factions/${factionSrc.languageKey}/Name`, locale),
    description: getTerm(
      `Factions/${factionSrc.languageKey}/Description`,
      locale
    ),
    commanders: factionSrc.commanders.map((commander) => ({
      ...commander,
      name: getTerm(`${factionSrc.languageKey}/${commander.type}/Name`, locale),
      description: getTerm(
        `${factionSrc.languageKey}/${commander.type}/Description`,
        locale
      ),
      stats: wieldersCollection.find(
        (wielder) => wielder.type === commander.type
      )!.stats,
    })),
    units: factionSrc.units.map((unit) => ({
      ...unit,
      vanilla: {
        ...unit.vanilla,
        name: getTerm(
          `${factionSrc.type}/${unit.vanilla.languageKey}/Name`,
          locale
        ),
        description: getTerm(
          `${factionSrc.type}/${unit.vanilla.languageKey}/Description`,
          locale
        ),
      },
      upgraded: unit.upgraded && {
        ...unit.upgraded,
        name: getTerm(
          `${factionSrc.type}/${unit.upgraded.languageKey}/Name`,
          locale
        ),
        description: getTerm(
          `${factionSrc.type}/${unit.upgraded.languageKey}/Description`,
          locale
        ),
      },
      superUpgraded: unit.superUpgraded && {
        ...unit.superUpgraded,
        name: getTerm(
          `${factionSrc.type}/${unit.superUpgraded.languageKey}/Name`,
          locale
        ),
        description: getTerm(
          `${factionSrc.type}/${unit.superUpgraded.languageKey}/Description`,
          locale
        ),
      },
    })),
    buildings: getBuildings(locale).filter(
      (building) => building.factionId === factionSrc.id
    ),
  };
  return faction;
};

export type FactionSimpleDTO = {
  id: number;
  type: string;
  name: string;
  description: string;
  bannerSprite: SpriteDTO;
  symbolSprite: SpriteDTO;
};

export type FactionDTO = {
  type: string;
  name: string;
  description: string;
  bannerSprite: SpriteDTO;
  symbolSprite: SpriteDTO;
  wielderFrames: SpriteDTO[];
  commanders: {
    portrait: SpriteDTO;
    name: string;
    description: string;
    type: string;
    stats: {
      defense: number;
      offense: number;
      movement: number;
      viewRadius: number;
      command: number;
    };
  }[];
  units: {
    vanilla: {
      languageKey: string;
      sprite: SpriteDTO;
      name: string;
      description: string;
    };
    upgraded: {
      languageKey: string;
      sprite: SpriteDTO;
      name: string;
      description: string;
    } | null;
    superUpgraded: {
      languageKey: string;
      sprite: SpriteDTO;
      name: string;
      description: string;
    } | null;
  }[];
  buildings: BuildingSimpleDTO[];
};
