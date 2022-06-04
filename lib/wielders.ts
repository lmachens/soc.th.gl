import { BacteriaDTO, getLocaleBacteria } from "./bacterias";
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
      languageKey: unit.languageKey,
      name: getTerm(`${wielderSrc.faction}/${unit.languageKey}/Name`, locale),
      description: getTerm(
        `${wielderSrc.faction}/${unit.languageKey}/Description`,
        locale
      ),
      size: unit.size,
    })),
    skills: wielderSrc.skills.map((skill) => ({
      id: skill.id,
      type: skill.type,
      lore: getTerm(`Skills/${skill.type}/Lore`, locale),
      name: getTerm(`Skills/${skill.type}`, locale),
      level: skill.level,
    })),
    skillPools: wielderSrc.skillPool.pools.map((pool) => ({
      ...pool,
      skills: pool.skills.map((skill) => ({
        ...skill,
        lore: getTerm(`Skills/${skill.type}/Lore`, locale),
        name: getTerm(`Skills/${skill.type}`, locale),
        requiredSkills: skill.requiredSkills.map((requiredSkill) => ({
          ...requiredSkill,
          lore: getTerm(`Skills/${requiredSkill.type}/Lore`, locale),
          name: getTerm(`Skills/${requiredSkill.type}`, locale),
        })),
      })),
    })),
    specializations: wielderSrc.specializations.map((specialization) =>
      getLocaleBacteria(specialization, locale)
    ),
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
    type: string;
    lore: string;
    name: string;
    level: number;
  }[];
  units: {
    name: string;
    description: string;
    languageKey: string;
    size: number;
  }[];
  specializations: BacteriaDTO[];
  skillPools: {
    name: string;
    requiresSkill: number;
    requirementType: number;
    evaluationType: number;
    levelRange: {
      min: number;
      max: number;
    };
    levelIntervalStartLevel: number;
    levelInterval: number;
    skills: {
      lore: string;
      name: string;
      skill: number;
      requiresSkill: number;
      requirementType: number;
      requiredSkills: {
        skill: number;
        level: number;
        type: string;
        lore: string;
        name: string;
      }[];
      type: string;
    }[];
  }[];
};
