import { getTerm, PERCENTAGE_BASED_MODIFIERS } from "./terms";

export type BacteriaDTO = {
  bacteriaType: number;
  name: string;
  description: string;
  modifierData: {
    type: number;
    description: string;
  }[];
  resourcesIncome: {
    type: string;
    name: string;
    amount: number;
    allTimeAmount: number;
  }[];
  settings?: {
    bacterias?: BacteriaDTO[];
    bacteriaToAddWhenMoving?: BacteriaDTO;
  };
  duration?: string;
};

export type PureBacteria = {
  bacteriaType: number;
  type: string | null;
  modifierData: {
    type: number;
    modifier: string;
    amountToAdd: number;
    applicationType: number;
  }[];
  resourcesIncome: {
    type: string;
    amount: number;
    allTimeAmount: number;
  }[];
  settings?: {
    bacterias?: PureBacteria[];
    bacteriaToAddWhenMoving?: PureBacteria;
  };
  duration?: {
    type: string;
    duration?: number;
  };
  customEffect?: string;
  customEffectValue?: number;
  secondaryCustomEffectValue?: number;
  restriction?: string;
  auraSettings?: {
    recipients: string;
    hexRadius: number;
    bacteriaToAdd: PureBacteria | null;
    isStackable: number;
    isPassable: number;
  };
};
export const getLocaleBacteria = (
  bacteria: PureBacteria,
  locale: string
): BacteriaDTO => {
  let name = "";
  let description = "";
  if (bacteria.type !== null) {
    if (bacteria.type.startsWith("RandomEvent")) {
      const type = bacteria.type.split("RandomEvent")[1];
      name = getTerm(`RandomEvents/${type}`, locale);
      description = "";
    } else {
      name = getTerm(
        `Bacterias/${bacteria.type.replace("Trait", "").replace(/\d+/, "")}`,
        locale
      );
      description = getTerm(
        `Bacterias/${bacteria.type
          .replace("Trait", "")
          .replace(/\d+/g, "")}/Description`,
        locale
      );
    }
  }
  let modifierData = bacteria.modifierData;

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
    } else if (bacteria.customEffect === "Aura" && bacteria.auraSettings) {
      const recipientsTerm = getTerm(
        `Bacterias/Recipients/Aura/${bacteria.auraSettings.recipients}`,
        locale
      );
      description = getTerm(`Bacterias/AuraBacteria/Description`, locale, [
        recipientsTerm,
        bacteria.auraSettings.hexRadius.toString(),
      ]);
      if (bacteria.auraSettings.bacteriaToAdd) {
        modifierData = bacteria.auraSettings.bacteriaToAdd.modifierData;
      }
    }
  }
  if (bacteria.settings?.bacteriaToAddWhenMoving) {
    description = getTerm(
      `Bacterias/TroopMovedBacteria/Description/EachStep`,
      locale
    );
    modifierData = bacteria.settings.bacteriaToAddWhenMoving.modifierData;
  }

  const result: BacteriaDTO = {
    bacteriaType: bacteria.bacteriaType,
    name,
    description,
    modifierData: modifierData.map((modifier) => ({
      type: modifier.type,
      description: getTerm(
        `Modifiers/${modifier.modifier.replaceAll("Troop", "")}/Description`,
        locale,
        modifier.amountToAdd,
        modifier.applicationType === 1 ||
          PERCENTAGE_BASED_MODIFIERS.includes(modifier.modifier)
      ),
    })),
    resourcesIncome: bacteria.resourcesIncome.map((resourceIncome) => ({
      type: resourceIncome.type,
      name: getTerm(`Common/Resource/${resourceIncome.type}`, locale),
      amount: resourceIncome.amount,
      allTimeAmount: resourceIncome.allTimeAmount,
    })),
  };
  if (bacteria.settings?.bacterias) {
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
    const attacksText = getTerm(
      term,
      locale,
      bacteria.duration.duration?.toString()
    );

    result.duration = getTerm(
      "Bacterias/Tooltip/Duration",
      locale,
      attacksText
    );
  }
  return result;
};
