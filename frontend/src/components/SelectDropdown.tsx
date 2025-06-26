import React, { useEffect, useRef, useState } from "react";
import { LightTooltip } from "./mainSidebar/ToolTipLabel";

type SelectProps = {
  icon: React.ReactNode;
  label: string;
  children:
    | React.ReactNode
    | ((props: {
        setOpen: React.Dispatch<React.SetStateAction<boolean>>;
      }) => React.ReactNode);
  info: string;
  dropdownClass?: string;
  LabelClass?: string;
  height?: string;
  color?: string;
};
export const SelectDropdown = ({
  icon,
  height = "h-56",
  label,
  color,
  children,
  info,
  dropdownClass = "  bottom-full mb-2 w-44 ",
  LabelClass = "justify-center gap-1",
}: SelectProps) => {
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
      <LightTooltip arrow title={info}>
        <button
          type="button"
          onClick={toggleDropdown}
          ref={buttonRef}
          className={`p-1 text-darko  dark:text-texto group flex items-center justify-center font-normal transition-all duration-75 rounded-lg  bg-main dark:bg-dd ${
            open &&
            "focus:bg-main dark:focus:bg-dd focus:text-gray-700 dark:focus:text-gray-200"
          }`}
        >
          <div
            className={`flex items-center group-hover:opacity-70 ${LabelClass} `}
          >
            {icon}
            <div className="px-1">{label}</div>
          </div>
        </button>
      </LightTooltip>

      {open && (
        <div
          ref={menuRef}
          className={`${dropdownClass} absolute bg-white dark:bg-dd rounded-xl ring-1 ring-black ring-opacity-20 z-50`}
        >
          <div
            className={`flex flex-col gap-2 ${height} p-2 text-gray-500 dark:text-texto overflow-x-auto`}
          >
            {typeof children === "function" ? children({ setOpen }) : children}
          </div>
        </div>
      )}
    </div>
  );
};
