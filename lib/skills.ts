import skillsCollection from "./collections/skills.json";

import { getTerm } from "./terms";
import { SpriteDTO } from "./sprites";
import { BacteriaDTO, getLocaleBacteria } from "./bacterias";

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
      levelName: getTerm(`Common/Level`, locale, index + 1),
      levelDescription: getTerm(
        `Skills/${skillSrc.type}/Level${index + 1}/Description`,
        locale
      ),
      ...getLocaleBacteria(level, locale),
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
  levels: ({
    levelName: string;
    levelDescription: string;
  } & BacteriaDTO)[];
};
