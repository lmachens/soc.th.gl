import type { ReactNode } from "react";

import { useHydrated } from "./useHydrated";

type ClientOnlyProps = {
  children: () => ReactNode;
  fallback?: ReactNode;
};

export function ClientOnly({ children, fallback }: ClientOnlyProps) {
  const hydrated = useHydrated();
  return <>{hydrated ? children() : fallback}</>;
}
