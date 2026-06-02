import { createContext, useContext, useEffect, useMemo, useState, ReactNode, useCallback } from "react";
import { Contractor, contractors as seed, QUARTERS, Quarter } from "@/apps/matrix/data/contractors";

const STORAGE_KEY = "dm-3pl-contractors-v1";
const QUARTERS_KEY = "dm-3pl-quarters-v1";

export type QuarterData = Record<string, Partial<Record<Quarter, { volume: string; cost: string }>>>;

interface Ctx {
  list: Contractor[];
  quarters: QuarterData;
  updateContractor: (id: string, patch: Partial<Contractor>) => void;
  addContractor: (c: Contractor) => void;
  removeContractor: (id: string) => void;
  updateQuarter: (id: string, q: Quarter, patch: { volume?: string; cost?: string }) => void;
  resetAll: () => void;
}

const ContractorsContext = createContext<Ctx | null>(null);

export function ContractorsProvider({ children }: { children: ReactNode }) {
  const [list, setList] = useState<Contractor[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return seed;
  });

  const [quarters, setQuarters] = useState<QuarterData>(() => {
    try {
      const raw = localStorage.getItem(QUARTERS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return {};
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }, [list]);

  useEffect(() => {
    localStorage.setItem(QUARTERS_KEY, JSON.stringify(quarters));
  }, [quarters]);

  const updateContractor = useCallback((id: string, patch: Partial<Contractor>) => {
    setList((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }, []);

  const addContractor = useCallback((c: Contractor) => {
    setList((prev) => [c, ...prev]);
  }, []);

  const removeContractor = useCallback((id: string) => {
    setList((prev) => prev.filter((c) => c.id !== id));
    setQuarters((prev) => {
      const n = { ...prev };
      delete n[id];
      return n;
    });
  }, []);

  const updateQuarter = useCallback(
    (id: string, q: Quarter, patch: { volume?: string; cost?: string }) => {
      setQuarters((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          [q]: { volume: "", cost: "", ...prev[id]?.[q], ...patch },
        },
      }));
    },
    []
  );

  const resetAll = useCallback(() => {
    setList(seed);
    setQuarters({});
  }, []);

  const value = useMemo(
    () => ({ list, quarters, updateContractor, addContractor, removeContractor, updateQuarter, resetAll }),
    [list, quarters, updateContractor, addContractor, removeContractor, updateQuarter, resetAll]
  );

  return <ContractorsContext.Provider value={value}>{children}</ContractorsContext.Provider>;
}

export function useContractors() {
  const ctx = useContext(ContractorsContext);
  if (!ctx) throw new Error("useContractors must be used within ContractorsProvider");
  return ctx;
}

export { QUARTERS };
