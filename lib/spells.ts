import spellsCollection from "./collections/spells.json";

import { getTerm } from "./terms";
import { SpriteDTO } from "./sprites";
import { getLocaleBacteria, PureBacteria } from "./bacterias";

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
  target: string,
  circleRadius: number,
  bacteria: PureBacteria,
  locale: string
) => {
  switch (target) {
    case "TilesInCircle":
      if (bacteria.auraSettings?.bacteriaToAdd?.customEffectValue) {
        return getTerm(
          `Spells/Tooltip/Summon/TilesInCircle/PoisonCloud/StepOnto/Damage`,
          locale,
          {
            circleRadius: circleRadius,
            damageAmount:
              bacteria.auraSettings?.bacteriaToAdd?.customEffectValue,
          }
        );
      } else {
        return getTerm(`Spells/Tooltip/Target/TilesInCircle/Damage`, locale, {
          circleRadius: circleRadius,
          damageAmount: bacteria.customEffectValue,
        });
      }
    case "AllTroops":
      return getTerm(`Spells/Tooltip/Target/${target}/Damage`, locale, {
        damageAmount: bacteria.customEffectValue,
      });
  }
  const modifier = bacteria.modifierData[0];
  if (!modifier) {
    return target;
  }
  return getTerm(
    `Spells/Tooltip/Target/${target}/WithMultipleModifiers`,
    locale,
    {
      modifiers: getTerm(
        `Modifiers/${modifier.modifier.replace("Troop", "")}/Description`,
        locale,
        modifier.amountToAdd,
        modifier.modifier
      ),
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
        description: getTargetTerm(
          tier.target,
          tier.circleRadius,
          bacteria,
          locale
        ),
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
    }[];
    requiredCommanderSkills: {
      level: number;
      type: string;
      lore: string;
      name: string;
    }[];
  }[];
};
