/*=======================================
    Todo:
      - Add mobile friendly action buttons with framer motion animation
      - Add Available to password functionality
      
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
import { ListOrdered, Menu, Pencil, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import PsAddUpdate from "./PsAddUpdate";
import PsGenerator from "./PsGenerator";

const RenderFilterTabs = ({ filterTabs, filterByTab, setFilterByTab }) => {
  const activeTabClass = "bg-primary text-white";
  const inactiveTabClass = "bg-white !text-gray-600 hover:!text-white";
  const commonTabClasses = "rounded-none border border-primary shadow-none";

  return (
    <div className="text-nowrap">
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
      <div className="lg:hidden h-[6dvh] bg-white flex-center">
        {/* Horizontal scrollable tabs */}
        <div className="flex items-center gap-4 px-3 h-full overflow-x-auto">
          {filterTabs.map((tab, index) => (
            <div
              key={tab.id}
              className={`px-3 py-1 flex-center rounded  ${
                filterByTab === tab.id ? "bg-primary text-white" : ""
              } whitespace-nowrap flex-shrink-0 cursor-pointer`}
              onClick={tab.onClick}
            >
              {tab.label}
            </div>
          ))}
        </div>
      </div>
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
    [updateParam],
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
      <Dropdown value={filterBy} onChange={(value) => setFilterBy(value)}>
        <Dropdown.Trigger appendClass={"!border-info !border-1 !bg-info/10"}>
          <span className="hidden xl:inline text-nowrap">Search By : </span>
          <span className="text-nowrap">{filterBy || "All"}</span>
        </Dropdown.Trigger>
        <Dropdown.Menu appendClass="w-full">
          {tableHeaders
            ?.filter((header) => header.sortBy)
            .map((header) => (
              <Dropdown.Item
                appendClass={"py-0"}
                key={header.id}
                value={header.id}
              >
                {header.label}
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
        className={`mx-3 my-4 py-3 h-[8dvh] px-4 ${true && "bg-white shadow-sm"} hidden lg:flex lg:flex-row flex-col items-center  justify-between rounded-xl`}
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
          "max-h-[55dvh] bg-gradient-to-t from-primary/10 via-white to-white rounded-t-2xl shadow-2xl border-t-2 border-primary"
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

let limitOptions = [5, 10, 15, 20, 50];

export default function Password() {
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
  const [filterBy, setFilterBy] = useState(null);

  const handleSortBy = (sortColumn, sortDirection) => {
    if (
      sortColumn === "insideSalesPerson" ||
      sortColumn === "outSideSalesPerson" ||
      sortColumn === "paymentTerm"
    ) {
      const sortedData = [...tableData].sort((a, b) => {
        const aValue = a[sortColumn].name.toLowerCase();
        const bValue = b[sortColumn].name.toLowerCase();
        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
      setTableData(sortedData);
      return;
    }

    if (sortColumn === "locationId") {
      const sortedData = [...tableData].sort((a, b) => {
        const aValue = a.locations.locationName.toLowerCase();
        const bValue = b.locations.locationName.toLowerCase();
        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
      setTableData(sortedData);
      return;
    }

    const sortedData = [...tableData].sort((a, b) => {
      if (a[sortColumn] < b[sortColumn])
        return sortDirection === "asc" ? -1 : 1;
      if (a[sortColumn] > b[sortColumn])
        return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    setTableData(sortedData);
  };

  const getPasswords = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await API.post(
        `/sales/passwords?page=${page}&limit=${limit}`,
        { type: getPasswordType(filterByTab), query, filterBy },
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
  }, [filterByTab, limit, page, query, filterBy]);

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
      customHClasses: "!max-w-96 !min-w-80",
      customRClasses: "!max-w-96 !min-w-80",
      render: (row) => <span className="text-nowrap">{row.ps_title}</span>,
    },
    {
      id: "ps_username",
      label: "Username",
      sortBy: "ps_username",
      customHClasses: "!min-w-40 !max-w-40",
      customRClasses: "!min-w-40 !max-w-40",
      render: (row) => row.ps_username,
    },
    {
      id: "ps_passwordValue",
      label: "Password",
      sortBy: "ps_passwordValue",
      customHClasses: "!min-w-40 !max-w-40",
      customRClasses: "!min-w-40 !max-w-40",
      render: (row) => row.ps_passwordValue,
    },
    {
      id: "ps_url",
      label: "URL",
      sortBy: "ps_url",
      customHClasses: "!max-w-96 !min-w-96",
      customRClasses: "!max-w-96 !min-w-96",
      render: (row) => row.ps_url,
    },
    {
      id: "updatedAt",
      label: "Last Updated",
      sortBy: "updatedAt",
      customHClasses: "!min-w-40 !max-w-40",
      customRClasses: "!min-w-40 !max-w-40",
      render: (row) => row.updatedAt,
    },
    {
      id: "actions",
      customHClasses: "!min-w-40 !max-w-40",
      customRClasses: "!min-w-40 !max-w-40",
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
  }, [filterByTab, limit, query, page]);

  return (
    <div className="h-screen overflow-hidden">
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
      <div className="lg:h-[82vh] h-[100dvh] flex flex-col overflow-hidden ">
        {filterByTab === "Password Generator" ? (
          <div className="lg:h-[83vh] h-[73dvh] px-3 pb-1  overflow-y-auto ">
            <div>
              {/* <div className="bg-white rounded-md py-3 px-3 h-full"> */}
              <PsGenerator />
            </div>
          </div>
        ) : (
          <div className="lg:h-full h-[73dvh]  overflow-hidden  flex flex-col ">
            {!loading && tableData.length === 0 ? (
              <div className="px-3 h-full flex flex-col gap-2">
                <div className="bg-white shadow-md flex-center flex-1 rounded-xl py-3 px-3">
                  <div className="text-center text-gray-500 text-3xl animate-pulse py-4">
                    No passwords found!
                  </div>
                </div>
                <div className="bg-white shadow-md rounded-xl px-4 py-2 mb-2">
                  <Pagination
                    page={1}
                    setPage={setPage}
                    totalPages={1}
                    totalResults={totalResults}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 h-full px-3 ">
                <div className="flex-1 ">
                  <Table
                    limit={limit}
                    loading={loading}
                    headers={tableHeaders}
                    heightClasses={"lg:h-[75vh] h-[66dvh] overflow-y-auto"}
                    data={tableData}
                    handleSortBy={handleSortBy}
                  />
                </div>
                <div className="bg-white shadow-md rounded-xl px-4 py-2 mb-2">
                  <Pagination
                    page={page}
                    setPage={setPage}
                    totalPages={totalPages}
                    totalResults={totalResults}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="lg:hidden flex flex-col">
          <RenderFilterTabs
            filterTabs={filterTabs}
            filterByTab={filterByTab}
            setFilterByTab={setFilterByTab}
          />
        </div>
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
          <div className="flex flex-col h-1/2 mb-3 bg-neutral-200 p-4 rounded-md flex-1">
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
