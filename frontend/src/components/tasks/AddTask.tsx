import { useEffect, useRef, useState } from "react";
import { CalendarDays } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateTaskSchema,
  CreateTaskType,
} from "../customHooks/usePersonalTask";
import { useForm } from "react-hook-form";
import { usePersonalTaskContext } from "../../context/PersonalTaskContext";
import { useParams } from "react-router-dom";
import { useMenu } from "../sidebar/List/MenuProvider";
import { useTaskForm } from "../../context/TaskFormContext";

export enum Recurrence {
  daily = "DAILY",
  weekly = "WEEKLY",
  monthly = "MONTHLY",
}

export const AddTask = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [openButton, setOpenButton] = useState(false);
  const [optionsSelected, setOptionsSelected] = useState(false);
  const { formDate, recurrence, reminder, taskList, time, date, resetAll } =
    useTaskForm();
  const { value } = usePersonalTaskContext();
  const { createPersonalTaskMutation, createPersonalTaskError } = value;
  const { toggleTaskCreate, openTaskCreate } = useMenu();
  ///////////////////////////////////////////////////

  const { id } = useParams<{ id: string }>();

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  ////////////////// form logic ////////////////////////////

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateTaskType>({
    resolver: zodResolver(CreateTaskSchema),
    defaultValues: { listId: id },
  });

  useEffect(() => {
    if (createPersonalTaskError) {
      console.log(createPersonalTaskError);
    }

    if (errors) {
      console.log(errors);
    }
    if (errors.root?.message) {
      console.log(errors.root?.message);
    }
    if (errors.nextRecurrence) {
      console.log(errors.nextRecurrence.message);
    }
  }, [createPersonalTaskError, errors, errors.root?.message]);

  useEffect(() => {
    if (formDate) setValue("dueDate", formDate);
    if (recurrence) setValue("recurrenceRule", recurrence);
    if (reminder) setValue("reminderAt", reminder);
    if (taskList) setValue("listId", taskList);
  }, [formDate, recurrence, reminder, taskList, setValue]);

  async function onSubmit(data: CreateTaskType) {
    try {
      await createPersonalTaskMutation(data);
      resetAll(); // Reset all context states
      reset({ title: "" });
    } catch (err) {
      console.error("Failed to add list:", err);
    }
  }

  useEffect(() => {
    const checkOptions = () => {
      if (date != null || time != null || recurrence != null) {
        setOptionsSelected(true);
      } else {
        setOptionsSelected(false);
      }
    };
    checkOptions();
  }, [date, time, recurrence]);

  ///////////////////////////////////////////////////
  const dropdownButtonRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleMenuClick = () => {
    setOpenMenu(!openMenu);
  };

  const handleButtonClick = () => {
    setOpenButton(!openButton);
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (buttonRef.current && buttonRef.current.contains(target)) {
        inputRef.current?.focus();
        return;
      }

      // Check if click is inside menuRef before closing
      if (menuRef.current && menuRef.current.contains(target)) {
        // Keep focus on input when clicking inside menu
        inputRef.current?.focus();
        return;
      }

      if (
        menuRef.current &&
        inputRef.current &&
        !menuRef.current.contains(target) &&
        !inputRef.current.contains(target)
      ) {
        setOpenMenu(false);
      }

      if (
        dropdownButtonRef.current &&
        !dropdownButtonRef.current.contains(target)
      ) {
        setOpenButton(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenu, openButton]);

  ////////////////////////////////////////////////////////////////////////////

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="relative flex items-center justify-center pt-5 px-6 w-full h-20 rounded-b-3xl">
        <div
          className="absolute bg-blue-500 w-[90%] rounded-xl z-20"
          ref={dropdownButtonRef}
          onClick={() => {
            setOpenButton(true);
            inputRef.current?.focus(); // Focus input when button is clicked
          }}
        >
          <input
            type="text"
            placeholder="Add new Task"
            className={`${
              openTaskCreate ? "ring-primary" : ""
            } outline-none bg-color-white dark:bg-d ring-[0.5px] ring-gray-400 dark:ring-zinc-700 caret-primary dark:caret-purple-200 focus:ring-1 focus:ring-primary pl-10 w-full h-10 text-gray-700 dark:text-white dark:focus:ring-purple-200 rounded-xl`}
            {...register("title")}
            ref={(el) => {
              register("title").ref(el); // ✅ register's ref
              inputRef.current = el; // ✅ your custom ref
            }}
            onFocus={() => setOpenButton(true)}
          />
          {openButton && (
            <button
              ref={buttonRef}
              className="absolute right-5 top-3 w-4 h-4 z-50"
              onClick={(e) => {
                e.preventDefault(); // ✅ prevent form default
                toggleTaskCreate();
                inputRef.current?.focus();
              }}
              type="button"
            >
              <CalendarDays
                size={18}
                className={`text-gray-500 dark:text-lighto pointer-events-none ${
                  optionsSelected ? " stroke-primary" : ""
                }`}
              />
            </button>
          )}
        </div>
      </div>
    </form>
  );
};
