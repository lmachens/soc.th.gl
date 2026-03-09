import { BacteriaDTO, getLocaleBacteria } from "./bacterias";
import unitsCollection from "./collections/units.json";
import wieldersCollection from "./collections/wielders.json";
import { SkillSimpleDTO, getSkills } from "./skills";
import { SpriteDTO } from "./sprites";
import { getTerm } from "./terms";

export const getWielders = (locale: string): WielderSimpleDTO[] => {
  const wielders = wieldersCollection.map((wielder) => ({
    type: wielder.type,
    stats: wielder.stats,
    portrait: wielder.portrait,
    factionName: getTerm(`Factions/${wielder.faction}/Name`, locale),
    name: getTerm(`${wielder.faction}/${wielder.type}/Name`, locale),
    description: getTerm(
      `${wielder.faction}/${wielder.type}/Description`,
      locale
    ),
    ...(wielder.dlc ? { dlc: wielder.dlc } : {}),
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
  const skills = getSkills(locale);

  const wielder: WielderDTO = {
    type: wielderSrc.type,
    race: getTerm(`Common/Race/${wielderSrc.race}`, locale),
    commanderClassName: getTerm(
      `Commanders/Class/${wielderSrc.commanderClass}`,
      locale
    ),
    faction: wielderSrc.faction,
    factionName: getTerm(`Factions/${wielderSrc.faction}/Name`, locale),
    portrait: wielderSrc.portrait,
    stats: wielderSrc.stats,
    name: getTerm(`${wielderSrc.faction}/${wielderSrc.type}/Name`, locale),
    description: getTerm(
      `${wielderSrc.faction}/${wielderSrc.type}/Description`,
      locale
    ),
    units: wielderSrc.units.map((unit) => {
      const VARIANT_KEYS = [
        "vanilla",
        "upgraded",
        "superUpgraded",
        "arcanaUpgraded",
        "creationUpgraded",
        "orderUpgraded",
      ] as const;
      const unitSrc = unitsCollection.find(
        (unitSrc) =>
          unitSrc.faction === wielderSrc.faction &&
          VARIANT_KEYS.some(
            (key) =>
              (unitSrc as any)[key]?.languageKey === unit.languageKey
          )
      );
      const matchedVariant = unitSrc
        ? VARIANT_KEYS.find(
            (key) =>
              (unitSrc as any)[key]?.languageKey === unit.languageKey
          )
        : undefined;
      const sprite = matchedVariant
        ? (unitSrc as any)[matchedVariant]?.sprite
        : unitSrc?.vanilla.sprite;

      return {
        languageKey: unit.languageKey,
        name: getTerm(`${wielderSrc.faction}/${unit.languageKey}/Name`, locale),
        description: getTerm(
          `${wielderSrc.faction}/${unit.languageKey}/Description`,
          locale
        ),
        size: unit.size,
        sprite: sprite || null,
      };
    }),
    startingSkills: wielderSrc.startingSkills.map((skill) => ({
      ...skills.find((skillSrc) => skillSrc.type === skill.type)!,
      level: skill.level,
    })),
    skillPools: wielderSrc.skillPools.map((skillPool) => ({
      name: skillPool.name,
      evaluationType: skillPool.evaluationType,
      levelRange: skillPool.levelRange,
      levelIntervalStartLevel: skillPool.levelIntervalStartLevel,
      levelInterval: skillPool.levelInterval,
      skills: skillPool.skills.map((skill) => ({
        ...skills.find((skillSrc) => skillSrc.type === skill.type)!,
        requiresSkill: skill.requiresSkill || null,
        requirementType:
          (skill.requirementType as "RequireAny" | "RequireAll" | undefined) ||
          null,
        requiredSkills:
          skill.requiredSkills?.map((requiredSkill) => ({
            ...skills.find((skillSrc) => skillSrc.type === requiredSkill.type)!,
            level: requiredSkill.level,
          })) || null,
      })),
    })),
    specializations: wielderSrc.specializations.map((specialization) =>
      getLocaleBacteria(specialization, locale)
    ),
    ...(wielderSrc.dlc ? { dlc: wielderSrc.dlc } : {}),
  };

  return wielder;
};

export type WielderSimpleDTO = {
  type: string;
  factionName: string;
  portrait: SpriteDTO;
  name: string;
  description: string;
  dlc?: string;
  stats: {
    defense: number;
    offense: number;
    movement: number;
    viewRadius: number;
    command: number;
  };
};

export type SkillPoolSkillDTO = SkillSimpleDTO & {
  requiresSkill: boolean | null;
  requirementType: "RequireAny" | "RequireAll" | null;
  requiredSkills: (SkillSimpleDTO & {
    level: number;
  })[];
};

export type SkillPoolDTO = {
  name: string;
  evaluationType: string;
  levelRange: {
    min: number;
    max: number;
  };
  levelIntervalStartLevel: number;
  levelInterval: number;
  skills: SkillPoolSkillDTO[];
};

export type WielderDTO = {
  type: string;
  race: string;
  commanderClassName: string;
  faction: string;
  factionName: string;
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
  startingSkills: (SkillSimpleDTO & { level: number })[];
  skillPools: SkillPoolDTO[];
  units: {
    name: string;
    description: string;
    languageKey: string;
    size: number;
    sprite?: SpriteDTO;
  }[];
  specializations: BacteriaDTO[];
  dlc?: string;
};
