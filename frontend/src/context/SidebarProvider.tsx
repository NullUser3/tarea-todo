import {
  useState,
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useRef,
} from "react";

type SidebarExpandTypes = {
  currExpand: boolean;
  setExpanded: (value: boolean) => void;
  expand: () => void;
};

export const SidebarContext = createContext<SidebarExpandTypes | undefined>(
  undefined
);

export const useSidebarContext = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [currExpand, setExpanded] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleExpand = () => {
      if (window.innerWidth < 1024) {
        setExpanded(false);
      }
    };
    const debounce = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(handleExpand, 200);
    };

    window.addEventListener("resize", debounce);
    return () => {
      window.removeEventListener("resize", debounce);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
  function expand() {
    setExpanded((prev) => !prev);
  }
  return (
    <SidebarContext.Provider value={{ currExpand, expand, setExpanded }}>
      {children}
    </SidebarContext.Provider>
  );
};
