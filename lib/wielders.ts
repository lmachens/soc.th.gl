import { RESOURCE_TYPES } from "./bacterias";
import wieldersCollection from "./collections/wielders.json";
import { SpriteDTO } from "./sprites";
import { getTerm } from "./terms";

export const getWielders = (locale: string): WielderSimpleDTO[] => {
  const wielders = wieldersCollection.map((wielder) => ({
    ...wielder,
    name: getTerm(`${wielder.faction}/${wielder.type}/Name`, locale),
    description: getTerm(
      `${wielder.faction}/${wielder.type}/Description`,
      locale
    ),
  }));
  return wielders;
};

export const getWielder = (type: string, locale: string): WielderDTO | null => {
  const wielderSrc = wieldersCollection.find(
    (wielder) => wielder.type === type
  );
  if (!wielderSrc) {
    return null;
  }

  const wielder = {
    ...wielderSrc,
    name: getTerm(`${wielderSrc.faction}/${wielderSrc.type}/Name`, locale),
    description: getTerm(
      `${wielderSrc.faction}/${wielderSrc.type}/Description`,
      locale
    ),
    units: wielderSrc.units.map((unit) => ({
      name: getTerm(`${wielderSrc.faction}/${unit.languageKey}/Name`, locale),
      size: unit.size,
    })),
    skills: wielderSrc.skills.map((skill) => ({
      id: skill.id,
      name: getTerm(`Skills/${skill.type}`, locale),
      level: skill.level,
    })),
    specializations: wielderSrc.specializations.map((specialization) => ({
      bacteriaType: specialization.bacteriaType,
      modifierData: specialization.modifierData.map((modifier) => ({
        type: modifier.type,
        description: getTerm(
          `Modifiers/${modifier.modifier.replace("Troop", "")}/Description`,
          locale,
          modifier.amountToAdd,
          modifier.applicationType ||
            Number(modifier.modifier === "CommanderTutorPercent")
        ),
      })),
      resourcesIncome: specialization.resourcesIncome.map((resourceIncome) => ({
        type: resourceIncome.type,
        name: getTerm(
          `Common/Resource/${RESOURCE_TYPES[resourceIncome.type]}`,
          locale
        ),
        amount: resourceIncome.amount,
        allTimeAmount: resourceIncome.allTimeAmount,
      })),
    })),
  };
  return wielder;
};

export type WielderSimpleDTO = {
  type: string;
  faction: string;
  portrait: SpriteDTO;
  name: string;
  description: string;
};

export type WielderDTO = {
  type: string;
  faction: string;
  portrait: SpriteDTO;
  name: string;
  description: string;
  stats: {
    defense: number;
    offense: number;
    movement: number;
    viewRadius: number;
    command: number;
  };
  skills: {
    id: number;
    name: string;
    level: number;
  }[];
  units: {
    name: string;
    size: number;
  }[];
  specializations: {
    bacteriaType: number;
    modifierData: {
      type: number;
      description: string;
    }[];
    resourcesIncome: {
      type: number;
      name: string;
      amount: number;
      allTimeAmount: number;
    }[];
  }[];
};
