import { createContext, useContext } from "react";

export const TermsContext = createContext<{ [key: string]: string }>({});
export const useTerms = () => useContext(TermsContext);
