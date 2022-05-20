import skillsCollection from "./collections/skills.json";

import { getTerm } from "./terms";
import { SpriteDTO } from "./sprites";
import { RESOURCE_TYPES } from "./bacterias";

export const getSkills = (locale: string) => {
  const skills = skillsCollection.map<SkillSimpleDTO>((skill) => ({
    type: skill.type,
    name: getTerm(`Skills/${skill.type}`, locale),
    lore: getTerm(`Skills/${skill.type}/Lore`, locale),
    icon: skill.icon,
  }));
  return skills;
};

export const getSkill = (type: string, locale: string) => {
  const skillSrc = skillsCollection.find((skill) => skill.type === type);
  if (!skillSrc) {
    return null;
  }

  const skill: SkillDTO = {
    type: skillSrc.type,
    name: getTerm(`Skills/${skillSrc.type}`, locale),
    lore: getTerm(`Skills/${skillSrc.type}/Lore`, locale),
    icon: skillSrc.icon,
    levels: skillSrc.levels.map((level, index) => ({
      name: getTerm(`Common/Level`, locale, index + 1),
      description: getTerm(
        `Skills/${skillSrc.type}/Level${index + 1}/Description`,
        locale
      ),
      bacteriaType: level.bacteriaType,
      modifierData: level.modifierData.map((modifier) => ({
        type: modifier.type,
        description: getTerm(
          `Modifiers/${modifier.modifier.replace("Troop", "")}/Description`,
          locale,
          modifier.amountToAdd,
          modifier.applicationType ||
            Number(modifier.modifier === "CommanderTutorPercent")
        ),
      })),
      resourcesIncome: level.resourcesIncome.map((resourceIncome) => ({
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
  return skill;
};

export type SkillSimpleDTO = {
  type: string;
  name: string;
  lore: string;
  icon: SpriteDTO;
};

export type SkillDTO = {
  type: string;
  name: string;
  lore: string;
  icon: SpriteDTO;
  levels: {
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
  }[];
};
