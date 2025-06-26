import Sidebar from "../sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import AddList from "../sidebar/List/AddList";
import { useMenu } from "../sidebar/List/MenuProvider";
import { AnimatePresence, motion } from "framer-motion";
import EditList from "../sidebar/List/EditList";
import { AddTaskDropdown } from "./AddTaskDropdown";
export const Index = () => {
  const { openAdd, openEdit, openTaskCreate } = useMenu();
  return (
    <>
      <AnimatePresence>
        {openAdd && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 overflow-hidden z-50 flex items-center justify-center"
          >
            <AddList />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {openEdit && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 overflow-hidden z-50 flex items-center justify-center"
          >
            <EditList />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {openTaskCreate && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 overflow-hidden z-50 flex items-center justify-center"
          >
            <AddTaskDropdown />
          </motion.div>
        )}
      </AnimatePresence>
      <Sidebar />

      {/* main content area */}
      <main className="p-2 flex-1 transition-margin duration-300 ">
        <Outlet />
      </main>
    </>
  );
};
