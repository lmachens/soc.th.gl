import Plausible from "plausible-tracker";

let plausible: ReturnType<typeof Plausible> | null = null;
export const initPlausible = (domain: string, apiHost: string) => {
  if (!plausible) {
    plausible = Plausible({
      domain,
      apiHost,
    });
    plausible.enableAutoPageviews();
  }
};
