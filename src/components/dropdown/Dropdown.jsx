import useAnimations from "@/contexts/AnimationContext";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Loader2, Search, X } from "lucide-react";
import { createContext, useContext, useEffect, useRef, useState } from "react";

/*=======================================
    Context
========================================= */

const DropdownContext = createContext();

function useDropdownContext() {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error("Dropdown sub-components must be used within <Dropdown>");
  }
  return context;
}

/*=======================================
    Default Classes
========================================= */

const defaultTriggerClass =
  "flex items-center justify-between w-full px-3 py-2 text-sm border border-secondary rounded-lg bg-white cursor-pointer hover:border-primary transition-colors";

const defaultMenuClass =
  "z-40 mt-1 w-full bg-white border border-secondary rounded-lg shadow-lg overflow-hidden";

const defaultMenuFloatingClass =
  "z-40 mt-1 min-w-40 text-start bg-white border border-secondary rounded-lg shadow-lg overflow-hidden absolute right-0 top-full";

const defaultItemClass =
  "px-3 py-2 text-sm cursor-pointer h-9 flex items-center transition-colors hover:bg-primary-light";

const defaultItemActiveClass =
  "px-3 py-2 text-sm cursor-pointer bg-primary h-9 flex items-center text-primary-foreground";

const defaultSearchClass =
  "w-full px-3 py-2 text-sm outline-none placeholder:text-gray-400";

const defaultEmptyClass = "px-3 py-4 text-sm text-gray-400 text-center";

/*=======================================
    Debounce hook
========================================= */

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

/*=======================================
    Dropdown (Parent)
    mode: "single" | "multi"
    searchable: boolean
    onSearch: (term) => void  — for async/API search
    loading: boolean          — shows spinner when fetching
    debounce: number (ms)     — debounce delay for onSearch (default 300)
========================================= */

export function Dropdown({
  children,
  value,
  onChange,
  mode = "single",
  searchable = false,
  onSearch,
  loading = false,
  debounce = 300,
  placeholder = "Select...",
  customClass,
  appendClass,
  autoCloseOnChange = true,
}) {
  /* --------------------------- All States --------------------------- */
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);
  const debouncedSearch = useDebounce(search, debounce);

  /*  --------------------------- All Functions --------------------------- */
  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => {
    setIsOpen(false);
    setSearch("");
  };

  const selectItem = (itemValue) => {
    if (mode === "multi") {
      // Toggle item in/out of array
      const current = Array.isArray(value) ? value : [];
      const exists = current.includes(itemValue);
      const next = exists
        ? current.filter((v) => v !== itemValue)
        : [...current, itemValue];
      onChange(next);
      if (autoCloseOnChange) close();
    } else {
      onChange(itemValue);
      if (autoCloseOnChange) close();
    }
  };

  const removeItem = (itemValue, e) => {
    e.stopPropagation();
    if (mode === "multi" && Array.isArray(value)) {
      onChange(value.filter((v) => v !== itemValue));
    }
  };

  const isSelected = (itemValue) => {
    if (mode === "multi") {
      return Array.isArray(value) && value.includes(itemValue);
    }
    return value === itemValue;
  };

  /* --------------------------- All UseEffects --------------------------- */

  // Click-outside to close
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        close();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  // Async search — call onSearch when debounced term changes
  useEffect(() => {
    if (onSearch && isOpen) {
      onSearch(debouncedSearch);
    }
  }, [debouncedSearch]);

  const contextValue = {
    isOpen,
    toggle,
    close,
    search,
    setSearch,
    selectItem,
    removeItem,
    isSelected,
    mode,
    value,
    searchable: searchable || Boolean(onSearch),
    placeholder,
    loading,
    async: Boolean(onSearch),
  };

  return (
    <DropdownContext value={contextValue}>
      <div
        ref={containerRef}
        className={`relative ${customClass || ""} ${appendClass || ""}`}
      >
        {children}
      </div>
    </DropdownContext>
  );
}

/*=======================================
    Dropdown.Trigger
========================================= */

function Trigger({ children, customClass, appendClass, renderIcon = true }) {
  const { isOpen, toggle, mode, value, placeholder, removeItem } =
    useDropdownContext();

  // Default display when no custom children
  const renderValue = () => {
    if (children) return children;

    if (mode === "multi" && Array.isArray(value) && value.length > 0) {
      return (
        <div className="flex flex-wrap gap-1">
          {value.map((v) => (
            <span
              key={v}
              className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-primary-light text-primary rounded"
            >
              {v}
              <X
                size={12}
                className="cursor-pointer hover:text-danger"
                onClick={(e) => removeItem(v, e)}
              />
            </span>
          ))}
        </div>
      );
    }

    if (mode === "single" && value) {
      return <span>{value}</span>;
    }

    return <span className="text-gray-400">{placeholder}</span>;
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={`${customClass ? customClass : defaultTriggerClass} ${appendClass || ""}`}
    >
      <div className="flex-1 text-left min-w-0">{renderValue()}</div>
      {renderIcon && (
        <ChevronDown
          size={16}
          className={`flex-shrink-0 ml-2 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      )}
    </button>
  );
}

/*=======================================
    Dropdown.Menu
========================================= */

function Menu({ children, customClass, appendClass, floating = true }) {
  const { isOpen, search, setSearch, searchable, loading } =
    useDropdownContext();
  const { easing, duration } = useAnimations();
  const searchRef = useRef(null);

  useEffect(() => {
    if (isOpen && searchable && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen, searchable]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: duration.fast, ease: easing.easeOut },
          }}
          exit={{
            opacity: 0,
            y: -8,
            transition: { duration: duration.fast, ease: easing.easeIn },
          }}
          className={`${customClass ? customClass : floating ? defaultMenuFloatingClass : defaultMenuClass} ${appendClass || ""}`}
        >
          {searchable && (
            <div className="flex items-center px-3 border-b border-secondary">
              <Search size={14} className="text-gray-400 flex-shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className={defaultSearchClass}
              />
            </div>
          )}
          <div className="h-60 overflow-y-auto py-1">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 size={18} className="animate-spin text-primary" />
              </div>
            ) : (
              children
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/*=======================================
    Dropdown.Item
========================================= */

function Item({ children, value: itemValue, customClass, appendClass }) {
  const {
    selectItem,
    isSelected,
    search,
    async: isAsync,
  } = useDropdownContext();
  const active = isSelected(itemValue);

  // Client-side filtering — skip when async (API already filtered)
  if (!isAsync) {
    const label =
      typeof children === "string" ? children : String(itemValue || "");
    if (search && !label.toLowerCase().includes(search.toLowerCase())) {
      return null;
    }
  }

  return (
    <div
      onClick={() => selectItem(itemValue)}
      className={`${customClass ? customClass : active ? defaultItemActiveClass : defaultItemClass} ${appendClass || ""}`}
      // className="flex items-center gap-2 h-9"
    >
      {children}
    </div>
  );
}

/*=======================================
    Dropdown.Empty — shown when no results
========================================= */

function Empty({ children = "No results found", customClass, appendClass }) {
  return (
    <div
      className={`${customClass ? customClass : defaultEmptyClass} ${appendClass || ""}`}
    >
      {children}
    </div>
  );
}

/*=======================================
    Attach sub-components
========================================= */

Dropdown.Trigger = Trigger;
Dropdown.Menu = Menu;
Dropdown.Item = Item;
Dropdown.Empty = Empty;
