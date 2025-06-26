import React, { useEffect, useState } from "react";
import {
  Archive,
  CalendarDays,
  List,
  Bell,
  Square,
  TimerReset,
} from "lucide-react";
import { Checkbox } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/16/solid";
import Divider from "@mui/material/Divider";
import { SelectDropdown } from "../SelectDropdown";
import { TextLimit } from "../mainSidebar/MainProfile";
import { usePersonalTaskContext } from "../../context/PersonalTaskContext";
import { usePersonalListContext } from "../../context/PersonalListContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditTaskSchema, EditTaskType } from "../customHooks/usePersonalTask";
import { useDebouncedCallback } from "use-debounce";

export const TaskDetails = () => {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const { currentTask } = usePersonalTaskContext();
  const { items } = usePersonalListContext();
  const { value } = usePersonalTaskContext();
  const { editTask, editTaskError } = value;

  const [localCurrentTask, setLocalCurrentTask] = useState(currentTask);

  useEffect(() => {
    setLocalCurrentTask(currentTask);
  }, [currentTask]);

  const { register, handleSubmit, reset } = useForm<EditTaskType>({
    resolver: zodResolver(EditTaskSchema),
  });

  if (editTaskError) {
    console.log(editTaskError);
  }

  async function onSubmit(data: EditTaskType) {
    if (!localCurrentTask?.id) {
      return;
    }
    try {
      await editTask({ id: localCurrentTask.id, data });
    } catch (err) {
      console.error("Failed to add list:", err);
    }
  }

  useEffect(() => {
    if (currentTask) {
      reset({
        title: currentTask.title,
        description: currentTask.description ?? undefined,
        listId: currentTask.listId ?? undefined,
        recurrenceRule: currentTask.recurrenceRule ?? undefined,
        isCompleted: currentTask.isCompleted,
      });
    }
  }, [currentTask, reset]);

  const debouncedSubmit = useDebouncedCallback(
    () => handleSubmit(onSubmit)(),
    500 // 500ms delay after typing
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    debouncedSubmit();
  };

  const debouncedInputSubmit = useDebouncedCallback(
    () => handleSubmit(onSubmit)(),
    500 // 500ms delay after typing
  );

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    debouncedInputSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="text-darko relative dark:text-texto flex flex-col gap-7 p-2 w-full max-h-full overflow-x-auto"
    >
      <div className="flex relative items-center justify-between w-full h-10 ">
        <div className="flex h-full items-center gap-4 justify-center">
          <Checkbox
            className="mr-2 group size-[18px] hover:cursor-pointer rounded-sm bg-gray/10 ring-1 ring-darko dark:ring-gray-200 ring-inset data-[checked]:ring-transparent"
            checked={isChecked}
            onChange={(checked) => setIsChecked(checked)}
          >
            <CheckIcon className="opacity-0 rounded-sm size-[18px] fill-main dark:fill-gray-700 bg-primary dark:bg-gray-200 group-data-[checked]:opacity-100" />
          </Checkbox>
          <div className="py-2 flex items-center h-full">
            <Divider orientation="vertical" className="bg-main dark:bg-ddd " />
          </div>
          {/* due time */}
          {localCurrentTask?.dueDate && (
            <button className="flex items-center justify-center gap-3 text-color-primary dark:text-yellow-500 hover:text-primary dark:hover:text-yellow-400">
              {" "}
              <CalendarDays size={22} />
              <span>
                {new Date(localCurrentTask.dueDate).toLocaleTimeString(
                  "en-US",
                  {
                    weekday: "long",
                    month: "short",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  }
                )}
              </span>
            </button>
          )}
          {/*  */}
        </div>
        <button>
          <Archive />
        </button>
      </div>
      <div className="w-full flex flex-col">
        <input
          {...register("title")}
          onKeyDown={handleInputKeyDown}
          className="w-full text-2xl px-5 outline-none bg-color-white dark:bg-d   caret-primary dark:caret-purple-200   text-gray-700 dark:text-white  rounded-xl"
          type="text"
        />
      </div>
      <div className="w-full  relative">
        <textarea
          placeholder="Description"
          rows={4}
          {...register("description")}
          onKeyDown={handleKeyDown}
          className="w-full max-h-[30vh] text-lg px-5 outline-none bg-color-white dark:bg-d   caret-primary dark:caret-purple-200   text-gray-600 dark:text-texto  rounded-xl"
        />
      </div>
      <div className="w-full px-3 flex-1  flex items-end justify-between ">
        {/* list */}
        <div className="flex items-center justify-center w-1/3">
          <SelectDropdown
            label={localCurrentTask?.listName ?? "List"}
            info="List"
            icon={<List size={18}></List>}
          >
            {items.map((list, index) => (
              <button
                key={index}
                type="button"
                className="flex items-center justify-between py-2 px-6 rounded-md hover:bg-main dark:hover:bg-ddd text-darko dark:text-texto hover:text-gray-700 dark:hover:text-gray-200"
              >
                <TextLimit text={list.name} limit={16} />
                <Square
                  fill={list.color}
                  stroke={list.color}
                  className="w-5 h-5"
                />
              </button>
            ))}
          </SelectDropdown>
        </div>

        {/* recurrence */}

        <div className="flex items-center justify-center w-1/3">
          <SelectDropdown
            label={localCurrentTask?.recurrenceRule ?? "Recurrence"}
            info="Recurrence"
            icon={<TimerReset size={18}></TimerReset>}
          >
            <button
              type="button"
              className="flex items-center  justify-center py-2 px-6 rounded-md hover:bg-main dark:hover:bg-ddd text-darko dark:text-texto hover:text-gray-700 dark:hover:text-gray-200"
            >
              <span>Daily</span>
            </button>
            <button
              type="button"
              className="flex items-center  justify-center py-2 px-6 rounded-md hover:bg-main dark:hover:bg-ddd text-darko dark:text-texto hover:text-gray-700 dark:hover:text-gray-200"
            >
              <span>Weekly</span>
            </button>
            <button
              type="button"
              className="flex items-center  justify-center py-2 px-6 rounded-md hover:bg-main dark:hover:bg-ddd text-darko dark:text-texto hover:text-gray-700 dark:hover:text-gray-200"
            >
              <span>Monthly</span>
            </button>
          </SelectDropdown>
        </div>

        {/* reminder at */}
        <div className="flex items-center justify-center w-1/3">
          <SelectDropdown
            dropdownClass=" w-40 bottom-full right-0 mb-2 max-w-44"
            label={
              localCurrentTask?.reminderAt
                ? new Date(localCurrentTask?.reminderAt).toLocaleDateString()
                : "Reminder"
            }
            info="Reminder Date"
            icon={<Bell size={18}></Bell>}
          >
            <button
              type="button"
              className="flex items-center  justify-center py-2 px-6 rounded-md hover:bg-main dark:hover:bg-ddd text-darko dark:text-texto hover:text-gray-700 dark:hover:text-gray-200"
            >
              <span>1 Day Before</span>
            </button>
            <button
              type="button"
              className="flex items-center  justify-center py-2 px-6 rounded-md hover:bg-main dark:hover:bg-ddd text-darko dark:text-texto hover:text-gray-700 dark:hover:text-gray-200"
            >
              <span>2 Day Before</span>
            </button>
            <button
              type="button"
              className="flex items-center  justify-center py-2 px-6 rounded-md hover:bg-main dark:hover:bg-ddd text-darko dark:text-texto hover:text-gray-700 dark:hover:text-gray-200"
            >
              <span>3 Day Before</span>
            </button>
            <button
              type="button"
              className="flex items-center  justify-center py-2 px-6 rounded-md hover:bg-main dark:hover:bg-ddd text-darko dark:text-texto hover:text-gray-700 dark:hover:text-gray-200"
            >
              <span>4 Day Before</span>
            </button>
          </SelectDropdown>
        </div>
      </div>
      <button type="submit" className="hidden" />
    </form>
  );
};
