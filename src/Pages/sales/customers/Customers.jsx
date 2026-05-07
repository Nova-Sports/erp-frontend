import Button from "@/components/buttons/Button";
import { Dropdown } from "@/components/dropdown/Dropdown";
import { Modal } from "@/components/modal/Modal";
import Pagination from "@/components/pagination/Pagination";
import CSearch from "@/components/Search/CSearch";
import Table from "@/components/table/Table";
import { useNotification } from "@/contexts/NotificationContext";
import { useUpdateParams } from "@/custom-hooks/useUpdateParams";
import authHeader from "@/services/auth-header";
import API from "@/services/axios";
import { ListOrdered, Menu, MapPin, Plus } from "lucide-react";
import { useBatchUpdateParams } from "@/custom-hooks/useUpdateParams";
import { useCallback, useEffect, useState } from "react";

const ActionItems = ({
  limit,
  handleLimitChange,
  searchFilters,
  filterBy,
  setFilterBy,
  setQuery,
  setShowAddUpdateModal,
  locationsList,
  selectedLocation,
  setSelectedLocation,
  setPage,
}) => {
  const updateParam = useUpdateParams();
  const batchUpdateParam = useBatchUpdateParams();
  const [showMobileActionMenu, setShowMobileActionMenu] = useState(false);

  const handleLimitChangeLocal = (newLimit) => {
    handleLimitChange(newLimit);
    batchUpdateParam({ limit: newLimit, page: 1 });
  };

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
      <Dropdown value={limit} onChange={(v) => handleLimitChangeLocal(v)}>
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

  const RenderFilterByLocation = () => (
    <Dropdown
      value={selectedLocation}
      onChange={(value) => {
        const loc = locationsList.find((l) => l.id === value) || null;
        setSelectedLocation(loc);
      }}
    >
      <Dropdown.Trigger appendClass="!border-primary !border-1 !bg-primary/10">
        <span className="text-nowrap">
          {selectedLocation?.name || "All Locations"}
        </span>
      </Dropdown.Trigger>
      <Dropdown.Menu appendClass="w-full">
        <Dropdown.Item value={null}>All Locations</Dropdown.Item>
        {locationsList.map((location) => (
          <Dropdown.Item key={location.id} value={location.id}>
            {location.name}
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
    <Button title="Add Customer" onClick={() => setShowAddUpdateModal(true)} />
  );

  return (
    <>
      {/* Desktop */}
      <div className="mb-2 py-2 px-4 bg-white shadow-sm hidden lg:flex lg:flex-row flex-col items-center justify-between rounded-xl">
        <RenderLimit />
        <div className="flex flex-col lg:flex-row items-center gap-5">
          <RenderFilterByLocation />
          <RenderSearch />
          <RenderAfterSearchButtons />
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden flex flex-col bg-white rounded-xl py-3 px-3 mx-3 my-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="">
              <RenderSearchFilters />
            </div>
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
            <div className="flex items-center justify-between bg-primary/5 rounded-lg px-3 py-2 shadow-sm">
              <span className="font-medium text-gray-700 flex items-center gap-2">
                <MapPin size={18} className="inline-block" />
                Location
              </span>
              <RenderFilterByLocation />
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
  { label: "C-ID", value: "cu_customerId" },
  { label: "Customer Name", value: "cu_customerName" },
  { label: "State", value: "cu_b_State" },
];

const getDataApi = "/s-customers";

export default function Customers() {
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
  const [locationsList, setLocationsList] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [showAddUpdateModal, setShowAddUpdateModal] = useState(false);

  const getLocations = async () => {
    try {
      const { data } = await API.post(
        "/locations?page=1&limit=1000",
        { query: null, filterBy: null, sortBy: null, sortDirection: null },
        { headers: authHeader() },
      );
      if (data?.success) setLocationsList(data.data || []);
    } catch (err) {
      console.error("Failed to fetch locations:", err.message);
    }
  };

  const tableHeaders = [
    {
      id: "cu_customerId",
      label: "C-ID",
      sortBy: "cu_customerId",
      render: (row) => (
        <span className="text-nowrap font-mono text-xs">
          {row.cu_customerId ?? "-"}
        </span>
      ),
    },
    {
      id: "cu_customerName",
      label: "Customer Name",
      sortBy: "cu_customerName",
      render: (row) => (
        <span className="text-nowrap font-medium">
          {row.cu_customerName || "-"}
        </span>
      ),
    },
    {
      id: "cu_insideSalesPerson",
      label: "Inside Sales Person",
      sortBy: false,
      render: (row) => (
        <span className="text-nowrap">
          {row.insideSalesPerson?.name || row.cu_insideSalesPersonId || "-"}
        </span>
      ),
    },
    {
      id: "cu_outsideSalesPerson",
      label: "Outside Sales Person",
      sortBy: false,
      render: (row) => (
        <span className="text-nowrap">
          {row.outsideSalesPerson?.name || row.cu_outsideSalesPersonId || "-"}
        </span>
      ),
    },
    {
      id: "cu_paymentTerm",
      label: "Payment Term",
      sortBy: false,
      render: (row) => (
        <span className="text-nowrap">
          {row.paymentTerm?.termName || row.cu_paymentTermsId || "-"}
        </span>
      ),
    },
    {
      id: "cu_isPoRequired",
      label: "PO Required",
      sortBy: "cu_isPoRequired",
      render: (row) => (
        <span
          className={`text-nowrap px-2 py-0.5 rounded-full text-xs font-medium ${
            row.cu_isPoRequired
              ? "bg-yellow-100 text-yellow-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {row.cu_isPoRequired ? "Yes" : "No"}
        </span>
      ),
    },
    {
      id: "cu_b_State",
      label: "State",
      sortBy: "cu_b_State",
      render: (row) => (
        <span className="text-nowrap">{row.cu_b_State || "-"}</span>
      ),
    },
    {
      id: "cu_location",
      label: "Location",
      sortBy: false,
      render: (row) => (
        <span className="text-nowrap">
          {row.location?.name || row.cu_locationId || "-"}
        </span>
      ),
    },
    {
      id: "actions",
      label: "Actions",
      sortBy: false,
      render: (row) => (
        <div className="me-4 flex justify-end items-center gap-2">
          <Button
            title="Edit"
            variant="primary"
            size="sm"
            onClick={() => {
              updateParam("customer-id", row.id);
              setShowAddUpdateModal(true);
            }}
          />
        </div>
      ),
    },
  ];

  const handleLimitChange = (value) => {
    setLimit(value);
    setPage(1);
  };

  const handleSortBy = (sortColumn, sortDirection) => {
    getCustomers(sortColumn, sortDirection);
  };

  const getCustomers = useCallback(
    async (sortBy = null, sortDirection = null) => {
      try {
        setLoading(true);
        const { data } = await API.post(
          `${getDataApi}?page=${page}&limit=${limit}`,
          {
            query,
            filterBy: filterBy?.value,
            sortBy,
            sortDirection,
            locationId: selectedLocation?.id || null,
          },
          { headers: authHeader() },
        );
        if (data?.success) {
          setTableData(data.data);
          setTotalPages(data.totalPages);
          setTotalResults(data.total);
        } else {
          notify(data.message || "Failed to fetch customers", "error", 3000);
        }
      } catch (err) {
        notify(err.message, "error", 5000);
      } finally {
        setLoading(false);
      }
    },
    [limit, page, query, filterBy],
  );

  useEffect(() => {
    getLocations();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      getCustomers();
    }, 50);
    return () => clearTimeout(timeout);
  }, [limit, query, page, filterBy, selectedLocation]);

  return (
    <div className="flex flex-col h-full overflow-y-auto overflow-auto max-lg:px-3 lg:p-3 lg:pb-1">
      <ActionItems
        limit={limit}
        searchFilters={searchFilters}
        filterBy={filterBy}
        setFilterBy={setFilterBy}
        setQuery={setQuery}
        handleLimitChange={handleLimitChange}
        setShowAddUpdateModal={setShowAddUpdateModal}
        locationsList={locationsList}
        selectedLocation={selectedLocation}
        setSelectedLocation={(loc) => {
          setSelectedLocation(loc);
          setPage(1);
        }}
        setPage={setPage}
      />

      <Table
        heightClasses="lg:h-[79vh] h-[50dvh] overflow-y-auto grow"
        headers={tableHeaders}
        data={tableData}
        handleSortBy={handleSortBy}
        loading={loading}
      />

      <div className="bg-white w-full shadow-md rounded-xl px-4 py-2 my-2">
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={totalPages || 1}
          totalResults={totalResults}
          updateParams={false}
        />
      </div>
    </div>
  );
}
