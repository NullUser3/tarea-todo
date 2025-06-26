import { useState, useRef, useEffect } from "react";
import { Ellipsis } from "lucide-react";

const SideDropdown = ({ children, tChildren }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside both dropdown and button
      if (
        isOpen &&
        !dropdownRef.current?.contains(event.target) &&
        !buttonRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    // Add event listener when dropdown is open
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]); // Only re-run when isOpen changes
  useEffect(() => {
    if (!isOpen && buttonRef.current === document.activeElement) {
      // Remove focus if dropdown is closed but button still has focus
      buttonRef.current.blur();
    }
  }, [isOpen]);
  return (
    <div className=" flex items-center transition-all duration-300 ease-in-out">
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className="flex items-center focus:rounded-lg focus:outline-none focus:bg-gray-100 dark:focus:bg-dd dark:text-lighto dark:focus:text-gray-200 focus:text-gray-800"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="toggle dropdown"
      >
        <div className="text-sm text-darko w-44 pl-3 pr-2 focus:bg-gray-100 dark:focus:bg-dd dark:text-lighto dark:focus:text-gray-200 focus:text-gray-800 hover:text-gray-800 dark:hover:text-gray-200 group flex items-center justify-between font-normal py-2 transition-all duration-300 ease-in-out transform rounded-lg hover:bg-gray-100 dark:hover:bg-dd">
          {children}
          <Ellipsis
            size={22}
            className="text-darko dark:text-lighto hover:text-gray-800 dark:hover:text-gray-200"
          />
        </div>
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className=" ml-1 mt-5 absolute left-full w-48 bg-white dark:bg-dd rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 z-50"
        >
          <div className="p-4 text-gray-500 dark:text-texto">{tChildren}</div>
        </div>
      )}
    </div>
  );
};

export default SideDropdown;
