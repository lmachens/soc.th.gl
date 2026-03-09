import { BacteriaDTO, getLocaleBacteria } from "./bacterias";
import unitsCollection from "./collections/units.json";
import { SpriteDTO } from "./sprites";
import { getTerm } from "./terms";

const UPGRADE_KEYS = [
  "upgraded",
  "superUpgraded",
  "arcanaUpgraded",
  "creationUpgraded",
  "orderUpgraded",
] as const;

export const getUnits = (locale: string): UnitSimpleDTO[] => {
  const localizeVariant = (
    faction: string,
    variant: (typeof unitsCollection)[number]["vanilla"] | null
  ) => {
    if (!variant) return null;
    return {
      ...variant,
      stats: {
        ...variant.stats,
        statuses: variant.stats.statuses
          ? variant.stats.statuses.map((status) =>
              getTerm(`Common/BacteriaOwnerStatus/${status}`, locale)
            )
          : null,
      },
      name: getTerm(`${faction}/${variant.languageKey}/Name`, locale),
      description: getTerm(
        `${faction}/${variant.languageKey}/Description`,
        locale
      ),
    };
  };

  const units = unitsCollection.map((unit) => {
    const result: any = {
      ...unit,
      vanilla: localizeVariant(unit.faction, unit.vanilla)!,
    };
    for (const key of UPGRADE_KEYS) {
      result[key] = localizeVariant(unit.faction, (unit as any)[key]);
    }
    return result;
  });
  return units;
};

export const getUnit = (
  faction: string,
  type: string,
  locale: string
): UnitDTO | null => {
  const unitSrc = unitsCollection.find(
    (unit) =>
      unit.faction === faction &&
      (unit.vanilla.languageKey === type ||
        UPGRADE_KEYS.some(
          (key) => (unit as any)[key]?.languageKey === type
        ))
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
      purchaseCost: {
        costEntries: type.purchaseCost.costEntries.map((costEntry) => ({
          type: getTerm(`Common/Resource/${costEntry.type}`, locale),
          amount: costEntry.amount,
        })),
      },
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
            // icon: type.troopAbility.icon,
            icon: null,
            name: getTerm(
              "Units/Tooltip/TroopAbility",
              locale,
              getTerm(`Units/Abilities/${type.troopAbility.type}`, locale)
            ),
            description: getTerm(
              `Units/Abilities/${type.troopAbility.type}/Description`,
              locale
            ),
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

  const unit: any = {
    ...unitSrc,
    vanilla: getType(unitSrc.vanilla)!,
  };
  for (const key of UPGRADE_KEYS) {
    unit[key] = getType((unitSrc as any)[key]);
  }
  return unit;
};

type UnitVariantSimpleDTO = {
  languageKey: string;
  sprite?: SpriteDTO;
  name: string;
  description: string;
  stats?: UnitTypeDTO["stats"];
  bacterias?: { type: string }[];
};

export type UnitSimpleDTO = {
  faction: string;
  vanilla: UnitVariantSimpleDTO;
  upgraded: UnitVariantSimpleDTO | null;
  superUpgraded: UnitVariantSimpleDTO | null;
  arcanaUpgraded: UnitVariantSimpleDTO | null;
  creationUpgraded: UnitVariantSimpleDTO | null;
  orderUpgraded: UnitVariantSimpleDTO | null;
};

export type UnitTypeDTO = {
  languageKey: string;
  sprite?: SpriteDTO;
  name: string;
  description: string;
  purchaseCost: {
    costEntries: {
      type: string;
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
    icon: SpriteDTO | null;
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
  arcanaUpgraded: UnitTypeDTO | null;
  creationUpgraded: UnitTypeDTO | null;
  orderUpgraded: UnitTypeDTO | null;
};
