import { createContext, ReactNode, useContext } from "react";
import { TermsDTO } from "../../lib/terms";

export const termsContext = createContext<{
  terms: TermsDTO;
}>({
  terms: {},
});

export const TermsProvider = ({
  children,
  terms,
}: {
  children: ReactNode;
  terms: TermsDTO;
}) => {
  return (
    <termsContext.Provider value={{ terms }}>{children}</termsContext.Provider>
  );
};

export const useTerms = () => useContext(termsContext).terms;
