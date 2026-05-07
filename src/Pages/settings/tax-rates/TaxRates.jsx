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
import { ArrowDown01, ArrowUp01, ListOrdered, Menu, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import TaxRateAddUpdate from "./tax-rate-details/TaxRateAddUpdate";

const ActionItems = ({
  limit,
  handleLimitChange,
  searchFilters,
  filterBy,
  setFilterBy,
  setQuery,
  setShowAddUpdateModal,
}) => {
  const updateParam = useUpdateParams();
  const [showMobileActionMenu, setShowMobileActionMenu] = useState(false);

  const handleSearch = useCallback(
    (v) => {
      setQuery(v);
      updateParam("query", v);
    },
    [filterBy],
  );

  const RenderLimit = ({ direction = "left" }) => (
    <div className="flex items-center gap-2">
      <span className="lg:inline">Show</span>
      <Dropdown value={limit} onChange={(v) => handleLimitChange(v)}>
        <Dropdown.Trigger appendClass="w-16 !py-1 !border-primary !bg-primary-light">
          {limit}
        </Dropdown.Trigger>
        <Dropdown.Menu appendClass="min-w-20" direction={direction}>
          {[5, 10, 20, 50].map((option) => (
            <Dropdown.Item key={option} value={option}>
              {option}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );

  const RenderSearchFilters = () => (
    <Dropdown
      value={filterBy}
      onChange={(value) => {
        const selected = searchFilters.find((f) => f.value === value);
        setFilterBy(selected);
      }}
    >
      <Dropdown.Trigger appendClass="!border-info !border-1 !bg-info/10">
        <span className="hidden xl:inline text-nowrap">Search By : </span>
        <span className="text-nowrap">{filterBy?.label || "All"}</span>
      </Dropdown.Trigger>
      <Dropdown.Menu appendClass="w-full">
        {searchFilters.map((filter) => (
          <Dropdown.Item
            appendClass="py-0"
            key={filter.value}
            value={filter.value}
          >
            {filter.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );

  const RenderSearch = () => (
    <div className="flex items-center gap-2">
      <div className="hidden lg:block">
        <RenderSearchFilters />
      </div>
      <CSearch updateText={handleSearch} />
    </div>
  );

  const RenderAfterSearchButtons = () => (
    <Button title="Add" onClick={() => setShowAddUpdateModal(true)} />
  );

  return (
    <>
      {/* Desktop */}
      <div className="mb-2 py-2 px-4 bg-white shadow-sm hidden lg:flex lg:flex-row flex-col items-center justify-between rounded-xl">
        <RenderLimit />
        <div className="flex flex-col lg:flex-row items-center gap-5">
          <RenderSearch />
          <RenderAfterSearchButtons />
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden flex flex-col bg-white rounded-xl py-3 px-3 my-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <RenderSearchFilters />
            <Button
              title=""
              onClick={() => setShowMobileActionMenu(true)}
              afterTitle={() => <Menu size={18} />}
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

const searchFilters = [
  { label: "All", value: null },
  { label: "Account Number", value: "taxAccountNumber" },
  { label: "Account Name", value: "taxAccountName" },
  { label: "Tax Rate", value: "taxRate" },
];

const getDataApi = "/tax-rates";
const deleteDataApi = "/tax-rate";
const sortUpApi = "/tax-rate-sort-up";
const sortDownApi = "/tax-rate-sort-down";

export default function TaxRates({ RenderFilterTabs }) {
  const { notify } = useNotification();
  const updateParam = useUpdateParams();

  const [query, setQuery] = useState(null);
  const [filterBy, setFilterBy] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);

  // Modal state
  const [showAddUpdateModal, setShowAddUpdateModal] = useState(false);

  const tableHeaders = [
    {
      id: "taxAccountNumber",
      label: "Account Number",
      render: (row) => (
        <span className="text-nowrap">{row.taxAccountNumber}</span>
      ),
    },
    {
      id: "taxAccountName",
      label: "Account Name",
      render: (row) => (
        <span className="text-nowrap">{row.taxAccountName}</span>
      ),
    },
    {
      id: "taxRate",
      label: "Tax Rate (%)",
      render: (row) => <span className="text-nowrap">{row.taxRate}</span>,
    },
    {
      id: "actions",
      label: "Actions",
      render: (row) => (
        <div className="me-4 flex justify-end items-center gap-2">
          <Button
            title=""
            size="sm"
            onClick={() => sortUp(row.id)}
            appendClasses="!px-1.5 py-1.5 bg-neutral-300/80 text-neutral-600 hover:bg-neutral-200"
            afterTitle={() => <ArrowUp01 className="size-4" />}
          />
          <Button
            title=""
            size="sm"
            onClick={() => sortDown(row.id)}
            appendClasses="!px-1.5 py-1.5 bg-neutral-300/80 text-neutral-600 hover:bg-neutral-200"
            afterTitle={() => <ArrowDown01 className="size-4" />}
          />
          <Button
            title="Edit"
            variant="primary"
            size="sm"
            onClick={() => {
              updateParam("tax-rate-id", row.id);
              setShowAddUpdateModal(true);
            }}
          />
          <DeleteModalButton
            loading={loading}
            disabled={loading}
            onDeleteConfirm={() => handleDelete(row.id)}
          />
        </div>
      ),
    },
  ];

  /*  ========================= All Functions ========================= */

  const handleLimitChange = (value) => {
    setLimit(value);
    setPage(1);
  };

  const handleSortBy = (sortColumn, sortDirection) => {
    getTaxRates(sortColumn, sortDirection);
  };

  const getTaxRates = useCallback(
    async (sortBy = null, sortDirection = null) => {
      try {
        setLoading(true);
        const { data } = await API.post(
          `${getDataApi}?page=${page}&limit=${limit}`,
          { query, filterBy: filterBy?.value, sortBy, sortDirection },
          { headers: authHeader() },
        );
        if (data?.success) {
          setTableData(data.data);
          setTotalPages(data.totalPages);
          setTotalResults(data.total);
        } else {
          notify(data.message || "Failed to fetch tax rates", "error", 3000);
        }
      } catch (err) {
        notify(err.message, "error", 5000);
      } finally {
        setLoading(false);
      }
    },
    [limit, page, query, filterBy],
  );

  const handleDelete = async (id) => {
    try {
      const { data } = await API.delete(`${deleteDataApi}/${id}`, {
        headers: authHeader(),
      });
      if (data?.success) {
        notify("Tax rate deleted successfully", "success", 3000);
        getTaxRates();
      } else {
        notify(data.message || "Failed to delete tax rate", "error", 3000);
      }
    } catch (err) {
      notify(err.message, "error", 5000);
    }
  };

  const sortUp = async (id) => {
    try {
      setLoading(true);
      const { data } = await API.post(
        sortUpApi,
        { id },
        { headers: authHeader() },
      );
      if (data?.success) {
        notify(data.message || "Sorted up successfully", "success", 3000);
        getTaxRates();
      } else {
        notify(data.message || "Failed to sort up", "error", 3000);
      }
    } catch (err) {
      notify(err.message, "error", 5000);
    } finally {
      setLoading(false);
    }
  };

  const sortDown = async (id) => {
    try {
      setLoading(true);
      const { data } = await API.post(
        sortDownApi,
        { id },
        { headers: authHeader() },
      );
      if (data?.success) {
        notify(data.message || "Sorted down successfully", "success", 3000);
        getTaxRates();
      } else {
        notify(data.message || "Failed to sort down", "error", 3000);
      }
    } catch (err) {
      notify(err.message, "error", 5000);
    } finally {
      setLoading(false);
    }
  };

  /* ========================= All UseEffects ========================= */

  useEffect(() => {
    const timeout = setTimeout(() => {
      getTaxRates();
    }, 50);
    return () => clearTimeout(timeout);
  }, [limit, query, page, filterBy]);

  return (
    <div className="flex flex-col h-full overflow-y-auto overflow-auto max-lg:px-3">
      <ActionItems
        limit={limit}
        searchFilters={searchFilters}
        filterBy={filterBy}
        setFilterBy={setFilterBy}
        setQuery={setQuery}
        handleLimitChange={handleLimitChange}
        setShowAddUpdateModal={setShowAddUpdateModal}
      />

      <Table
        heightClasses="lg:h-[79vh] h-[50dvh] overflow-y-auto grow"
        headers={tableHeaders}
        data={tableData}
        handleSortBy={handleSortBy}
        loading={loading}
      />

      <div className="flex items-center gap-2 my-2">
        <div className="bg-white grow w-full shadow-md rounded-xl px-4 py-2">
          <Pagination
            page={page}
            setPage={setPage}
            totalPages={totalPages || 1}
            totalResults={totalResults}
            updateParams={false}
          />
        </div>
        <div className="lg:hidden flex items-end grow h-full flex-col">
          <RenderFilterTabs />
        </div>
      </div>

      <TaxRateAddUpdate
        open={showAddUpdateModal}
        onHide={() => {
          setShowAddUpdateModal(false);
          updateParam("tax-rate-id", null);
        }}
        refreshFunc={getTaxRates}
      />
    </div>
  );
}
