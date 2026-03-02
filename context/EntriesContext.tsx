import { createContext, useContext, useState, ReactNode } from "react";

export type Entry = {
  id: string;
  text: string;
  title: string;
};

type EntriesContextType = {
  entries: Entry[];
  addEntry: (text: string) => void;
  updateEntry: (id: string, text: string) => void;
  updateTitle: (id: string, title: string) => void;
  deleteEntry: (id: string) => void;
};

const EntriesContext = createContext<EntriesContextType | null>(null);

export function EntriesProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<Entry[]>([]);

  const addEntry = (text: string) => {
    const now = new Date();
    const title = now.toLocaleDateString("en-US", { day: "numeric", month: "long" });
    setEntries((prev) => [{ id: Date.now().toString(), text, title }, ...prev]);
  };

  const updateEntry = (id: string, text: string) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, text } : e)));
  };

  const updateTitle = (id: string, title: string) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, title } : e)));
  };

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <EntriesContext.Provider value={{ entries, addEntry, updateEntry, updateTitle, deleteEntry }}>
      {children}
    </EntriesContext.Provider>
  );
}

export function useEntries() {
  const ctx = useContext(EntriesContext);
  if (!ctx) throw new Error("useEntries must be used within EntriesProvider");
  return ctx;
}