import React from "react";
import { NavLink, NavLinkProps } from "react-router-dom";
import { LightTooltip } from "./ToolTipLabel";

type LinkItemProps = {
  link: string;
  children: React.ReactNode;
  className?: string;
  title: string;
};

type MainItemProps = {
  children: React.ReactNode;
  className?: string;
  title: string;
};

export const LinkItem = ({
  link,
  children,
  className = "",
  title,
}: LinkItemProps) => {
  const active: NavLinkProps["className"] = ({ isActive }) =>
    `${
      isActive
        ? "bg-main dark:bg-dd text-gray-800 dark:text-gray-200 pointer-events-none"
        : "text-darko dark:text-lighto hover:text-gray-800 dark:hover:text-gray-200 "
    } group p-2 flex items-center justify-center  font-normal  transition-all duration-75 rounded-lg transform  hover:bg-main dark:hover:bg-dd ${className}`;
  return (
    <>
      <LightTooltip title={title} placement="right">
        <span className="inline-flex">
          <NavLink to={link} className={active}>
            {children}
          </NavLink>
        </span>
      </LightTooltip>
    </>
  );
};

export const MainItem = ({
  children,
  className = "",
  title,
}: MainItemProps) => {
  return (
    <>
      <LightTooltip title={title} placement="right">
        <div
          className={`text-darko dark:text-lighto hover:text-gray-800 dark:hover:text-gray-200 group p-2 flex items-center justify-center font-normal transition-all duration-75 rounded-lg transform hover:bg-main dark:hover:bg-dd ${className}`}
        >
          {children}
        </div>
      </LightTooltip>
    </>
  );
};
