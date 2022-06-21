import { BacteriaDTO, getLocaleBacteria } from "./bacterias";
import wieldersCollection from "./collections/wielders.json";
import { SpriteDTO } from "./sprites";
import { getTerm } from "./terms";
import unitsCollection from "./collections/units.json";

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
    units: wielderSrc.units.map((unit) => {
      const unitSrc = unitsCollection.find(
        (unitSrc) =>
          unitSrc.faction === wielderSrc.faction &&
          (unitSrc.vanilla.languageKey === unit.languageKey ||
            unitSrc.upgraded?.languageKey === unit.languageKey)
      );
      const sprite =
        unitSrc!.vanilla.languageKey === unit.languageKey
          ? unitSrc!.vanilla.sprite
          : unitSrc!.upgraded!.sprite;

      return {
        languageKey: unit.languageKey,
        name: getTerm(`${wielderSrc.faction}/${unit.languageKey}/Name`, locale),
        description: getTerm(
          `${wielderSrc.faction}/${unit.languageKey}/Description`,
          locale
        ),
        size: unit.size,
        sprite: sprite,
      };
    }),
    skills: wielderSrc.skills.map((skill) => ({
      type: skill.type,
      lore: getTerm(`Skills/${skill.type}/Lore`, locale),
      name: getTerm(`Skills/${skill.type}`, locale),
      level: skill.level || null,
      levelRange: skill.levelRange || null,
      requiredSkills:
        skill.requiredSkills?.map((requiredSkill) => ({
          type: requiredSkill.type,
          lore: getTerm(`Skills/${requiredSkill.type}/Lore`, locale),
          name: getTerm(`Skills/${requiredSkill.type}`, locale),
          level: requiredSkill.level,
        })) || null,
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
    type: string;
    lore: string;
    name: string;
    level: number | null;
    levelRange: {
      min: number;
      max: number;
    } | null;
    requiredSkills:
      | {
          level: number;
          type: string;
          lore: string;
          name: string;
        }[]
      | null;
  }[];
  units: {
    name: string;
    description: string;
    languageKey: string;
    size: number;
    sprite: SpriteDTO;
  }[];
  specializations: BacteriaDTO[];
};
