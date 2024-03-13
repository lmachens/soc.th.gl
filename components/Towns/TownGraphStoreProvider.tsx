import { createContext, useContext, useRef } from "react";
import { Edge, Node } from "reactflow";
import { StoreApi, useStore } from "zustand";

import { NodePlain } from "../../lib/towns";
import createUseTownStore, { TownGraphState } from "./store";

const TownGraphContext = createContext<TownGraphState | null>(null);

interface TownGraphStoreProps {
  children: React.ReactNode;
  initialNodes: Node[];
  initialEdges: Edge[];
  keyToNode: { [key: string]: NodePlain };
}

export const useStoreFromContext = (selector: any): TownGraphState => {
  const store = useContext(TownGraphContext);
  if (!store) {
    throw new Error(
      "useStoreFromContext must be used within a <TownGraphStoreProvider />."
    );
  }
  return useStore(store as any, selector);
};

const TownGraphStoreProvider = ({
  children,
  initialNodes,
  initialEdges,
  keyToNode,
}: TownGraphStoreProps) => {
  const storeRef = useRef<StoreApi<TownGraphState> | null>(null);

  const existingNodeKeys = storeRef.current
    ? storeRef.current.getState().nodes.map((node) => node.id)
    : [];
  const incomingNodeKeys = initialNodes.map((node) => node.id);
  // Building nodes remain constant for any given town.
  if (existingNodeKeys.join("") !== incomingNodeKeys.join("")) {
    storeRef.current = createUseTownStore(
      initialNodes,
      initialEdges,
      keyToNode
    );
  }

  return (
    <TownGraphContext.Provider value={storeRef.current as any}>
      {children}
    </TownGraphContext.Provider>
  );
};

export default TownGraphStoreProvider;
