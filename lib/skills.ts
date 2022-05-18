import skillCollection from "./collections/skill.json";
import bacteriaCollection from "./collections/bacteria.json";

import { getTerm } from "./terms";
import { SpriteDTO } from "./sprites";

export const getSkills = (locale: string) => {
  const skills = skillCollection.map<SkillSimpleDTO>((skill) => ({
    type: skill.type,
    name: getTerm(`Skills/${skill.type}`, locale),
    lore: getTerm(`Skills/${skill.type}/Lore`, locale),
    icon: skill.icon,
  }));
  return skills;
};

export const getSkill = (type: string, locale: string) => {
  const skillSrc = skillCollection.find((skill) => skill.type === type);
  if (!skillSrc) {
    return null;
  }

  const skill: SkillDTO = {
    type: skillSrc.type,
    name: getTerm(`Skills/${skillSrc.type}`, locale),
    lore: getTerm(`Skills/${skillSrc.type}/Lore`, locale),
    icon: skillSrc.icon,
    levels: skillSrc.levels.map((level, index) => {
      const bacteria = bacteriaCollection.find(
        (bacteria) => bacteria.id === level.bacterias[0].type
      )!;
      return {
        name: getTerm(`Common/Level`, locale, index + 1),
        description: getTerm(
          `Skills/${skillSrc.type}/Level${index + 1}/Description`,
          locale
        ),
        modifierData:
          bacteria.modifierData?.map((modifier) => ({
            type: modifier.type,
            description: getTerm(
              `Modifiers/${modifier.modifier.replace("Troop", "")}/Description`,
              locale,
              modifier.amountToAdd,
              modifier.applicationType ||
                Number(modifier.modifier === "CommanderTutorPercent")
            ),
          })) || [],
        resourcesIncome:
          bacteria.income?.resources.map((resource) => ({
            type: resource.type,
            amount: resource.amount,
            allTimeAmount: resource.allTimeAmount,
          })) || [],
      };
    }),
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
      amount: number;
      allTimeAmount: number;
    }[];
  }[];
};
