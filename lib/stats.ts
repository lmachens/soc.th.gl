import Plausible from "plausible-tracker";

let plausible: ReturnType<typeof Plausible> | null = null;
export const initPlausible = () => {
  if (
    typeof process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN === "string" &&
    typeof process.env.NEXT_PUBLIC_PLAUSIBLE_HOST === "string"
  ) {
    plausible = Plausible({
      domain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
      apiHost: process.env.NEXT_PUBLIC_PLAUSIBLE_HOST,
    });
    plausible.enableAutoPageviews();
  }
};
