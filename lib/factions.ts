import factionCollection from "./collections/faction.json";
import { SpriteDTO } from "./sprites";
import { getTerm } from "./terms";

export const getFactions = (locale: string) => {
  const factions = factionCollection
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
  const factionSrc = factionCollection.find((faction) => faction.type === type);
  if (!factionSrc) {
    return null;
  }

  const faction: FactionDTO = {
    type: factionSrc.type,
    name: getTerm(`Factions/${factionSrc.languageKey}/Name`, locale),
    description: getTerm(
      `Factions/${factionSrc.languageKey}/Description`,
      locale
    ),
    bannerSprite: factionSrc.bannerSprite!,
    symbolSprite: factionSrc.symbolSprite!,
    commanders: factionSrc.commanders.map((commander) => ({
      id: commander.id,
      portrait: commander.portrait.name
        ? {
            name: commander.portrait.name,
            spriteSheet: commander.portrait.spriteSheet,
            x: commander.portrait.x,
            y: commander.portrait.y,
            width: commander.portrait.width,
            height: commander.portrait.height,
          }
        : null,
      type: commander.type!,
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
  bannerSprite: SpriteDTO;
  symbolSprite: SpriteDTO;
  commanders: {
    id: number;
    portrait: SpriteDTO | null;
    type: string;
  }[];
};
