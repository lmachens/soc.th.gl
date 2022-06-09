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
  settings?: {
    bacterias: BacteriaDTO[];
  };
  duration?: string;
};

type PureBacteria = {
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
  settings?: {
    bacterias: PureBacteria[];
  };
  duration?: {
    type: number;
    duration: number;
  };
  restriction?: string;
  auraSettings?: {
    recipients: string;
    hexRadius: number;
    bacteriaToAdd: {
      bacteriaType: number;
      duration: {
        type: number;
        duration: number;
      };
    };
    isStackable: number;
    isPassable: number;
  };
};
export const getLocaleBacteria = (
  bacteria: PureBacteria,
  locale: string
): BacteriaDTO => {
  let description = getTerm(
    `Bacterias/${bacteria.type
      .replace("Trait", "")
      .replace(/\d+/g, "")}/Description`,
    locale
  );
  // The description of bacterias with restriction are generated from the restriction type.
  if (!description) {
    if (bacteria.restriction) {
      const restrictionTerm = getTerm(
        `Units/Restrictions/${bacteria.restriction}`,
        locale
      );
      description = getTerm(
        `Bacterias/BattleStackRestriction/Description`,
        locale,
        restrictionTerm
      );
    } else if (bacteria.auraSettings) {
      const recipientsTerm = getTerm(
        `Bacterias/Recipients/Aura/${bacteria.auraSettings.recipients}`,
        locale
      );
      description = getTerm(`Bacterias/AuraBacteria/Description`, locale, [
        recipientsTerm,
        bacteria.auraSettings.hexRadius.toString(),
      ]);
    }
  }

  const result: BacteriaDTO = {
    bacteriaType: bacteria.bacteriaType,
    name: getTerm(
      `Bacterias/${bacteria.type.replace("Trait", "").replace(/\d+/, "")}`,
      locale
    ),
    description,
    modifierData: bacteria.modifierData.map((modifier) => ({
      type: modifier.type,
      description: getTerm(
        `Modifiers/${modifier.modifier.replace("Troop", "")}/Description`,
        locale,
        modifier.amountToAdd,
        modifier.modifier
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
  };
  if (bacteria.settings) {
    result.settings = {
      bacterias: bacteria.settings.bacterias.map((subBacteria) =>
        getLocaleBacteria(subBacteria, locale)
      ),
    };
  }
  if (bacteria.duration) {
    const term =
      bacteria.duration.duration === 1
        ? "Bacterias/Tooltip/Duration/OwnerAttacks0"
        : "Bacterias/Tooltip/Duration/OwnerAttacks1";
    const attacksText = getTerm(term, locale, bacteria.duration.duration);

    result.duration = getTerm(
      "Bacterias/Tooltip/Duration",
      locale,
      attacksText
    );
  }
  return result;
};
