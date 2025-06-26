import React from "react";
import { Calendar, Bell, Eclipse } from "lucide-react";
import { LinkItem, MainItem } from "./MainItem";
import { Dropdown } from "./MainProfile";
import { useDarkModeContext } from "../../context/DarkModeContext";

const MainS: React.FC = () => {
  const { toggleDarkMode } = useDarkModeContext();

  return (
    <div className="relative">
      <aside className="flex flex-col w-12 items-center h-screen  border-r border-gray-200 bg-backy transition-all duration-300 ease-in-out dark:bg-d dark:border-gray-700">
        <Dropdown></Dropdown>

        <div className="py-7 flex flex-col h-full items-center justify-between">
          <nav className="py-2 space-y-3">
            <LinkItem link={"/allTasks"} title="allTasks">
              <Calendar />
            </LinkItem>
            <MainItem title="Notifactions">
              <Bell />
            </MainItem>
          </nav>
          <nav className="py-2 space-y-3">
            <button onClick={toggleDarkMode}>
              <MainItem title="Theme">
                <Eclipse />
              </MainItem>
            </button>
          </nav>
        </div>
      </aside>
    </div>
  );
};

export default MainS;
