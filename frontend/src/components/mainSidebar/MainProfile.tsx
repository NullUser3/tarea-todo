import { useState, useRef, useEffect } from "react";
import {
  UserCircleIcon,
  BellIcon,
  PaintBrushIcon,
  UsersIcon,
  Cog6ToothIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
  ArrowDownTrayIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

import * as ScrollArea from "@radix-ui/react-scroll-area";
import { apiClient, useAuth } from "../../context/AuthContext";

type UserData = {
  email: string;
  username: string;
};

type ProfileProps = {
  text: string;
  limit: number;
};

type ButtonProps = {
  className?: string;
};

export const TextLimit = ({ text, limit }: ProfileProps) => {
  const displayText =
    text.length <= limit ? text : text.substring(0, limit) + "...";
  return <span>{displayText}</span>;
};

const MenuSeparator = ({ className }: ButtonProps) => {
  return <div className={`h-px w-full ${className}`}></div>;
};

export const Dropdown = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { logout, isAuthenticated, accessToken } = useAuth();
  const [data, setData] = useState<UserData | null>(null);
  const [userLoading, setUserLoading] = useState(false);

  useEffect(() => {
    async function userData() {
      if (isAuthenticated) {
        try {
          setUserLoading(true);
          const response = await apiClient.get("/api/auth-user", {
            headers: {
              Authorization: `Bearer ${accessToken}`, // Explicitly add the token
            },
          });
          setData(response.data);
        } catch (e) {
          console.error("Error fetching authenticated user", e);
        } finally {
          setUserLoading(false);
        }
      }
    }
    userData();
  }, [isAuthenticated, accessToken]);
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
    <div className=" flex items-center">
      <button
        onClick={toggleDropdown}
        ref={buttonRef}
        className={`flex justify-center items-center mt-2 w-12 h-12 dark:text-lighto hover:text-gray-800 dark:hover:text-gray-200 group font-normal hover:bg-main dark:hover:bg-dd ${
          open
            ? "focus:bg-main dark:focus:bg-dd focus:text-gray-800 dark:focus:text-gray-200"
            : "focus:outline-none"
        }`}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="toggle dropdown"
      >
        <div className="relative text-darko w-9 ">
          <div className="w-9 h-9 overflow-hidden border-1 border-gray-400 rounded">
            <img
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80"
              className="object-cover w-full h-full"
              alt="avatar"
            />
          </div>
        </div>
      </button>

      {open && (
        <div
          ref={menuRef}
          className="absolute left-full  ml-2 top-3 w-68 bg-white dark:bg-dd rounded-xl  ring-1 ring-black ring-opacity-20 z-20"
        >
          {/* <ArrowLeft className='absolute  -left-3 top-3 w-4 h-4' /> */}
          <ScrollArea.Root className="h-[calc(100vh-8rem)]">
            <ScrollArea.Viewport className="w-full h-full text-sm text-gray-700 dark:text-texto">
              {/* Account Section */}
              <div className="px-5 py-2 pt-5 text-left font-medium text-gray-700 dark:text-texto">
                Account
              </div>
              <div>
                <button className="group flex w-full text-gray-700 dark:text-texto items-center gap-2 py-1.5 px-3 hover:bg-main dark:hover:bg-ddd">
                  <div className="w-10 h-10 overflow-hidden border-2 border-gray-400 rounded-full">
                    <img
                      src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80"
                      className="object-cover w-full h-full"
                      alt="avatar"
                    />
                  </div>
                  {userLoading ? (
                    <div className="flex flex-col items-start">
                      <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-1"></div>
                    </div>
                  ) : data ? (
                    <div className="flex flex-col items-start">
                      <p className="font-semibold">{data.username}</p>
                      <TextLimit text={data.email} limit={25} />
                    </div>
                  ) : (
                    <div className="flex flex-col items-start">
                      <p className="font-semibold">Guest</p>
                      <span>Not logged in</span>
                    </div>
                  )}
                </button>
              </div>
              <MenuSeparator className="my-1 bg-gray-200 dark:bg-gray-600" />

              {/* User Profile/Account Settings */}
              <div>
                <button className="group flex w-full items-center gap-2 py-2 px-5 hover:bg-main dark:hover:bg-ddd">
                  <UserCircleIcon className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate">Profile Settings</span>
                </button>
              </div>
              {/* Notification Preferences */}
              <div>
                <button className="group flex w-full items-center gap-2 py-2 px-5 hover:bg-main dark:hover:bg-ddd">
                  <BellIcon className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate">Notification Preferences</span>
                </button>
              </div>

              {/* Theme/Display Settings */}
              <div>
                <button className="group flex w-full items-center gap-2 py-2 px-5 hover:bg-main dark:hover:bg-ddd">
                  <PaintBrushIcon className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate">Theme Settings</span>
                </button>
              </div>

              <MenuSeparator className="my-1 bg-gray-200 dark:bg-gray-600" />

              {/* Team Management */}
              <div className="px-5 py-2 pt-2 text-left font-medium text-gray-700 dark:text-texto">
                Collabration
              </div>
              <div>
                <button className="group flex w-full items-center gap-2 py-2 px-5 hover:bg-main dark:hover:bg-ddd">
                  <UsersIcon className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate">Team Management</span>
                </button>
              </div>

              {/* Workspace Settings */}
              <div>
                <button className="group flex w-full items-center gap-2 py-2 px-5 hover:bg-main dark:hover:bg-ddd">
                  <Cog6ToothIcon className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate">Workspace Settings</span>
                </button>
              </div>

              {/* Activity Log/History */}
              <div>
                <button className="group flex w-full items-center gap-2 py-2 px-5 hover:bg-main dark:hover:bg-ddd">
                  <ClockIcon className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate">Activity History</span>
                </button>
              </div>

              <MenuSeparator className="my-1 bg-gray-200 dark:bg-gray-600" />

              {/* Help/Support */}
              <div>
                <button className="group flex w-full items-center gap-2 py-2 px-5 hover:bg-main dark:hover:bg-ddd">
                  <QuestionMarkCircleIcon className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate">Help & Support</span>
                </button>
              </div>

              {/* Offline Mode Toggle */}
              <div>
                <button className="group flex w-full items-center gap-2 py-2 px-5 hover:bg-main dark:hover:bg-ddd">
                  <ArrowDownTrayIcon className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate">Offline Mode</span>
                </button>
              </div>

              <MenuSeparator className="my-1 bg-gray-200 dark:bg-gray-600" />

              {/* Sign Out */}
              <div>
                <button
                  onClick={logout}
                  className="group flex w-full items-center gap-2 rounded-b-xl py-2 pb-4 px-5 hover:bg-main dark:hover:bg-ddd"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate">Logout</span>
                </button>
              </div>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar
              orientation="vertical"
              className="absolute m-0.5 rounded-full top-0 right-0 flex select-none touch-none w-1.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              <ScrollArea.Thumb className="flex-1 bg-gray-400 hover:bg-gray-500 dark:bg-gray-500 dark:hover:bg-gray-400 rounded-full relative" />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
        </div>
      )}
    </div>
  );
};
