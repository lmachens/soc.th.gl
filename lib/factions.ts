import factionsCollection from "./collections/factions.json";
import { SpriteDTO } from "./sprites";
import { getTerm } from "./terms";

export const getFactions = (locale: string) => {
  const factions = factionsCollection
    .filter((faction) => faction.symbolSprite)
    .map<FactionSimpleDTO>((faction) => ({
      type: faction.type,
      name: getTerm(`Factions/${faction.languageKey}/Name`, locale),
      description: getTerm(
        `Factions/${faction.languageKey}/Description`,
        locale
      ),
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
    name: getTerm(`Factions/${factionSrc.languageKey}/Name`, locale),
    description: getTerm(
      `Factions/${factionSrc.languageKey}/Description`,
      locale
    ),
    commanders: factionSrc.commanders.map((commander) => ({
      ...commander,
    })),
    units: factionSrc.units.map((unit) => ({
      ...unit,
    })),
  };
  return faction;
};

export type FactionSimpleDTO = {
  type: string;
  name: string;
  description: string;
  symbolSprite: SpriteDTO;
};

export type FactionDTO = {
  type: string;
  name: string;
  description: string;
  bannerSprite: SpriteDTO | null;
  symbolSprite: SpriteDTO | null;
  commanders: {
    id: number;
    portrait: SpriteDTO | null;
    type?: string;
  }[];
  units: {
    vanilla: {
      id: number;
      languageKey: string;
      sprite?: {
        name: string;
        spriteSheet: string;
        x: number;
        y: number;
        width: number;
        height: number;
      } | null;
    };
    upgraded?: {
      id: number;
      languageKey: string;
      sprite?: {
        name: string;
        spriteSheet: string;
        x: number;
        y: number;
        width: number;
        height: number;
      };
    } | null;
    superUpgraded?: {
      id: number;
      languageKey: string;
      sprite?: {
        name: string;
        spriteSheet: string;
        x: number;
        y: number;
        width: number;
        height: number;
      };
    } | null;
  }[];
};
