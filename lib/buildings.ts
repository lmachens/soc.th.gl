import { BacteriaDTO, getLocaleBacteria } from "./bacterias";
import buildingsCollection from "./collections/buildings.json";
import factionsCollection from "./collections/factions.json";
import { getFactions } from "./factions";
import { SpriteDTO } from "./sprites";
import { getTerm } from "./terms";
import { getUnit } from "./units";

export const getBuildings = (locale: string) => {
  const buildings = buildingsCollection.map<BuildingSimpleDTO>((building) => {
    const faction = factionsCollection.find(
      (faction) => faction.id === building.factionId
    )!;

    return {
      id: building.id,
      type: building.nameKey,
      factionId: building.factionId,
      factionName: getTerm(`Factions/${faction.languageKey}/Name`, locale),
      name: getTerm(building.nameKey, locale),
      description: getTerm(building.descriptionKey, locale),
      portraits: building.portraits,
    };
  });
  return buildings;
};

export const getBuilding = (
  type: string,
  locale: string
): BuildingDTO | null => {
  const factions = getFactions(locale);

  const buildingSrc = buildingsCollection.find(
    (building) => building.nameKey === type
  );
  if (!buildingSrc) {
    return null;
  }

  const building: BuildingDTO = {
    id: buildingSrc.id,
    type: buildingSrc.nameKey,
    factionId: buildingSrc.factionId,
    factionName: factions.find(
      (faction) => faction.id === buildingSrc.factionId
    )!.name,
    name: getTerm(buildingSrc.nameKey, locale),
    description: getTerm(buildingSrc.descriptionKey, locale),
    portraits: buildingSrc.portraits,
    baseViewRadius: buildingSrc.baseViewRadius,
    requirements: {
      costEntries: buildingSrc.requirements.costEntries.map((costEntry) => ({
        type: getTerm(`Common/Resource/${costEntry.type}`, locale),
        amount: costEntry.amount,
      })),
      requiredBuildings: buildingSrc.requirements.requiredBuildings.map(
        (buildingId) =>
          getTerm(
            buildingsCollection.find((building) => building.id === buildingId)!
              .nameKey,
            locale
          )
      ),
    },
  };
  if (buildingSrc.levelUpgrades) {
    building.levelUpgrades = buildingSrc.levelUpgrades.map((levelUpgrade) => ({
      costEntries: levelUpgrade.costEntries.map((costEntry) => ({
        type: getTerm(`Common/Resource/${costEntry.type}`, locale),
        amount: costEntry.amount,
      })),
      requiredBuildings: levelUpgrade.requiredBuildings.map((buildingId) =>
        getTerm(
          buildingsCollection.find((building) => building.id === buildingId)!
            .nameKey,
          locale
        )
      ),
    }));
  }
  if (buildingSrc.incomePerLevel) {
    building.incomePerLevel = buildingSrc.incomePerLevel.map(
      (incomePerLevel) => ({
        level: incomePerLevel.level,
        resources: incomePerLevel.resources.map((resource) => ({
          type: getTerm(`Common/Resource/${resource.type}`, locale),
          amount: resource.amount,
        })),
        troopIncomes: incomePerLevel.troopIncomes.map((troopIncome) => {
          const unit = getUnit(
            troopIncome.factionKey,
            troopIncome.unitKey,
            locale
          )!;
          const upgrade =
            unit[
              troopIncome.upgradeType as
                | "vanilla"
                | "upgraded"
                | "superUpgraded"
            ]!;

          return {
            factionKey: troopIncome.factionKey,
            unitKey: troopIncome.unitKey,
            name: upgrade.name,
            description: upgrade.description,
            size: troopIncome.size,
          };
        }),
      })
    );
  }

  if (buildingSrc.stacks) {
    building.stacks = buildingSrc.stacks.map((stack) => ({
      name: getTerm(stack.nameKey, locale),
      description: stack.descriptionKey
        ? getTerm(stack.descriptionKey, locale)
        : "",
      icon: stack.icon,
      research: stack.research.map((research) => ({
        id: research.id,
        name: research.nameKey ? getTerm(research.nameKey, locale) : "",
        description: research.descriptionKey
          ? getTerm(research.descriptionKey, locale)
          : "",
        costEntries: research.costEntries.map((costEntry) => ({
          type: getTerm(`Common/Resource/${costEntry.type}`, locale),
          amount: costEntry.amount,
        })),
        bacterias: research.bacterias.map((bacteria) =>
          getLocaleBacteria(bacteria, locale)
        ),
      })),
    }));
  }
  return building;
};

export type BuildingSimpleDTO = {
  id: number;
  type: string;
  factionId: number;
  factionName: string;
  name: string;
  description: string;
  portraits: SpriteDTO[];
};

export type BuildingDTO = {
  id: number;
  type: string;
  factionId: number;
  factionName: string;
  name: string;
  description: string;
  portraits: SpriteDTO[];
  requirements: {
    costEntries: {
      type: string;
      amount: number;
    }[];
    requiredBuildings: string[];
  };
  levelUpgrades?: {
    costEntries: {
      type: string;
      amount: number;
    }[];
    requiredBuildings: string[];
  }[];
  baseViewRadius: number;
  incomePerLevel?: {
    level: number;
    resources: {
      type: string;
      amount: number;
    }[];
    troopIncomes: {
      factionKey: string;
      unitKey: string;
      name: string;
      description: string;
      size: number;
    }[];
  }[];
  stacks?: {
    name: string;
    description: string;
    icon: SpriteDTO;
    research: {
      id: number;
      name: string;
      description: string;
      costEntries: {
        type: string;
        amount: number;
      }[];
      bacterias: BacteriaDTO[];
    }[];
  }[];
};
