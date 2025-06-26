import { Link } from "react-router-dom";
import SideI from "./SidebarItem";
import SideDropdown from "./SideDropdown";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useSidebarContext } from "../../context/SidebarProvider";
import {
  Ellipsis,
  CalendarCheck,
  CheckSquare,
  CalendarDays,
  Plus,
} from "lucide-react";
import { Lists } from "./List/Lists";
import Divider from "@mui/material/Divider";

export default function Main_sidebar() {
  const { currExpand } = useSidebarContext();
  const ICON_SIZE = 20;
  return (
    <div className={`pr-1`}>
      <aside
        className={`flex flex-col ${
          currExpand ? "w-52" : "w-0"
        } min-h-screen py-6 rounded-r-lg  bg-backy transition-all duration-300 ease-in-out  dark:bg-d `}
      >
        <ScrollArea.Root className="w-full h-[calc(100vh-60px)]">
          <ScrollArea.Viewport className=" w-full h-full">
            <nav
              className={`w-full px-3 space-y-3 ${
                currExpand ? "mb-8" : "mb-3"
              }`}
            >
              {/* Main Navigation */}
              <SideI link={"/today"}>
                <>
                  <div className="flex align-center justify-center">
                    <CalendarCheck size={ICON_SIZE} />
                    <span className="mx-3">Today</span>
                  </div>{" "}
                  <Ellipsis
                    size={ICON_SIZE}
                    className="opacity-0 group-hover:opacity-100 text-darko dark:text-lighto hover:text-gray-800 dark:hover:text-gray-200"
                  />
                </>
              </SideI>

              <SideI link={"/calendar"}>
                <>
                  <div className="flex items-center">
                    <CalendarDays size={ICON_SIZE} />
                    <span className="mx-3">Next 7 days</span>
                  </div>
                  <Ellipsis
                    size={ICON_SIZE}
                    className="opacity-0 group-hover:opacity-100 text-darko dark:text-lighto hover:text-gray-800 dark:hover:text-gray-200"
                  />
                </>
              </SideI>

              <SideDropdown
                tChildren={
                  <Link
                    className="text-darko dark:text-lighto hover:text-gray-800 dark:hover:text-gray-200 group flex items-center justify-between font-normal px-3 py-2 transition-all duration-300 transform rounded-lg hover:bg-gray-100 dark:hover:bg-dd"
                    to={""}
                  >
                    <span className="mx-3">new Task</span>
                    <Plus size={ICON_SIZE} />
                  </Link>
                }
              >
                <div className="flex align-center justify-center">
                  <CheckSquare size={ICON_SIZE} />
                  <span className="mx-3">Tasks</span>
                </div>
              </SideDropdown>
              <div className="flex  items-center justify-center">
                <Divider className="bg-main dark:bg-ddd w-full" />
              </div>
            </nav>

            {/* List*/}
            <Lists />
          </ScrollArea.Viewport>

          <ScrollArea.Scrollbar
            orientation="vertical"
            className="absolute top-0 right-0 flex select-none touch-none w-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            <ScrollArea.Thumb className="flex-1 bg-gray-400 hover:bg-gray-500 dark:bg-gray-500 dark:hover:bg-gray-400 rounded-full relative" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </aside>
    </div>
  );
}
