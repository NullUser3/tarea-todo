import { Ellipsis, Plus } from "lucide-react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { Square, Menu } from "lucide-react";
import { Link, NavLinkProps, NavLink, Navigate } from "react-router-dom";
import { TextLimit } from "../../mainSidebar/MainProfile";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { apiClient, useAuth } from "../../../context/AuthContext";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableListItem } from "./SortableListItem";
import { ListDragPreview } from "./SortableListItem";
import { useMenu } from "./MenuProvider";
import { usePersonalListContext } from "../../../context/PersonalListContext";
export const Lists = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {error,items,setItems,handleDelete,loadingLists } = usePersonalListContext();
  
  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const { accessToken } = useAuth();
  const [activeId, setActiveId] = useState<string | null>(null);
  

  
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!active.id || !over?.id || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(items, oldIndex, newIndex);
    setItems(reordered);

    const payload = reordered.map((item, index) => ({
    id: item.id,
    position: index + 1,
  }));

    apiClient
      .put(
        "/api/list/reorderList",payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };


  const previewItem = items.find((i) => i.id === activeId);
  <DragOverlay>
    {previewItem ? <ListDragPreview item={previewItem} /> : null}
  </DragOverlay>;

  //////////////////////// List Form ///////////////////////////////////
  const {toggleAddMenu} = useMenu();
  
////////////////////////////////////////////////////////////////


  return (
    <>
    
      <div className="flex items-center h-6 justify-between px-4 py-4 text-sm font-bold text-darko dark:text-lighto ">
        <h3>Lists</h3>
        <button onClick={toggleAddMenu} className="flex items-center justify-center rounded-lg w-6 h-6 hover:text-gray-800 dark:hover:text-gray-200">
            <Plus className="" size={20} />      
        </button>
      </div>
      <div className="w-full pt-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            id="personal-list-context"
            items={items}
            strategy={verticalListSortingStrategy}
          >
            <ul className="p-0 m-0 space-y-2">
              {items.map((item) => (
                <SortableListItem
                  key={item.id}
                  item={item}
                  loading={loadingLists}
                  onSetDelete={handleDelete}
                />
              ))}
            </ul>
          </SortableContext>

          {/* Optional overlay */}

          <DragOverlay>
            {activeId ? (
              <div className="w-full">
                <ListDragPreview item={items.find((i) => i.id === activeId)!} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </>
  );
};

type ListDropdownProps = {
  share: string;
  edit:string;
  onEdit: (id: string) => void;
  archive: string;
  deletee: string;
  onDelete: (id: string) => void;
};

export const ListDropdown = ({
  share,
  edit,
  onEdit,
  archive,
  deletee,
  onDelete,
}: ListDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
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

    const handleScroll = () => {
      if (open) {
        setOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("scroll", handleScroll, true);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const toggleDropdown = (e: React.MouseEvent) => {
    // Prevent the event from bubbling up and triggering NavLink
    e.preventDefault();
    e.stopPropagation();

    // Capture the click coordinates
    const x = e.clientX;
    const y = e.clientY;

    // Set position for the dropdown
    setPosition({ x, y });
    setOpen(!open);
  };


  return (
    <div className="">
      <div className="hidden group-hover:block">
        <button
          onClick={toggleDropdown}
          ref={buttonRef}
          className={`text-darko dark:text-texto hover:text-primary dark:hover:text-white group flex items-center justify-center font-normal transition-all duration-75 rounded-lg ${
            open && "focus:text-primary dark:focus:text-white"
          }`}
        >
          <Ellipsis className="" size={17} />
        </button>
      </div>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          style={{
            position: "fixed",
            left: `${position.x}px`,
            top: `${position.y}px`,
            // No transform needed as we want the dropdown to appear to the right
          }}
          className=" bg-white p-1 dark:bg-dd rounded-xl ring-1 ring-black ring-opacity-20 z-50"
        >
          <div className="flex flex-col space-y-2 w-32 text-gray-600 dark:text-texto  text-sm">
            <Link
              className="flex h-5 w-full items-center px-3 py-4 hover:text-gray-800 hover:bg-gray-100 dark:hover:bg-ddd dark:hover:text-white rounded-md"
              to={share}
            >
              <div>Share</div>
            </Link>
            <button
              className="flex h-5 w-full items-center px-3 py-4 hover:text-gray-800 hover:bg-gray-100 dark:hover:bg-ddd dark:hover:text-white rounded-md"
              onClick={(e:React.MouseEvent) => {onEdit(edit);setOpen(false); e.preventDefault();
    e.stopPropagation();}}
            >
              <div>Edit</div>
            </button>
            <Link
              className="flex h-5 w-full items-center px-3 py-4 hover:text-gray-800 hover:bg-gray-100 dark:hover:bg-ddd dark:hover:text-white rounded-md"
              to={archive}
            >
              <div>Archive</div>
            </Link>
            <button
              className="flex h-5 w-full items-center px-3 py-4 hover:text-gray-800 hover:bg-red-200  dark:hover:bg-[#ff4444] dark:hover:text-white rounded-md"
              onClick={(e:React.MouseEvent) => {onDelete(deletee);e.preventDefault();
    e.stopPropagation();}}
            >
              <div>Delete</div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
