import { createContext, useContext, useState, ReactNode } from "react";

export type Entry = {
  id: string;
  text: string;
};

type EntriesContextType = {
  entries: Entry[];
  addEntry: (text: string) => void;
};

const EntriesContext = createContext<EntriesContextType | null>(null);

export function EntriesProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<Entry[]>([]);

  const addEntry = (text: string) => {
    setEntries((prev) => [{ id: Date.now().toString(), text }, ...prev]);
  };

  return (
    <EntriesContext.Provider value={{ entries, addEntry }}>
      {children}
    </EntriesContext.Provider>
  );
}

export function useEntries() {
  const ctx = useContext(EntriesContext);
  if (!ctx) throw new Error("useEntries must be used within EntriesProvider");
  return ctx;
}