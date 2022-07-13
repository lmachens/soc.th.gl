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
    effectType: string;
    teleportDestination: string;
    maxTeleportRange: number;
  },
  bacteria: PureBacteria | null,
  locale: string
) => {
  console.log(tier, bacteria);
  if (tier.effectType === "Teleport") {
    return getTerm(
      `Spells/Tooltip/Teleport/Target/${tier.target}/${tier.teleportDestination}`,
      locale,
      { maxTeleportRange: tier.maxTeleportRange }
    );
  }
  if (!bacteria) {
    return tier.target;
  }
  if (!bacteria.modifierData.length) {
    if (tier.effectType === "Teleport") {
      return getTerm(
        `Spells/Tooltip/Teleport/Target/${tier.target}/${tier.maxTeleportRange}`,
        locale
      );
    }
    if (tier.effectType === "Summon") {
      return getTerm(
        `Spells/Tooltip/Summon/${tier.target}/PoisonCloud/StepOnto/Damage`,
        locale,
        {
          circleRadius: tier.circleRadius,
          damageAmount: bacteria.auraSettings?.bacteriaToAdd?.customEffectValue,
        }
      );
    }
    return getTerm(
      `Spells/Tooltip/Target/${tier.target}/${bacteria.customEffect}`,
      locale,
      {
        circleRadius: tier.circleRadius,
        pushDistance: bacteria.customEffectValue,
        damageAmount: bacteria.customEffectValue,
      }
    );
  }

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

  return getTerm(
    `Spells/Tooltip/Target/${tier.target}/WithMultipleModifiers`,
    locale,
    {
      modifiers: `<br>${modifierTerms}`,
    }
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
      bacterias: tier.bacterias.map((bacteria) => ({
        description: getTargetTerm(tier, bacteria, locale),
        duration: bacteria
          ? getTerm(
              `Bacterias/Tooltip/Duration/${bacteria.duration.type}`,
              locale,
              bacteria.duration.duration.toString()
            )
          : "",
      })),
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
