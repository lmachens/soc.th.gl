import { BacteriaDTO, getLocaleBacteria } from "./bacterias";
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

export const getUnit = (
  faction: string,
  type: string,
  locale: string
): UnitDTO | null => {
  const unitSrc = unitsCollection.find(
    (unit) => unit.faction === faction && unit.vanilla.languageKey === type
  );
  if (!unitSrc) {
    return null;
  }

  const getType = (
    type:
      | typeof unitSrc.vanilla
      | typeof unitSrc.upgraded
      | typeof unitSrc.superUpgraded
  ) => {
    if (!type) {
      return null;
    }
    return {
      ...type,
      stats: {
        ...type.stats,
        statuses: type.stats.statuses
          ? type.stats.statuses.map((status) =>
              getTerm(`Common/BacteriaOwnerStatus/${status}`, locale)
            )
          : null,
      },
      name: getTerm(`${unitSrc.faction}/${type.languageKey}/Name`, locale),
      description: getTerm(
        `${unitSrc.faction}/${type.languageKey}/Description`,
        locale
      ),
      troopAbility: type.troopAbility
        ? {
            type: type.troopAbility.type,
            icon: type.troopAbility.icon,
            name: getTerm(`Units/Abilities/Wait`, locale),
            description: getTerm(`Units/Abilities/Wait/Description`, locale),
            bacterias: type.troopAbility.bacterias.map((bacteria) =>
              getLocaleBacteria(bacteria, locale)
            ),
          }
        : null,
      bacterias: type.bacterias.map((bacteria) =>
        getLocaleBacteria(bacteria, locale)
      ),
    };
  };

  const unit = {
    ...unitSrc,
    vanilla: getType(unitSrc.vanilla)!,
    upgraded: getType(unitSrc.upgraded),
    superUpgraded: getType(unitSrc.superUpgraded),
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

export type UnitTypeDTO = {
  languageKey: string;
  sprite: SpriteDTO;
  name: string;
  description: string;
  purchaseCost: {
    costEntries: {
      type: number;
      amount: number;
    }[];
  };
  stats: {
    tier: number;
    essenceStats: {
      order: number;
      creation: number;
      chaos: number;
      arcana: number;
      destruction: number;
    };
    meleeAttack: {
      offense: number;
      range: {
        min: number;
        max: number;
      };
      deadlyRange: number;
      resistancePercent: number;
    };
    rangedAttack: {
      offense: number;
      range: {
        min: number;
        max: number;
      };
      deadlyRange: number;
      resistancePercent: number;
    };
    defense: number;
    attacks: number;
    retaliations: number;
    damage: {
      min: number;
      max: number;
    };
    movement: number;
    initiative: number;
    health: number;
    maxTroopSize: number;
    damageMultiplier: number;
    spellDamageResistance: number;
    statuses: string[] | null;
    size: number;
    canPerformAttacksOfOpportunity: number;
    ignoresZoneOfControlCounter: number;
    restrictions: {
      statistic: number;
      range: {
        min: number;
        max: number;
      };
    }[];
  };
  troopAbility: {
    type: string;
    icon: SpriteDTO;
    name: string;
    description: string;
    bacterias: BacteriaDTO[];
  } | null;
  bacterias: BacteriaDTO[];
};

export type UnitDTO = {
  faction: string;
  vanilla: UnitTypeDTO;
  upgraded: UnitTypeDTO | null;
  superUpgraded: UnitTypeDTO | null;
};
