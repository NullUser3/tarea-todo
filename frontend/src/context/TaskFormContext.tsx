import React, {
  createContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { Recurrence } from "../components/tasks/AddTask";
import { CalendarDateTime, Time } from "@internationalized/date";
import { useLocation } from "react-router-dom";

type TaskFormTypes = {
  // Original form state
  formDate: string | null;
  recurrence: Recurrence | null;
  reminder: string | null;
  taskList: string | null;
  time: Time | null; // Added time state
  date: CalendarDateTime | null;
  // Client-specific state
  clientReminder: string | null;
  clientTaskList: string | null;
  clientRecurrence: string | null;
  clientTime: string | null; // Added client-friendly time representation

  // Original setters
  setFormDate: (date: string | null) => void;
  setRecurrence: (recurrence: Recurrence | null) => void;
  setTaskList: (taskList: string | null) => void;
  setReminder: (reminder: string | null) => void;
  setTime: (time: Time | null) => void; // Added time setter
  setDate: (date: CalendarDateTime | null) => void;
  // Client-specific setters
  setClientReminder: (reminder: string | null) => void;
  setClientTaskList: (taskList: string | null) => void;
  setClientRecurrence: (recurrence: string | null) => void;
  setClientTime: (time: string | null) => void; // Added client time setter

  resetAll: () => void;
  DailyRecurrenceToggle: (type: Recurrence) => void;
};

const TaskFormContext = createContext<TaskFormTypes | undefined>(undefined);

type TaskFormProviderProps = {
  children: ReactNode;
};

export const TaskFormProvider = ({ children }: TaskFormProviderProps) => {
  const location = useLocation();
  // Original state
  const [formDate, setFormDate] = useState<string | null>(null);
  const [recurrence, setRecurrence] = useState<Recurrence | null>(null);
  const [taskList, setTaskList] = useState<string | null>(null);
  const [reminder, setReminder] = useState<string | null>(null);
  const [time, setTime] = useState<Time | null>(null); // Added time state
  const [date, setDate] = useState<CalendarDateTime | null>(null);

  // Client-specific state
  const [clientReminder, setClientReminder] = useState<string | null>(null);
  const [clientTaskList, setClientTaskList] = useState<string | null>(null);
  const [clientRecurrence, setClientRecurrence] = useState<string | null>(null);
  const [clientTime, setClientTime] = useState<string | null>(null); // Added client time state

  const DailyRecurrenceToggle = (type: Recurrence) => {
    setRecurrence((prev) => (prev === type ? null : type));
  };

  const resetAll = useCallback(() => {
    setFormDate(null);
    setRecurrence(null);
    setTaskList(null);
    setReminder(null);
    setTime(null); // Reset time
    setClientReminder(null);
    setClientTaskList(null);
    setClientRecurrence(null);
    setClientTime(null); // Reset client time
    setDate(null);
  }, []);

  useEffect(() => {
    resetAll();
  }, [location.pathname, resetAll]);

  const value = {
    // Original state values
    formDate,
    recurrence,
    reminder,
    taskList,
    time, // Added time
    date,

    // Client-specific values
    clientReminder,
    clientTaskList,
    clientRecurrence,
    clientTime, // Added client time

    // Original setters
    setFormDate,
    setRecurrence,
    setTaskList,
    setReminder,
    setTime, // Added time setter
    setDate,

    // Client-specific setters
    setClientReminder,
    setClientTaskList,
    setClientRecurrence,
    setClientTime, // Added client time setter

    DailyRecurrenceToggle,
    resetAll,
  };

  return (
    <TaskFormContext.Provider value={value}>
      {children}
    </TaskFormContext.Provider>
  );
};

export const useTaskForm = () => {
  const context = React.useContext(TaskFormContext);
  if (context === undefined) {
    throw new Error("useTaskForm must be used within a TaskFormProvider");
  }
  return context;
};
