import { useState, useEffect, useRef } from "react";
import { ToggleSidebar } from "../sidebar/ToggleSidebar";
import { ListFilter } from "lucide-react";
import { LightTooltip } from "../mainSidebar/ToolTipLabel";
export const Divider = () => {
  return <div className="h-6 border-l border-darko dark:border-gray-300"></div>;
};

type filterProps = {
  title: string;
};

export const TitleCard = ({ title }: filterProps) => {
  return (
    <div className="flex shadow-md bg-color-white dark:bg-d rounded-full h-10 max-w-1/2 ring-1 ring-black ring-opacity-5">
      <div className="flex justify-center px-3 h-full space-x-3 items-center w-full">
        <ToggleSidebar />
        <Divider />
        <h1 className="text-darko dark:text-texto text-xl px-1 font-semibold">
          {title}
        </h1>
        <Divider />
        <Filter />
      </div>
    </div>
  );
};
export const Filter = () => {
  const [open, setOpen] = useState(false);
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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setOpen(!open);
  return (
    <div className="relative">
      <LightTooltip arrow title="Filter Tasks">
        <button
          onClick={toggleDropdown}
          ref={buttonRef}
          className={`p-1 text-darko dark:text-texto hover:text-gray-700 dark:hover:text-gray-200 group flex items-center justify-center font-normal transition-all duration-75 rounded-lg transform hover:bg-main dark:hover:bg-dd ${
            open &&
            "focus:bg-main dark:focus:bg-dd focus:text-gray-700 dark:focus:text-gray-200"
          }`}
        >
          <ListFilter className="w-6 h-6" /> <div className="px-1">Filter</div>
        </button>
      </LightTooltip>

      {open && (
        <div
          ref={menuRef}
          className="absolute left-0 top-full mt-2 w-68 bg-white dark:bg-dd rounded-xl ring-1 ring-black ring-opacity-20 z-20"
        >
          <div className="p-4 text-gray-500 dark:text-texto">
            Dropdown content here
          </div>
        </div>
      )}
    </div>
  );
};
