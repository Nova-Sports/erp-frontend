/*=======================================
  Todo:
    
    - Add Sort Functionality to table
    - Add Available to password functionality
    - Lock Password
      
========================================= */

import Button from "@/components/buttons/Button";
import DeleteModalButton from "@/components/delete-modal/DeleteModalButton";
import { Dropdown } from "@/components/dropdown/Dropdown";
import { Modal } from "@/components/modal/Modal";
import Pagination from "@/components/pagination/Pagination";
import CSearch from "@/components/Search/CSearch";
import Table from "@/components/table/Table";
import { useNotification } from "@/contexts/NotificationContext";
import {
  useBatchUpdateParams,
  useUpdateParams,
} from "@/custom-hooks/useUpdateParams";
import authHeader from "@/services/auth-header";
import API from "@/services/axios";
import {
  EyeClosed,
  EyeIcon,
  EyeOff,
  ListOrdered,
  Lock,
  Menu,
  Pencil,
  Plus,
  PlusCircle,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import PsAddUpdate from "./PsAddUpdate";
import PsGenerator from "./PsGenerator";

import { getDateTimeFromTimeStamp } from "@/utils/dateUtils";
import { AnimatePresence, motion } from "framer-motion";
import { truncateString } from "@/utils/utilityFunc";

const RenderFilterTabs = ({ filterTabs, filterByTab, setFilterByTab }) => {
  const activeTabClass = "bg-primary text-white";
  const inactiveTabClass = "bg-white !text-gray-600 hover:!text-white";
  const commonTabClasses = "rounded-none border border-primary shadow-none";

  const [showMobileTabs, setShowMobileTabs] = useState(false);

  return (
    <div className="text-nowrap relative w-full grow">
      {/* Desktop Version */}
      <div className="hidden lg:flex items-center border border-primary rounded">
        {filterTabs.map((tab, index) => (
          <Button
            key={tab.id}
            title={tab.label}
            appendClasses={`${
              index === 0
                ? "rounded-l"
                : index === filterTabs.length - 1
                  ? "rounded-r"
                  : "border-x-0"
            } ${filterByTab === tab.id ? activeTabClass : inactiveTabClass} ${commonTabClasses}`}
            onClick={tab.onClick}
          />
        ))}
      </div>
      {/* Mobile Version */}
      <div className="lg:hidden flex-center ">
        {/* Horizontal scrollable tabs */}

        <button
          onClick={() => setShowMobileTabs(!showMobileTabs)}
          className="bg-white size-12 flex-center rounded-full "
        >
          <PlusCircle
            size={30}
            className={`${showMobileTabs ? "rotate-45" : ""} transition-transform `}
          />
        </button>
      </div>
      <AnimatePresence>
        {showMobileTabs && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            exit={{
              opacity: 0,
              y: 20,
              transition: { duration: 0.2 },
            }}
            onClick={(e) => {
              setShowMobileTabs(false);
            }}
            className="lg:hidden absolute  bg-gradient-to-t  from-neutral-100  h-64 bottom-14 w-96 right-0 flex items-end  justify-end rounded"
          >
            <div className="bg-white center-box-shadow h-fit flex flex-col z-50 justify-center items-end rounded-md py-4 w-3/5 gap-2 px-4">
              {filterTabs?.map((tab) => (
                <button
                  onClick={tab.onClick}
                  key={tab.id}
                  className={`${filterByTab === tab.id ? "bg-primary text-white " : "bg-page"} w-full  px-3 py-1 rounded`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ActionItems = ({
  refreshFunc,
  filterTabs,
  filterByTab,
  setFilterByTab,
  limit,
  setQuery,
  setLimit,
  filterBy,
  setFilterBy,
  tableHeaders,
  setShowAddUpdateModal,
  setPage,
}) => {
  /* ========================= All States ========================= */
  const updateParam = useUpdateParams();
  const batchUpdateParam = useBatchUpdateParams();

  // Modal States
  const [showMobileActionMenu, setSHowMobileActionMenu] = useState(false);

  /*  ========================= All Functions ========================= */

  const handleSearch = useCallback(
    (v) => {
      updateParam("query", v);
      setQuery(v);
      // refreshFunc(v);
    },
    [updateParam, filterBy],
  );

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
    batchUpdateParam({ limit: newLimit, page: 1 });
  };

  /* ========================= All UseEffects ========================= */

  /*=======================================
        Custom Components    
    ========================================= */

  const RenderLimit = ({ direction = "left" }) => {
    return (
      <div className="flex items-center gap-2">
        <span className=" lg:inline">Show</span>
        <Dropdown value={limit} onChange={(v) => handleLimitChange(v)}>
          <Dropdown.Trigger
            appendClass={"w-16 !border-primary !bg-primary-light "}
            // renderIcon={false}
          >
            {limit}
          </Dropdown.Trigger>
          <Dropdown.Menu
            appendClass={"min-w-20"}
            direction={direction}
            // floating={false}
          >
            {limitOptions.map((option) => (
              <Dropdown.Item key={option} value={option}>
                {option}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  };

  const RenderSearchFilters = () => {
    return (
      <Dropdown
        value={filterBy}
        onChange={(value) => {
          let selectedFilter = searchFilters.find(
            (filter) => filter.value === value,
          );
          setFilterBy(selectedFilter);
        }}
      >
        <Dropdown.Trigger appendClass={"!border-info !border-1 !bg-info/10"}>
          <span className="hidden xl:inline text-nowrap">Search By : </span>
          <span className="text-nowrap">{filterBy?.label || "All"}</span>
        </Dropdown.Trigger>
        <Dropdown.Menu appendClass="w-full">
          {searchFilters.map((filter) => (
            <Dropdown.Item
              appendClass={"py-0"}
              key={filter.value}
              value={filter.value}
            >
              {filter.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  const RenderSearch = () => {
    return (
      <div className="flex items-center  gap-2">
        {/* Search By Filters */}
        <div className="hidden lg:block">
          <RenderSearchFilters />
        </div>
        <CSearch updateText={handleSearch} />
      </div>
    );
  };

  const RenderAfterSearchButtons = () => {
    return (
      <>
        {/* Add New Entry */}
        <Button
          title="Add"
          onClick={(e) => {
            setShowAddUpdateModal(true);
          }}
        />
      </>
    );
  };

  return (
    <>
      {/*=======================================
          Desktop Mode    
      ========================================= */}
      <div
        className={`mx-3 my-4 py-3 h-[8svh] px-4 ${true && "bg-white shadow-sm"} hidden lg:flex lg:flex-row flex-col items-center justify-between rounded-xl`}
      >
        <div>
          <RenderFilterTabs
            filterTabs={filterTabs}
            filterByTab={filterByTab}
            setFilterByTab={setFilterByTab}
          />
        </div>
        <div className="">
          <div className="flex flex-col lg:flex-row items-center gap-5">
            {/* Render Page Limit */}
            <RenderLimit />
            {/* =============== Filter By Locations */}
            {/* <div>
                <RenderFilterByLocation />
              </div> */}

            {/* =============== Search */}
            <div>
              <RenderSearch />
            </div>
            {/* =============== After Search Buttons */}
            <div>
              <RenderAfterSearchButtons />
            </div>
          </div>
        </div>
      </div>
      {/*=======================================
            Mobile View    
        ========================================= */}
      <div className="lg:hidden flex flex-col bg-white rounded-xl py-3 px-3 mx-3 my-2">
        <div className="flex flex-col gap-2">
          <div className=" flex items-center justify-between">
            <div className="">
              <RenderSearchFilters />
            </div>

            <Button
              title=""
              onClick={() => {
                setSHowMobileActionMenu(true);
              }}
              afterTitle={() => {
                return <Menu size={18} />;
              }}
            />
          </div>
          <RenderSearch />
        </div>
      </div>
      <Modal
        open={showMobileActionMenu}
        onHide={() => {
          setSHowMobileActionMenu(false);
        }}
        position="bottom"
        size="full"
        appendClass={
          "max-h-[55svh] bg-gradient-to-t from-primary/10 via-white to-white rounded-t-2xl shadow-2xl border-t-2 border-primary"
        }
      >
        <Modal.Header>
          <div className="flex items-center gap-2 text-primary font-bold text-lg">
            <Menu size={22} className="inline-block" />
            Quick Actions
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-5 px-1 py-2">
            <div className="flex items-center justify-between bg-primary/5 rounded-lg px-3 py-2 shadow-sm">
              <span className="font-medium text-gray-700 flex items-center gap-2">
                <ListOrdered size={18} className="inline-block" />
                Show
              </span>
              <RenderLimit direction="right" />
            </div>
            {/* <div className="flex items-center justify-between bg-primary/5 rounded-lg px-3 py-2 shadow-sm">
              <span className="font-medium text-gray-700 flex items-center gap-2">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /></svg>
                Filter
              </span>
              <RenderFilterByLocation />
            </div> */}
            <div className="flex flex-col gap-2 bg-primary/5 rounded-lg px-3 py-3 shadow-sm">
              <span className="font-medium text-gray-700 flex items-center gap-2 mb-1">
                <Plus size={18} className="inline-block" />
                Add New
              </span>
              <RenderAfterSearchButtons />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            title="Close"
            variant="secondary"
            onClick={() => {
              setSHowMobileActionMenu(false);
            }}
            appendClasses="w-full py-2 text-lg font-semibold rounded-lg "
          />
        </Modal.Footer>
      </Modal>
    </>
  );
};

const getPasswordType = (tab) => {
  switch (tab) {
    case "Company":
      return "company";
    case "Customer Portal":
      return "customer_portal";
    case "Private":
      return "private";
    default:
      return "company";
  }
};

const ShowHidePassword = ({ password }) => {
  const { notify } = useNotification();
  const [showPassword, setShowPassword] = useState(false);
  const [decryptedPassword, setDecryptedPassword] = useState(null);

  const decryptPassword = async (id) => {
    try {
      const { data } = await API.post(
        `/sales/password-decrypt`,
        { id },
        {
          headers: authHeader(),
        },
      );
      if (data?.success) {
        return data.data;
      } else {
        notify(data.message || "Failed to decrypt password", "error", 3000);
        return null;
      }
    } catch (err) {
      console.log(err.message);
      notify(err.message, "error", 5000);
      return null;
    }
  };

  // Double click to copy password
  const handleDoubleClick = async () => {
    if (!decryptedPassword) {
      const decrypted = await decryptPassword(password.id);
      if (decrypted) {
        navigator.clipboard.writeText(decrypted);
        notify("Password copied to clipboard", "success", 2000);
      }
    } else {
      navigator.clipboard.writeText(decryptedPassword);
      notify("Password copied to clipboard", "success", 2000);
    }
  };

  return (
    <>
      <div
        className="flex items-center gap-2"
        onDoubleClick={handleDoubleClick}
      >
        {decryptedPassword ? truncateString(decryptedPassword, 15) : "********"}
        <Button
          title={""}
          afterTitle={() => {
            return (
              <>{showPassword ? <EyeIcon size={18} /> : <EyeOff size={18} />}</>
            );
          }}
          customClasses="!bg-white/0 flex !text-primary"
          onClick={async () => {
            if (!showPassword) {
              let decrypted = await decryptPassword(password.id);
              setDecryptedPassword(decrypted);
              setShowPassword(true);
            } else {
              setDecryptedPassword(null);
              setShowPassword(false);
            }
          }}
          appendClasses="ml-2 flex-center "
          size="xs"
        />
      </div>
    </>
  );
};

let limitOptions = [5, 10, 15, 20, 50];

let searchFilters = [
  { label: "All", value: null },
  { label: "Title", value: "ps_title" },
  { label: "Username", value: "ps_username" },
  { label: "URL", value: "ps_url" },
];

function LockScreen({ onUnlock }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleUnlock = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post(
        "/sales/password-verify",
        { password: input },
        {
          headers: authHeader(),
        },
      );
      if (data?.success) {
        onUnlock();
      } else {
        setError("Incorrect password. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-primary/10  top-0 left-0 z-50">
      <div className="bg-white shadow-lg rounded-xl p-8 flex flex-col items-center min-w-80">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-primary/10 rounded-full p-4 mb-2">
            <Lock size={48} className="text-primary" />
          </div>
          <h2 className="text-3xl font-extrabold text-primary mb-1 tracking-tight">
            Password Manager Locked
          </h2>
          <p className="text-gray-600 text-center text-base max-w-xs">
            For your security, please enter your sign-in password to access
            passwords.
          </p>
        </div>
        <form
          onSubmit={handleUnlock}
          className="w-full flex flex-col items-center"
        >
          <input
            ref={inputRef}
            type="password"
            className="form-control border px-3 py-2 rounded mb-2 w-full"
            placeholder="Enter password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
          />
          {error && <div className="text-red-500 mb-2">{error}</div>}
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded w-full"
          >
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Password() {
  // Lock system state
  const [locked, setLocked] = useState(true);
  const inactivityTimer = useRef(null);

  // Reset inactivity timer and relock after 5 seconds
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      setLocked(true);
    }, 5 * 60000); // 5 minutes
  }, []);

  // Attach listeners to reset timer on user activity
  useEffect(() => {
    if (!locked) {
      const events = ["mousemove", "keydown", "mousedown", "touchstart"];
      const handler = () => resetInactivityTimer();
      events.forEach((evt) => window.addEventListener(evt, handler));
      resetInactivityTimer();
      return () => {
        events.forEach((evt) => window.removeEventListener(evt, handler));
        if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      };
    }
  }, [locked, resetInactivityTimer]);
  /* ========================= All States ========================= */
  const { notify } = useNotification();

  const [query, setQuery] = useState("");

  const [loading, setLoading] = useState(true);

  // Modal States
  const [showAddUpdateModal, setShowAddUpdateModal] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [currentRowData, setCurrentRowData] = useState(null);
  // Notes Modal States
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notesValue, setNotesValue] = useState("");
  const [notesRowData, setNotesRowData] = useState(null);
  const [notesLoading, setNotesLoading] = useState(false);

  // Pagination States
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [limit, setLimit] = useState(10);

  let filterTabs = [
    {
      id: "Company",
      label: "Company",
      onClick: () => setFilterByTab("Company"),
    },
    {
      id: "Customer Portal",
      label: "Customer Portal",
      onClick: () => setFilterByTab("Customer Portal"),
    },
    {
      id: "Private",
      label: "Private",
      onClick: () => setFilterByTab("Private"),
    },
    {
      id: "Password Generator",
      label: "Password Generator",
      onClick: () => setFilterByTab("Password Generator"),
    },
  ];

  /*  ========================= All Functions ========================= */

  const [tableData, setTableData] = useState([]);

  const [filterByTab, setFilterByTab] = useState("Company");
  const [filterBy, setFilterBy] = useState({ label: "All", value: null });

  const handleSortBy = (sortColumn, sortDirection) => {
    getPasswords(sortColumn, sortDirection);
  };

  const getPasswords = useCallback(
    async (sortBy = null, sortDirection = null) => {
      try {
        setLoading(true);
        const { data } = await API.post(
          `/sales/passwords?page=${page}&limit=${limit}`,
          {
            type: getPasswordType(filterByTab),
            query,
            filterBy: filterBy?.value,
            sortBy,
            sortDirection,
          },
          { headers: authHeader() },
        );
        if (data?.success) {
          setTableData(data.data);
          setTotalPages(data.totalPages);
          setTotalResults(data.total);
        } else {
          notify(data.message || "Failed to fetch passwords", "error", 3000);
        }
        setLoading(false);
      } catch (err) {
        console.log(err.message);
        setLoading(false);
        notify(err.message, "error", 5000);
      }
    },
    [filterByTab, limit, page, query, filterBy],
  );

  // Delete Password
  const handleDeletePassword = async (id) => {
    try {
      const { data } = await API.delete(`/sales/password/${id}`, {
        headers: authHeader(),
      });
      if (data?.success) {
        notify(
          data.message || "Password deleted successfully",
          "success",
          3000,
        );
        getPasswords();
      } else {
        notify(data.message || "Failed to delete password", "error", 3000);
      }
    } catch (err) {
      console.log(err.message);
      notify(err.message, "error", 5000);
    }
  };

  // Update Notes
  const handleSaveNotes = async () => {
    if (!notesRowData) return;
    setNotesLoading(true);
    try {
      const { data } = await API.patch(
        "/sales/password",
        { ...notesRowData, ps_notes: notesValue, id: notesRowData.id },
        { headers: authHeader() },
      );
      if (data?.success) {
        notify("Notes updated successfully", "success", 3000);
        setShowNotesModal(false);
        setNotesRowData(null);
        setNotesValue("");
        getPasswords();
      } else {
        notify(data.message || "Failed to update notes", "error", 3000);
      }
    } catch (err) {
      notify(err.message, "error", 5000);
    }
    setNotesLoading(false);
  };

  /* =============================== Actions Filters ======================================= */

  /* =============================== Table Functions ======================================= */

  const tableHeaders = [
    {
      id: "ps_title",
      label: "Title",
      sortBy: "ps_title",
      customHClasses: "!max-w-52  !min-w-52 ",
      customRClasses: "!max-w-52  !min-w-52 ",
      render: (row) => <span className="text-nowrap">{row.ps_title}</span>,
    },
    {
      id: "ps_username",
      label: "Username",
      sortBy: "ps_username",
      customHClasses: "!min-w-40 truncate !max-w-40",
      customRClasses: "!min-w-40 truncate  !max-w-40",
      render: (row) => row.ps_username,
    },
    {
      id: "ps_passwordValue",
      label: "Password",
      // sortBy: "ps_passwordValue",
      customHClasses: "!min-w-40 truncate !max-w-40",
      customRClasses: "!min-w-40 truncate  !max-w-40",

      render: (row) => <ShowHidePassword password={row} />,
    },
    {
      id: "ps_url",
      label: "URL",
      sortBy: "ps_url",
      customHClasses: "!max-w-52 truncate  !min-w-52 ",
      customRClasses: "!max-w-52  truncate !min-w-52 ",
      render: (row) => row.ps_url,
    },
    {
      id: "updatedAt",
      label: "Last Updated",
      sortBy: "updatedAt",
      customHClasses: "!min-w-40 truncate !max-w-40",
      customRClasses: "!min-w-20 truncate !max-w-20",
      render: (row) => getDateTimeFromTimeStamp(row.updatedAt, " - "),
    },
    {
      id: "actions",
      customHClasses: "!min-w-64 !max-w-40",
      customRClasses: "!min-w-64 !max-w-40",
      label: "Actions",
      sortBy: false,

      render: (row) => {
        return (
          <div className="me-4 flex justify-end items-center gap-2">
            {/* Notes Button */}
            <Button
              title="Notes"
              variant={row.ps_notes ? "success" : "secondary"}
              onClick={() => {
                setNotesRowData(row);
                setNotesValue(row.ps_notes || "");
                setShowNotesModal(true);
              }}
              appendClasses="flex-center "
              size="sm"
            />
            {/* Edit Button */}
            <Button
              title="Edit"
              variant="primary"
              onClick={() => {
                setCurrentRowData(row);
                setIsUpdateMode(true);
                setShowAddUpdateModal(true);
              }}
              appendClasses="flex-center "
              beforeTitle={() => {
                return <Pencil size={12} />;
              }}
              size="sm"
            />
            <DeleteModalButton
              loading={loading}
              onDeleteConfirm={() => handleDeletePassword(row.id)}
            />
          </div>
        );
      },
    },
  ];
  /* ========================= All UseEffects ========================= */
  useEffect(() => {
    if (filterByTab === "Password Generator") {
      return;
    }

    let timeout = setTimeout(() => {
      getPasswords();
    }, 50);
    return () => clearTimeout(timeout);
  }, [filterByTab, limit, query, page, filterBy]);

  if (locked) {
    return <LockScreen onUnlock={() => setLocked(false)} />;
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/*=======================================
            Top Action Row    
        ========================================= */}
      <ActionItems
        refreshFunc={getPasswords}
        setQuery={setQuery}
        filterTabs={filterTabs}
        filterByTab={filterByTab}
        setFilterByTab={setFilterByTab}
        limit={limit}
        setLimit={setLimit}
        filterBy={filterBy}
        setFilterBy={setFilterBy}
        tableHeaders={tableHeaders}
        setShowAddUpdateModal={setShowAddUpdateModal}
        setPage={setPage}
      />

      {/*=======================================
          Table Section    
      ========================================= */}
      <div className="flex-1 flex flex-col overflow-hidden ">
        {filterByTab === "Password Generator" ? (
          <div className=" px-3 pb-1 flex flex-col items-end flex-1 overflow-y-auto ">
            <div className="w-full grow">
              {/* <div className="bg-white rounded-md py-3 px-3 h-full"> */}
              <PsGenerator />
            </div>
            <div className="lg:hidden w-fit mb-2">
              <RenderFilterTabs
                filterTabs={filterTabs}
                filterByTab={filterByTab}
                setFilterByTab={setFilterByTab}
              />
            </div>
          </div>
        ) : (
          <div className="overflow-hidden flex-1 gap-2 flex flex-col ">
            {!loading && tableData.length === 0 ? (
              <div className="flex flex-col flex-1 gap-2 px-3 pb-2">
                <div className="bg-white grow shadow-md flex-center rounded-xl py-3 px-3">
                  <div className="text-center text-gray-500 text-3xl animate-pulse py-4">
                    No passwords found!
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-white grow w-full shadow-md rounded-xl px-4 py-2 ">
                    <Pagination
                      page={1}
                      setPage={setPage}
                      totalPages={1}
                      totalResults={totalResults}
                    />
                  </div>
                  <div className="lg:hidden flex items-end grow h-full flex-col">
                    <RenderFilterTabs
                      filterTabs={filterTabs}
                      filterByTab={filterByTab}
                      setFilterByTab={setFilterByTab}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 h-full px-3 ">
                <div className="flex-1 ">
                  <Table
                    limit={limit}
                    loading={loading}
                    headers={tableHeaders}
                    heightClasses={"lg:h-[75svh] h-[72svh] overflow-y-auto"}
                    data={tableData}
                    handleSortBy={handleSortBy}
                  />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-white grow w-full shadow-md rounded-xl px-4 py-2 ">
                    <Pagination
                      page={page}
                      setPage={setPage}
                      totalPages={totalPages}
                      totalResults={totalResults}
                    />
                  </div>
                  <div className="lg:hidden flex items-end grow h-full flex-col">
                    <RenderFilterTabs
                      filterTabs={filterTabs}
                      filterByTab={filterByTab}
                      setFilterByTab={setFilterByTab}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/*=======================================
          Add / Update Modal    
      ========================================= */}
      <Modal
        open={showAddUpdateModal}
        onHide={() => {
          setShowAddUpdateModal(false);
          setIsUpdateMode(false);
          setCurrentRowData(null);
        }}
        position="right"
        size={"full"}
      >
        <PsAddUpdate
          isUpdateMode={isUpdateMode}
          setShowAddUpdateModal={setShowAddUpdateModal}
          setIsUpdateMode={setIsUpdateMode}
          currentRowData={currentRowData}
          setCurrentRowData={setCurrentRowData}
          filterByTab={filterByTab}
          getPasswordType={getPasswordType}
          refreshFunc={getPasswords}
        />
      </Modal>

      {/*=======================================
          Notes Modal    
      ========================================= */}
      <Modal
        open={showNotesModal}
        onHide={() => {
          setShowNotesModal(false);
          setNotesRowData(null);
          setNotesValue("");
        }}
        position="right"
        size={"full"}
      >
        <Modal.Header>Notes</Modal.Header>
        <Modal.Body>
          <div className="flex flex-col h-full mb-3 bg-neutral-200 px-4 py-2 pb-4 rounded-md flex-1">
            <div className="">
              <label className="block mb-1 font-medium">Notes</label>
            </div>
            <textarea
              className="w-full form-control h-full border rounded p-2"
              value={notesValue}
              type="text-area"
              onChange={(e) => setNotesValue(e.target.value)}
              placeholder="Enter notes..."
              disabled={notesLoading}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            title="Save"
            onClick={handleSaveNotes}
            disabled={notesLoading}
            variant="primary"
          />
          <Button
            title="Cancel"
            variant="secondary"
            onClick={() => {
              setShowNotesModal(false);
              setNotesRowData(null);
              setNotesValue("");
            }}
            disabled={notesLoading}
          />
        </Modal.Footer>
      </Modal>
    </div>
  );
}
