import unitsCollection from "./collections/units.json";
import { SpriteDTO } from "./sprites";
import { getTerm } from "./terms";

export const getUnits = (locale: string): UnitSimpleDTO[] => {
  const units = unitsCollection.map((unit) => ({
    ...unit,
    vanilla: {
      ...unit.vanilla,
      name: getTerm(`${unit.faction}/${unit.vanilla.languageKey}/Name`, locale),
      description: getTerm(
        `${unit.faction}/${unit.vanilla.languageKey}/Description`,
        locale
      ),
    },
    upgraded: unit.upgraded && {
      ...unit.upgraded,
      name: getTerm(
        `${unit.faction}/${unit.upgraded.languageKey}/Name`,
        locale
      ),
      description: getTerm(
        `${unit.faction}/${unit.upgraded.languageKey}/Description`,
        locale
      ),
    },
    superUpgraded: unit.superUpgraded && {
      ...unit.superUpgraded,
      name: getTerm(
        `${unit.faction}/${unit.superUpgraded.languageKey}/Name`,
        locale
      ),
      description: getTerm(
        `${unit.faction}/${unit.superUpgraded.languageKey}/Description`,
        locale
      ),
    },
  }));
  return units;
};

export const getUnit = (type: string, locale: string): UnitDTO | null => {
  const unitSrc = unitsCollection.find(
    (unit) => unit.vanilla.languageKey === type
  );
  if (!unitSrc) {
    return null;
  }

  const unit = {
    ...unitSrc,
    vanilla: {
      ...unitSrc.vanilla,
      name: getTerm(
        `${unitSrc.faction}/${unitSrc.vanilla.languageKey}/Name`,
        locale
      ),
      description: getTerm(
        `${unitSrc.faction}/${unitSrc.vanilla.languageKey}/Description`,
        locale
      ),
    },
    upgraded: unitSrc.upgraded && {
      ...unitSrc.upgraded,
      name: getTerm(
        `${unitSrc.faction}/${unitSrc.upgraded.languageKey}/Name`,
        locale
      ),
      description: getTerm(
        `${unitSrc.faction}/${unitSrc.upgraded.languageKey}/Description`,
        locale
      ),
    },
    superUpgraded: unitSrc.superUpgraded && {
      ...unitSrc.superUpgraded,
      name: getTerm(
        `${unitSrc.faction}/${unitSrc.superUpgraded.languageKey}/Name`,
        locale
      ),
      description: getTerm(
        `${unitSrc.faction}/${unitSrc.superUpgraded.languageKey}/Description`,
        locale
      ),
    },
  };
  return unit;
};

export type UnitSimpleDTO = {
  faction: string;
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
};

export type UnitDTO = {
  faction: string;
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
};