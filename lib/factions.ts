import { BuildingSimpleDTO, getBuildings } from "./buildings";
import factionsCollection from "./collections/factions.json";
import wieldersCollection from "./collections/wielders.json";
import { SpriteDTO } from "./sprites";
import { getTerm } from "./terms";
import { UnitTypeDTO, getUnit } from "./units";

export const getFactions = (locale: string) => {
  const factions = factionsCollection.map<FactionSimpleDTO>((faction) => ({
    id: faction.id,
    type: faction.type,
    name: getTerm(`Factions/${faction.languageKey}/Name`, locale),
    description: getTerm(`Factions/${faction.languageKey}/Description`, locale),
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
    units: factionSrc.units.map((unit) => {
      const localizeVariant = (
        variant: { languageKey: string; sprite?: any } | null | undefined,
        key: string
      ) => {
        if (!variant) return null;
        return {
          ...variant,
          stats: getUnit(factionSrc.type, variant.languageKey, locale)?.[
            key as keyof Omit<ReturnType<typeof getUnit> & {}, "faction">
          ]?.stats,
          name: getTerm(
            `${factionSrc.type}/${variant.languageKey}/Name`,
            locale
          ),
          description: getTerm(
            `${factionSrc.type}/${variant.languageKey}/Description`,
            locale
          ),
        };
      };

      return {
        ...unit,
        vanilla: localizeVariant(unit.vanilla, "vanilla")!,
        upgraded: localizeVariant(unit.upgraded, "upgraded"),
        superUpgraded: localizeVariant(unit.superUpgraded, "superUpgraded"),
        arcanaUpgraded: localizeVariant(
          (unit as any).arcanaUpgraded,
          "arcanaUpgraded"
        ),
        creationUpgraded: localizeVariant(
          (unit as any).creationUpgraded,
          "creationUpgraded"
        ),
        orderUpgraded: localizeVariant(
          (unit as any).orderUpgraded,
          "orderUpgraded"
        ),
      };
    }),
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
      sprite?: SpriteDTO;
      name: string;
      description: string;
      stats?: UnitTypeDTO["stats"];
    };
    upgraded: {
      languageKey: string;
      sprite?: SpriteDTO;
      name: string;
      description: string;
      stats?: UnitTypeDTO["stats"];
    } | null;
    superUpgraded: {
      languageKey: string;
      sprite?: SpriteDTO;
      name: string;
      description: string;
      stats?: UnitTypeDTO["stats"];
    } | null;
    arcanaUpgraded: {
      languageKey: string;
      sprite?: SpriteDTO;
      name: string;
      description: string;
      stats?: UnitTypeDTO["stats"];
    } | null;
    creationUpgraded: {
      languageKey: string;
      sprite?: SpriteDTO;
      name: string;
      description: string;
      stats?: UnitTypeDTO["stats"];
    } | null;
    orderUpgraded: {
      languageKey: string;
      sprite?: SpriteDTO;
      name: string;
      description: string;
      stats?: UnitTypeDTO["stats"];
    } | null;
  }[];
  buildings: BuildingSimpleDTO[];
};
