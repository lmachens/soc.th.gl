export type WardenDB = {
  id: number;
  name: string;
  terms: {
    term: string;
    locale: string;
  }[];
  skillPools: {
    name: string;
    requiresSkill: number;
    requirementType: number;
    requiredSkills: {
      skill: number;
      level: number;
    }[];
    evaluationType: number;
    levelRange: {
      min: number;
      max: number;
    };
    levelIntervalStartLevel: number;
    levelInterval: number;
    skills: {
      skill: number;
      requiresSkill: number;
      requirementType: number;
      requiredSkills: {
        skill: number;
        level: number;
      }[];
    }[];
  }[];
};

export type WardenDTO = {
  id: number;
  name: string;
  term: string;
  skillPools: {
    name: string;
    requiresSkill: number;
    requirementType: number;
    requiredSkills: {
      skill: number;
      level: number;
    }[];
    evaluationType: number;
    levelRange: {
      min: number;
      max: number;
    };
    levelIntervalStartLevel: number;
    levelInterval: number;
    skills: {
      skill: number;
      requiresSkill: number;
      requirementType: number;
      requiredSkills: {
        skill: number;
        level: number;
      }[];
    }[];
  }[];
};
