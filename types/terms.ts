export type TermDB = {
  type: string;
  id?: number;
  name?: string;
  pluralForm?: number;
  terms: {
    term: string;
    locale: string;
  }[];
};

export type TermDTO = {
  type: string;
  id?: number;
  name?: string;
  pluralForm?: number;
  term: string;
};
