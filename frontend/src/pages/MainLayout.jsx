import MainSidebar from "../components/mainSidebar/MainS";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "../context/SidebarProvider";
import { MenuProvider } from "../components/sidebar/List/MenuProvider";
import { PersonalListProvider } from "../context/PersonalListContext";
import { PersonalTaskProvider } from "../context/PersonalTaskContext";
import { TaskFormProvider } from "../context/TaskFormContext";
const MainLayout = () => {
  return (
    <MenuProvider>
      <PersonalListProvider>
        <PersonalTaskProvider>
          <SidebarProvider>
            <TaskFormProvider>
              <div className="flex flex-col h-screen bg-main dark:bg-dd">
                {/* main container */}
                <div className="flex flex-1">
                  <div className="flex">
                    <MainSidebar />
                  </div>
                  <Outlet />
                </div>
              </div>
            </TaskFormProvider>
          </SidebarProvider>
        </PersonalTaskProvider>
      </PersonalListProvider>
    </MenuProvider>
  );
};

export default MainLayout;
