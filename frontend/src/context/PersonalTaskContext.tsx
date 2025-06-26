import React, { createContext, useContext, useState } from "react";
import {
  TaskResponseType,
  usePersonalTask,
} from "../components/customHooks/usePersonalTask";

// 1. Define the parts of the context manually

type UsePersonalTaskReturn = ReturnType<typeof usePersonalTask>;

type PersonalTaskContextType = {
  value: UsePersonalTaskReturn;
  currentTask: TaskResponseType | null;
  setCurrentTask: React.Dispatch<React.SetStateAction<TaskResponseType | null>>;
};

// 2. Create the context
const PersonalTaskContext = createContext<PersonalTaskContextType | null>(null);

// 3. Provider
export function PersonalTaskProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const value = usePersonalTask();
  const [currentTask, setCurrentTask] = useState<TaskResponseType | null>(null);

  return (
    <PersonalTaskContext.Provider
      value={{ value, currentTask, setCurrentTask }}
    >
      {children}
    </PersonalTaskContext.Provider>
  );
}

// 4. Custom hook to access context
export function usePersonalTaskContext() {
  const context = useContext(PersonalTaskContext);
  if (!context)
    throw new Error(
      "usePersonalTaskContext must be used within a PersonalTaskProvider"
    );
  return context;
}
