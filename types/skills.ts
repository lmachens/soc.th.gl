export type ModifierDataDTO = {
  type: number;
  applicationType: 0 | 1;
  amountToAdd: number;
};

export type SkillDB = {
  id: number;
  name: string;
  terms: {
    term: string;
    locale: string;
  }[];
  loreTerms: {
    term: string;
    locale: string;
  }[];
  levels: {
    level: number;
    terms: {
      term: string;
      locale: string;
    }[];
    modifierData?: ModifierDataDTO[];
    resourcesIncome: {
      type: number;
      amount: number;
      allTimeAmount: number;
    }[];
    durations?: {
      type: number;
      duration: number;
    }[];
  }[];
  sprite?: {
    x: number;
    y: number;
  };
};

export type SkillDTO = {
  id: number;
  name: string;
  term: string;
  loreTerm: string;
  levels: {
    level: number;
    term: string;
    modifierData?: ModifierDataDTO[];
    resourcesIncome?: {
      type: number;
      amount: number;
      allTimeAmount: number;
    }[];
    durations?: {
      type: number;
      duration: number;
    }[];
  }[];
  sprite?: {
    x: number;
    y: number;
  };
};
