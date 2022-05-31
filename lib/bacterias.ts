import { getTerm } from "./terms";

export const RESOURCE_TYPES = [
  "Gold",
  "Wood",
  "Stone",
  "AncientAmber",
  "Glimmerweave",
  "CelestialOre",
];

export type BacteriaDTO = {
  bacteriaType: number;
  name: string;
  description: string;
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
};

export const getLocaleBacteria = (
  bacteria: {
    bacteriaType: number;
    type: string;
    modifierData: {
      type: number;
      modifier: string;
      amountToAdd: number;
      applicationType: number;
    }[];
    resourcesIncome: {
      type: number;
      amount: number;
      allTimeAmount: number;
    }[];
  },
  locale: string
): BacteriaDTO => ({
  bacteriaType: bacteria.bacteriaType,
  name: getTerm(
    `Bacterias/${bacteria.type.replace("Trait", "").replace(/\d+/, "")}`,
    locale
  ),
  description: getTerm(
    `Bacterias/${bacteria.type
      .replace("Trait", "")
      .replace(/\d+/g, "")}/Description`,
    locale
  ),
  modifierData: bacteria.modifierData.map((modifier) => ({
    type: modifier.type,
    description: getTerm(
      `Modifiers/${modifier.modifier.replace("Troop", "")}/Description`,
      locale,
      modifier.amountToAdd,
      modifier.applicationType ||
        Number(modifier.modifier === "CommanderTutorPercent")
    ),
  })),
  resourcesIncome: bacteria.resourcesIncome.map((resourceIncome) => ({
    type: resourceIncome.type,
    name: getTerm(
      `Common/Resource/${RESOURCE_TYPES[resourceIncome.type]}`,
      locale
    ),
    amount: resourceIncome.amount,
    allTimeAmount: resourceIncome.allTimeAmount,
  })),
});
