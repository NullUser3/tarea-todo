import React from "react";
import { NavLink, NavLinkProps } from "react-router-dom";

type SidebarProps = {
  link: string;
  children: React.ReactNode;
  className?: string;
};

export default function SidebarItem({
  link,
  children,
  className,
}: SidebarProps) {
  const Active: NavLinkProps["className"] = ({ isActive }) =>
    `${
      isActive
        ? "bg-main dark:bg-dd text-gray-800 dark:text-gray-200"
        : "text-darko dark:text-lighto hover:text-gray-800 dark:hover:text-gray-200"
    } group flex items-center justify-between text-sm  font-normal px-3 py-2  transition-all duration-75 transform rounded-lg  hover:bg-main dark:hover:bg-dd ${className}`;
  return (
    <NavLink to={link} className={Active}>
      {children}
    </NavLink>
  );
}
