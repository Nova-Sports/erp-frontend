import Button from "@/components/buttons/Button";
import DeleteModalButton from "@/components/delete-modal/DeleteModalButton";
import { Dropdown } from "@/components/dropdown/Dropdown";
import { Modal } from "@/components/modal/Modal";
import Pagination from "@/components/pagination/Pagination";
import CSearch from "@/components/Search/CSearch";
import Table from "@/components/table/Table";
import { useNotification } from "@/contexts/NotificationContext";
import { useUpdateParams } from "@/custom-hooks/useUpdateParams";
import authHeader from "@/services/auth-header";
import API from "@/services/axios";
import { AnimatePresence } from "framer-motion";
import { ListOrdered, Menu, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import EmAddUpdate from "./EmployeeDetails/EmAddUpdate";

import { motion } from "framer-motion";

const ActionItems = ({
  limit,
  handleLimitChange,
  searchBy,
  searchFilters,
  setSearchBy,
  tableHeaders,
  filterBy,
  setFilterBy,
  setQuery,
  setShowAddUpdatePage,
}) => {
  /* ========================= All States ========================= */
  const updateParam = useUpdateParams();

  // Modal States
  const [showMobileActionMenu, setShowMobileActionMenu] = useState(false);

  /*  ========================= All Functions ========================= */

  const handleSearch = useCallback(
    (v) => {
      setQuery(v);
      updateParam("query", v);
      // refreshFunc(v);
    },
    [filterBy],
  );

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
            appendClass={"w-16 !py-1 !border-primary !bg-primary-light "}
            // renderIcon={false}
          >
            {limit}
          </Dropdown.Trigger>
          <Dropdown.Menu appendClass={"min-w-20"} direction={direction}>
            {[5, 10, 20, 50].map((option) => (
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
            setShowAddUpdatePage(true);
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
        className={`mb-2 py-2 px-4 bg-white shadow-sm hidden lg:flex lg:flex-row flex-col items-center  justify-between rounded-xl`}
      >
        <div>
          <RenderLimit />
        </div>
        <div className="">
          <div className="flex flex-col lg:flex-row items-center gap-5">
            {/* =============== Filter By Locations */}

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
      <div className="lg:hidden flex flex-col bg-white rounded-xl py-3 px-3 my-2">
        <div className="flex flex-col gap-2">
          <div className=" flex items-center justify-between">
            <div className="">
              <RenderSearchFilters />
            </div>

            <Button
              title=""
              onClick={() => {
                setShowMobileActionMenu(true);
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
        onHide={() => setShowMobileActionMenu(false)}
        position="bottom"
        size="full"
        appendClass="max-h-[55svh] bg-gradient-to-t from-primary/10 via-white to-white rounded-t-2xl shadow-2xl border-t-2 border-primary"
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
            onClick={() => setShowMobileActionMenu(false)}
            appendClasses="w-full py-2 text-lg font-semibold rounded-lg"
          />
        </Modal.Footer>
      </Modal>
    </>
  );
};

let searchFilters = [
  { label: "All", value: null },
  { label: "First Name", value: "em_firstName" },
  { label: "Last Name", value: "em_lastName" },
  { label: "Phone", value: "em_phone" },
  { label: "Email", value: "em_email" },
];

export default function EmployeeManagement({ RenderFilterTabs }) {
  /* ========================= All States ========================= */
  const { notify } = useNotification();
  const updateParam = useUpdateParams();

  const [query, setQuery] = useState(null);
  const [filterBy, setFilterBy] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [limit, setLimit] = useState(10);
  const [searchBy, setSearchBy] = useState("");

  const [loading, setLoading] = useState(true);

  // Modal States
  const [showAddUpdatePage, setShowAddUpdatePage] = useState(false);

  const [tableData, setTableData] = useState([]);

  const tableHeaders = [
    {
      id: "em_firstName",
      label: "First Name",
      sortBy: "em_firstName",
      customHClasses: "",
      customRClasses: "",
      render: (row) => <span className="text-nowrap">{row.em_firstName}</span>,
    },
    {
      id: "em_lastName",
      label: "Last Name",
      sortBy: "em_lastName",
      render: (row) => <span className="text-nowrap">{row.em_lastName}</span>,
    },
    {
      id: "em_phone",
      label: "Phone",
      sortBy: "em_phone",
      render: (row) => <span className="text-nowrap">{row.em_phone}</span>,
    },
    {
      id: "em_email",
      label: "Email",
      sortBy: "em_email",
      render: (row) => <span className="text-nowrap">{row.em_email}</span>,
    },
    {
      id: "em_isAdmin",
      label: "Role",
      sortBy: "em_isAdmin",
      render: (row) => (
        <span className="text-nowrap">
          {row.em_isAdmin ? "Admin" : "Employee"}
        </span>
      ),
    },

    {
      id: "actions",
      label: "Actions",
      sortBy: false,

      render: (row) => {
        return (
          <div className="me-4 flex justify-end items-center gap-2">
            <Button
              title="Edit"
              variant="primary"
              size="sm"
              onClick={() => {
                updateParam("user-id", row.id);
                setShowAddUpdatePage(true);
              }}
            />
            <DeleteModalButton
              loading={loading}
              disabled={loading || row.em_isAdmin}
              onDeleteConfirm={() => handleDeleteEmployee(row.id)}
            />
          </div>
        );
      },
    },
  ];

  /*  ========================= All Functions ========================= */
  const handleLimitChange = (value) => {
    setLimit(value);
    setPage(1);
  };

  const handleSortBy = (sortColumn, sortDirection) => {
    getEmployees(sortColumn, sortDirection);
  };

  const getEmployees = useCallback(
    async (sortBy = null, sortDirection = null) => {
      try {
        setLoading(true);
        const { data } = await API.post(
          `/employees?page=${page}&limit=${limit}`,
          {
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
          notify(data.message || "Failed to fetch employees", "error", 3000);
        }
        setLoading(false);
      } catch (err) {
        console.log(err.message);
        setLoading(false);
        notify(err.message, "error", 5000);
      }
    },
    [limit, page, query, filterBy],
  );

  // Delete Employee
  const handleDeleteEmployee = async (id) => {
    try {
      const { data } = await API.delete(`/employee/${id}`, {
        headers: authHeader(),
      });
      if (data?.success) {
        notify(
          data.message || "Employee deleted successfully",
          "success",
          3000,
        );
        getEmployees();
      } else {
        notify(data.message || "Failed to delete employee", "error", 3000);
      }
    } catch (err) {
      console.log(err.message);
      notify(err.message, "error", 5000);
    }
  };

  /* ========================= All UseEffects ========================= */

  useEffect(() => {
    let timeout = setTimeout(() => {
      getEmployees();
    }, 50);
    return () => clearTimeout(timeout);
  }, [limit, query, page, filterBy]);

  return (
    <div className="h-full">
      {showAddUpdatePage ? (
        <AnimatePresence mode="wait">
          <motion.div
            key="add-update-page"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.13 }}
            className="h-full"
          >
            <EmAddUpdate
              setShowAddUpdatePage={setShowAddUpdatePage}
              refreshFunc={getEmployees}
              RenderFilterTabs={RenderFilterTabs}
            />
          </motion.div>
        </AnimatePresence>
      ) : (
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key="main-table"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.13 }}
            className="h-full flex flex-col max-lg:px-3"
          >
            <ActionItems
              limit={limit}
              searchFilters={searchFilters}
              filterBy={filterBy}
              setFilterBy={setFilterBy}
              setQuery={setQuery}
              handleLimitChange={handleLimitChange}
              searchBy={searchBy}
              setSearchBy={setSearchBy}
              tableHeaders={tableHeaders}
              setShowAddUpdatePage={setShowAddUpdatePage}
            />

            <Table
              heightClasses={"lg:h-[79vh] h-[50dvh] overflow-y-auto grow"}
              headers={tableHeaders}
              data={tableData}
              handleSortBy={handleSortBy}
              loading={loading}
            />

            <div className="flex items-center gap-2 my-2">
              <div className="bg-white grow w-full shadow-md rounded-xl px-4 py-2 ">
                <Pagination
                  page={page}
                  setPage={setPage}
                  totalPages={totalPages}
                  totalResults={totalResults}
                />
              </div>
              <div className="lg:hidden flex items-end grow h-full flex-col">
                <RenderFilterTabs />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
