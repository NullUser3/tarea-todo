// PersonalListContext.tsx
import { createContext, useContext } from "react";
import { usePersonalList } from "../components/customHooks/usePersonalList";

const PersonalListContext = createContext<ReturnType<
  typeof usePersonalList
> | null>(null);

export function PersonalListProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const value = usePersonalList();
  return (
    <PersonalListContext.Provider value={value}>
      {children}
    </PersonalListContext.Provider>
  );
}

export function usePersonalListContext() {
  const context = useContext(PersonalListContext);
  if (!context) throw new Error("Must be used within provider");
  return context;
}
