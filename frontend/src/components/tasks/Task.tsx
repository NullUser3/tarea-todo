import React, { useEffect, useMemo, useRef, useState } from "react";
import { Menu, Ellipsis, RefreshCcw } from "lucide-react";
import { Checkbox } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/16/solid";
import { Link } from "react-router-dom";
import Divider from "@mui/material/Divider";
import { usePersonalTaskContext } from "../../context/PersonalTaskContext";
import { LightTooltip } from "../mainSidebar/ToolTipLabel";

export const Task = ({listId}:{listId:string}) => {
  const { value, setCurrentTask, currentTask } = usePersonalTaskContext();
  const { tasks, handleTaskDelete, editTask } = value;

  useEffect(() => {
    if (tasks && tasks.length > 0 && currentTask === null) {
      setCurrentTask(tasks[0]); // Automatically select the first task
    }
  }, [tasks]); // Run only when tasks are loaded or change

  const handleCheckboxChange = async (
    taskId: string,
    currentStatus: boolean
  ) => {
    try {
      await editTask({
        id: taskId,
        data: { isCompleted: !currentStatus },
      });

      if (currentTask && currentTask.id === taskId) {
        setCurrentTask({ ...currentTask, isCompleted: !currentStatus });
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const sortedTasks = useMemo(() => {
    return tasks
      ?.slice()
      .sort((a, b) => Number(a.isCompleted) - Number(b.isCompleted));
  }, [tasks]);

  return (
    <div className="flex flex-col py-3 space-y-3 transition-all ease-in-out duration-200">
      {sortedTasks?.map((task, index) => (
        <button
          onClick={(e) => {
            setCurrentTask(task);
            e.preventDefault();
            e.stopPropagation();
          }}
          key={index}
        >
          <div className="flex px-2 group space-x-2 items-center w-full h-10">
            <div className="flex items-center w-5 h-10 ">
              <button>
                <Menu
                  size={17}
                  className="text-darko hidden group-hover:block dark:text-white"
                />
              </button>
            </div>

            <div
              className={`${
                task.id === currentTask?.id ? "bg-main dark:bg-dd" : ""
              } group-hover:bg-main dark:group-hover:bg-dd text-darko dark:text-texto group-hover:text-gray-800 dark:group-hover:text-texto px-3 flex items-center justify-between text-sm flex-auto rounded-lg h-full`}
            >
              <div className="flex items-center" style={{ userSelect: "none" }}>
                <Checkbox
                  className="mr-2 group size-[18px] hover:cursor-pointer rounded-sm bg-gray/10 ring-1 ring-darko dark:ring-gray-200 ring-inset data-[checked]:ring-transparent"
                  checked={task.isCompleted}
                  onChange={(checked) => {
                    // Prevent the parent onClick from firing
                    handleCheckboxChange(task.id, task.isCompleted);
                  }}
                >
                  <CheckIcon className="opacity-0 rounded-sm size-[18px] fill-main dark:fill-gray-700 bg-primary dark:bg-gray-200 group-data-[checked]:opacity-100" />
                </Checkbox>
                <div className="font-semibold">{task.title}</div>
              </div>
              <div className="flex items-center justify-center gap-3 text-blue-600">
                {task.dueDate && (
                  <span>
                    {new Date(task.dueDate).toLocaleDateString("en-US", {
                      weekday: "long",
                    })}
                  </span>
                )}
                {task.recurrenceRule && (
                  <LightTooltip title={task.recurrenceRule}>
                    <span>
                      <RefreshCcw size={15} />
                    </span>
                  </LightTooltip>
                )}
              </div>
            </div>
            <div className="flex items-center w-5 h-10 ">
              <TaskDropdown
                archive=""
                deletee=""
                edit=""
                onDelete={() => {
                  handleTaskDelete(task.id);
                }}
                onEdit={() => {}}
                share=""
              ></TaskDropdown>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Divider className="bg-main dark:bg-ddd w-96" />
          </div>
        </button>
      ))}

      {/*  */}
    </div>
  );
};

type ListDropdownProps = {
  share: string;
  edit: string;
  onEdit: (id: string) => void;
  archive: string;
  deletee: string;
  onDelete: (id: string) => void;
};

export const TaskDropdown = ({
  share,
  edit,
  onEdit,
  archive,
  deletee,
  onDelete,
}: ListDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (buttonRef.current && buttonRef.current.contains(target)) {
        return;
      }

      if (menuRef.current && !menuRef.current.contains(target)) {
        setOpen(false);
      }
    };

    const handleScroll = () => {
      if (open) {
        setOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("scroll", handleScroll, true);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const toggleDropdown = (e: React.MouseEvent) => {
    // Prevent the event from bubbling up and triggering NavLink
    e.preventDefault();
    e.stopPropagation();

    // Capture the click coordinates
    const x = e.clientX;
    const y = e.clientY;

    // Set position for the dropdown
    setPosition({ x, y });
    setOpen(!open);
  };

  return (
    <div className="">
      <div className="hidden group-hover:block">
        <button
          onClick={toggleDropdown}
          ref={buttonRef}
          className={`text-darko dark:text-texto hover:text-primary dark:hover:text-white group flex items-center justify-center font-normal transition-all duration-75 rounded-lg ${
            open && "focus:text-primary dark:focus:text-white"
          }`}
        >
          <Ellipsis className="" size={17} />
        </button>
      </div>

      {open && (
        <div
          ref={menuRef}
          style={{
            position: "fixed",
            left: `${position.x}px`,
            top: `${position.y}px`,
            // No transform needed as we want the dropdown to appear to the right
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className=" bg-white p-1 dark:bg-dd rounded-xl ring-1 ring-black ring-opacity-20 z-50"
        >
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="flex flex-col space-y-2 w-32 text-gray-600 dark:text-texto  text-sm"
          >
            <Link
              className="flex h-5 w-full items-center px-3 py-4 hover:bg-gray-100 dark:hover:bg-ddd rounded-lg"
              to={share}
            >
              <div>Share</div>
            </Link>
            <button
              className="flex h-5 w-full items-center px-3 py-4 hover:bg-gray-100 dark:hover:bg-ddd rounded-lg"
              onClick={(e) => {
                onEdit(edit);
                e.preventDefault();
              }}
            >
              <div>Edit</div>
            </button>
            <Link
              className="flex h-5 w-full items-center px-3 py-4 hover:bg-gray-100 dark:hover:bg-ddd rounded-lg"
              to={archive}
            >
              <div>Archive</div>
            </Link>
            <button
              className="flex h-5 w-full items-center px-3 py-4 hover:bg-gray-100 dark:hover:bg-ddd rounded-lg"
              onClick={(e) => {
                onDelete(deletee);
                e.preventDefault();
                setOpen(false);
              }}
            >
              <div>Delete</div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
