import React, { createContext, useContext, useState } from "react";

type MenuContextType = {
  openTaskCreate: boolean;
  toggleTaskCreate: () => void;
  setOpenTaskCreate: (value: boolean) => void;
  openAdd: boolean;
  toggleAddMenu: () => void;
  setOpenAdd: (value: boolean) => void;
  openEdit: boolean;
  toggleEditMenu: () => void;
  setOpenEdit: (value: boolean) => void;
  id: string;
  setId: (valie: string) => void;
};

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openTaskCreate, setOpenTaskCreate] = useState(false);
  const [id, setId] = useState("");

  const toggleTaskCreate = () => setOpenTaskCreate((prev) => !prev);
  const toggleAddMenu = () => setOpenAdd((prev) => !prev);
  const toggleEditMenu = () => setOpenEdit((prev) => !prev);

  return (
    <MenuContext.Provider
      value={{
        openTaskCreate,
        toggleTaskCreate,
        setOpenTaskCreate,
        openAdd,
        openEdit,
        toggleAddMenu,
        toggleEditMenu,
        setOpenAdd,
        setOpenEdit,
        id,
        setId,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) throw new Error("useMenu must be used within a MenuProvider");
  return context;
};
