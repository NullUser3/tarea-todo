import { LucidePanelRightClose, LucidePanelRightOpen } from "lucide-react";
import { useSidebarContext } from "../../context/SidebarProvider";
import { LightTooltip } from "../mainSidebar/ToolTipLabel";

export const ToggleSidebar = () => {
  const { expand, currExpand } = useSidebarContext();

  return (
    <>
      <LightTooltip arrow title="Toggle Dropdown">
        <button
          onClick={expand}
          className="p-1 rounded-lg transition-all duration-75 transform text-darko hover:bg-main hover:dark:bg-dd dark:text-texto hover:text-gray-800 dark:hover:text-texto"
        >
          {currExpand ? (
            <LucidePanelRightOpen size={25} />
          ) : (
            <LucidePanelRightClose size={25} />
          )}
        </button>
      </LightTooltip>
    </>
  );
};
