import React, { useEffect, useRef, useState } from "react";
import { TitleCard } from "../../tasks/TitleCard";
import { AddTask } from "../../tasks/AddTask";
import { Task } from "../../tasks/Task";
import { usePersonalListContext } from "../../../context/PersonalListContext";
import { useNavigate, useParams } from "react-router-dom";
import { useGetPersonalList } from "../../customHooks/useGetPersonalList";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { ListTypes } from "../../customHooks/usePersonalList";
import { TaskDetails } from "../../tasks/TaskDetails";
import { usePersonalTaskContext } from "../../../context/PersonalTaskContext";
export const ListTasks = () => {
  const { items } = usePersonalListContext();
  const [listItems, setListItems] = useState<ListTypes>();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { value ,setCurrentTask} =
    usePersonalTaskContext();
const {PersonalTasksMutate,tasks} = value;
  const initialLoadComplete = useRef(false);

  useEffect(() => {
    setIsLoading(true);
    if (items) {
      const foundItem = items.find((item) => item.id === id);
      setListItems(foundItem || undefined);

      if (initialLoadComplete.current && !foundItem) {
        navigate("/allTasks");
      }

      initialLoadComplete.current = true;
      setIsLoading(false);
      if (foundItem && initialLoadComplete.current) {
        PersonalTasksMutate({ listId: foundItem?.id });
        setCurrentTask(null);
      }
    }
  }, [id, items, navigate]);

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
            <TitleCard title={listItems?.name ?? ""} />
          </div>
          <div className="flex space-x-7 h-full w-full">
            <LeftCard>
              {isLoading || !listItems ? (
                <Skeleton />
              ) : (
                <div className="p-2 w-full h-full">
                  <Task listId={listItems.id}/>
                </div>
              )}
            </LeftCard>
            <RightCard>
              {isLoading || !listItems ? <Skeleton /> : <TaskDetails />}
            </RightCard>
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
