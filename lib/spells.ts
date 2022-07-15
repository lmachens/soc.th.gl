import spellsCollection from "./collections/spells.json";

import { getTerm, PERCENTAGE_BASED_MODIFIERS } from "./terms";
import { SpriteDTO } from "./sprites";
import { PureBacteria } from "./bacterias";

export const getSpells = (locale: string) => {
  const spells = spellsCollection.map<SpellSimpleDTO>((spell) => ({
    type: spell.type,
    name: getTerm(spell.nameKey, locale),
    description: getTerm(spell.descriptionKey, locale),
    icon: spell.icon,
  }));
  return spells;
};

const getTargetTerm = (
  tier: {
    target: string;
    circleRadius: number;
    amountOfTargets: number;
    effectType: string;
    teleportDestination: string;
    maxTeleportRange: number;
    numberOfTargetTiles: number | null;
    mapEntityToSummon: {
      nameKey: string;
      entityHealthPoints: number | null;
      bacterias: PureBacteria[] | null;
    } | null;
  },
  bacteria: PureBacteria | null,
  locale: string
) => {
  const withMultiple =
    tier.amountOfTargets > 1 ||
    ((tier.target === "Tiles" && tier.numberOfTargetTiles) || 0) > 1;

  if (tier.effectType === "Teleport") {
    return getTerm(
      `Spells/Tooltip/Teleport/Target/${tier.target}/${tier.teleportDestination}`,
      locale,
      {
        maxTeleportRange: tier.maxTeleportRange,
        numberOfEntities: tier.amountOfTargets,
      }
    );
  }

  if (bacteria?.modifierData.length) {
    const modifierTerms = bacteria.modifierData
      .map((modifier) =>
        getTerm(
          `Modifiers/${modifier.modifier.replace("Troop", "")}/Description`,
          locale,
          modifier.amountToAdd,
          modifier.applicationType === 1 ||
            PERCENTAGE_BASED_MODIFIERS.includes(modifier.modifier)
        )
      )
      .join("<br>");
    let key = `Spells/Tooltip/Target/${tier.target}`;

    if (withMultiple) {
      key += "/Multiple";
    }
    if (bacteria.customEffect === "Damage") {
      key += "/Damage";
    }
    key += "/WithMultipleModifiers";
    return getTerm(key, locale, {
      modifiers: `<br>${modifierTerms}`,
      numberOfTroops: tier.amountOfTargets,
      damageAmount: bacteria.customEffectValue,
    });
  }

  if (tier.effectType === "Teleport") {
    return getTerm(
      `Spells/Tooltip/Teleport/Target/${tier.target}/${tier.maxTeleportRange}`,
      locale
    );
  }
  if (tier.effectType === "Summon") {
    if (!tier.mapEntityToSummon) {
      return tier.target;
    }
    const bacteriaToAdd = bacteria?.auraSettings?.bacteriaToAdd;
    let key = tier.mapEntityToSummon.nameKey.split("/").at(-1)!;
    if (withMultiple) {
      key += "/Multiple";
    }
    if (bacteria?.auraSettings?.hexRadius === 0) {
      key += "/StepOnto";
    }
    if (bacteriaToAdd?.customEffect === "Damage") {
      key += "/Damage";
    }
    return getTerm(`Spells/Tooltip/Summon/${tier.target}/${key}`, locale, {
      circleRadius: tier.circleRadius,
      damageAmount: bacteriaToAdd?.customEffectValue,
      numberOfEntities: tier.amountOfTargets,
      entityHealthPoints: tier.mapEntityToSummon.entityHealthPoints,
    });
  }
  if (!bacteria) {
    return tier.target;
  }
  let key = `Spells/Tooltip/Target/${tier.target}`;
  if (withMultiple) {
    key += "/Multiple";
  }
  key += `/${bacteria.customEffect}`;

  return getTerm(key, locale, {
    circleRadius: tier.circleRadius,
    pushDistance: bacteria.customEffectValue,
    damageAmount: bacteria.customEffectValue,
    spreadAmount: bacteria.secondaryCustomEffectValue,
    numberOfTroops: tier.amountOfTargets,
    maxHexagonDistance: 2,
    killAmount: bacteria.customEffectValue,
    numberOfHexagons: tier.numberOfTargetTiles,
  });
};

const getBacteriaDuration = (
  type: string,
  duration: {
    type: string;
    duration: number;
  },
  locale: string
) => {
  if (duration.type === "Once" || duration.type === "Permanent") {
    return "";
  }
  return getTerm(
    `Bacterias/Tooltip/Duration/${duration.type}`,
    locale,
    type === "DestroyMapEntityEmpty"
      ? getTerm(
          "Bacterias/DestroyMapEntityBacteria/None",
          locale,
          duration.duration.toString()
        )
      : duration.duration.toString()
  );
};
export const getSpell = (type: string, locale: string) => {
  const spellSrc = spellsCollection.find((spell) => spell.type === type);
  if (!spellSrc) {
    return null;
  }

  const spell: SpellDTO = {
    type: spellSrc.type,
    name: getTerm(spellSrc.nameKey, locale),
    description: getTerm(spellSrc.descriptionKey, locale),
    icon: spellSrc.icon,
    costs: spellSrc.costs.map((cost) => ({
      type: getTerm(`Units/Types/${cost.type}`, locale),
      amount: cost.amount,
    })),
    tiers: spellSrc.tiers.map((tier) => ({
      tier: tier.tier,
      bacterias: (tier.mapEntityToSummon?.bacterias || tier.bacterias).map(
        (bacteria) => ({
          description: getTargetTerm(tier, bacteria, locale),
          duration: bacteria
            ? getBacteriaDuration(bacteria.type, bacteria.duration, locale)
            : "",
        })
      ),
      requiredCommanderSkills: tier.requiredCommanderSkills.map(
        (requiredSkill) => ({
          type: requiredSkill.type,
          lore: getTerm(`Skills/${requiredSkill.type}/Lore`, locale),
          name: getTerm(`Skills/${requiredSkill.type}`, locale),
          level: requiredSkill.level,
        })
      ),
    })),
  };
  return spell;
};

export type SpellSimpleDTO = {
  type: string;
  name: string;
  description: string;
  icon: SpriteDTO;
};

export type SpellDTO = {
  type: string;
  name: string;
  description: string;
  icon: SpriteDTO;
  costs: {
    type: string;
    amount: number;
  }[];
  tiers: {
    tier: number;
    bacterias: {
      description: string;
      duration: string;
    }[];
    requiredCommanderSkills: {
      level: number;
      type: string;
      lore: string;
      name: string;
    }[];
  }[];
};
