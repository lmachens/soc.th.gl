import buildingsCollection from "./collections/buildings.json";
import { SpriteDTO } from "./sprites";
import { getTerm } from "./terms";

export const getBuildings = (locale: string) => {
  const buildings = buildingsCollection.map<BuildingSimpleDTO>((building) => ({
    id: building.id,
    type: building.nameKey,
    factionId: building.factionId,
    name: getTerm(building.nameKey, locale),
    description: getTerm(building.descriptionKey, locale),
    portraits: building.portraits,
  }));
  return buildings;
};

export const getBuilding = (
  type: string,
  locale: string
): BuildingDTO | null => {
  const buildingSrc = buildingsCollection.find(
    (building) => building.nameKey === type
  );
  if (!buildingSrc) {
    return null;
  }

  return {
    id: buildingSrc.id,
    type: buildingSrc.nameKey,
    factionId: buildingSrc.factionId,
    name: getTerm(buildingSrc.nameKey, locale),
    description: getTerm(buildingSrc.descriptionKey, locale),
    portraits: buildingSrc.portraits,
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
};

export type BuildingSimpleDTO = {
  id: number;
  type: string;
  factionId: number;
  name: string;
  description: string;
  portraits: SpriteDTO[];
};

export type BuildingDTO = {
  id: number;
  type: string;
  factionId: number;
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
};
