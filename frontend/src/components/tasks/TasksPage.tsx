import React, {useState } from "react";
import { TitleCard } from "./TitleCard";
import { AddTask } from "./AddTask";
import { TaskDetails } from "./TaskDetails";
import { usePersonalTaskContext } from "../../context/PersonalTaskContext";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { AllTasks } from "./AllTasks";

export const TasksPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { value } = usePersonalTaskContext();
  const { allTasks } = value;

  const allTasksUrl = window.location.pathname;

  const Skeleton = () => (
    <div className="p-6 w-full h-full flex items-center justify-center ">
      <div className="flex w-full flex-col gap-4 ">
        <div className="rounded-xl animate-pulse h-10 w-full bg-main dark:bg-dd"></div>
        <div className="rounded-xl animate-pulse h-10 w-full bg-main dark:bg-dd"></div>
        <div className="rounded-xl animate-pulse h-10 w-full bg-main dark:bg-dd"></div>
        <div className="rounded-xl animate-pulse h-10 w-full bg-main dark:bg-dd"></div>
        <div className="rounded-xl animate-pulse h-10 w-full bg-main dark:bg-dd"></div>
        <div className="rounded-xl animate-pulse h-10 w-40 bg-main dark:bg-dd"></div>
      </div>
    </div>
  );
  return (
    <>
      {
        <div className="flex px-6 flex-col h-full">
          <div className=" flex justify-between space-x-5 items-center h-24 max-h-24 w-full">
            <TitleCard title={allTasksUrl ? "All Tasks" : ""} />
          </div>
          <div className="flex space-x-7 h-full w-full">
            <LeftCard>
              {isLoading ? (
                <Skeleton />
              ) : (
                <div className="p-2 w-full h-full">
                  <AllTasks tasks={allTasks} />
                </div>
              )}
            </LeftCard>
            <RightCard>{isLoading ? <Skeleton /> : <TaskDetails />}</RightCard>
          </div>
        </div>
      }
    </>
  );
};

export const LeftCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-1/2 h-[calc(100vh-8rem)] flex flex-col pt-2 shadow-md bg-white dark:bg-d rounded-3xl ring-1 ring-black ring-opacity-5 overflow-hidden">
      <ScrollArea.Root className="w-full h-[calc(100vh-8rem-6rem)]">
        <ScrollArea.Viewport className="h-full">{children}</ScrollArea.Viewport>

        <ScrollArea.Scrollbar
          orientation="vertical"
          className="absolute top-0 right-0 my-2 mr-2 flex select-none touch-none w-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full"
        >
          <ScrollArea.Thumb className="flex-1  bg-gray-400 hover:bg-gray-500 dark:bg-gray-500 dark:hover:bg-gray-400 rounded-full relative" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
      <div className="">
        <AddTask />
      </div>
    </div>
  );
};

export const RightCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-1/2 h-[calc(100vh-8rem)] flex p-5 shadow-md bg-color-white dark:bg-d rounded-3xl ring-1 ring-black ring-opacity-5">
      {children}
    </div>
  );
};
