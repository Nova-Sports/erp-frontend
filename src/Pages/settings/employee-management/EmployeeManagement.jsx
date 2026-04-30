import Button from "@/components/buttons/Button";
import { Dropdown } from "@/components/dropdown/Dropdown";
import { Modal } from "@/components/modal/Modal";
import Pagination from "@/components/pagination/Pagination";
import Table from "@/components/table/Table";
import { Menu, Search } from "lucide-react";
import React, { useState } from "react";

const ActionItems = ({
  limit,
  handleLimitChange,
  searchBy,
  setSearchBy,
  tableHeaders,
  setShowAddUpdateModal,
}) => {
  /* ========================= All States ========================= */

  // Modal States
  const [showMobileActionMenu, setShowMobileActionMenu] = useState(false);

  /*  ========================= All Functions ========================= */

  /* ========================= All UseEffects ========================= */

  /*=======================================
        Custom Components    
    ========================================= */

  const RenderLimit = () => {
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
          <Dropdown.Menu appendClass={"min-w-20"} direction={"left"}>
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
      <Dropdown value={searchBy} onChange={(value) => setSearchBy(value)}>
        <Dropdown.Trigger appendClass={"!border-info !border-1 !bg-info/10"}>
          <span className="lg:inline">Search By : </span>
          <span className="text-nowrap">{searchBy || "All"}</span>
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
      <form className="flex items-center  gap-2">
        {/* Search By Filters */}
        <div className="hidden lg:block">
          <RenderSearchFilters />
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="form-control lg:!w-96 flex-1"
        />

        <Button
          title=""
          afterTitle={() => {
            return <Search size={18} />;
          }}
          variant="info"
          appendClasses="lg:hidden"
        />
        <Button title="Search" variant="info" appendClasses="hidden lg:block" />
      </form>
    );
  };

  const RenderAfterSearchButtons = () => {
    return (
      <>
        {/* Add New Entry */}
        <Button
          title="Add New"
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
        className={`mb-2 py-2 px-4 ${true && "bg-white shadow-sm"} hidden lg:flex lg:flex-row flex-col items-center  justify-between rounded-xl`}
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
      <div className="lg:hidden flex flex-col bg-white rounded-xl py-3 px-3 mx-3 my-2">
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
        onHide={() => {
          setShowMobileActionMenu(false);
        }}
        position="bottom"
        size="full"
        appendClass={"max-h-[50dvh]"}
      >
        <Modal.Header>Actions</Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <RenderLimit />
            </div>

            <RenderAfterSearchButtons />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            title="Close"
            variant="secondary"
            onClick={() => {
              setShowMobileActionMenu(false);
            }}
          />
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default function EmployeeManagement() {
  /* ========================= All States ========================= */
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [limit, setLimit] = useState(10);
  const [searchBy, setSearchBy] = useState("");

  // Modal States
  const [showAddUpdateModal, setShowAddUpdateModal] = useState(false);

  const [tableData, setTableData] = useState([
    {
      id: 11,
      customerId: 11,
      customerName: "Customer 11",
      insideSalesPerson: { id: 3, name: "Inside Sales Person 3" },
      outSideSalesPerson: { id: 1, name: "Outside Sales Person 1" },
      paymentTerm: { id: 2, name: "Payment Term 2" },
      poRequired: true,
      state: "GA",
      locationId: 2,
      locations: { id: 2, locationName: "Krown Retails" },
      createdAt: "2024-06-11T10:00:00Z",
      updatedAt: "2024-06-11T10:00:00Z",
    },
  ]);

  const [tableHeaders, setTableHeaders] = useState([
    {
      id: "customerId",
      label: "C-ID",
      sortBy: "customerId",
      customHClasses: "",
      customRClasses: "",
      render: (row) => <span className="text-nowrap">{row.customerId}</span>,
    },
    {
      id: "customerName",
      label: "Customer Name",
      sortBy: "customerName",
      render: (row) => row.customerName,
    },
    {
      id: "insideSalesPerson",
      label: "Inside Sales Person",
      sortBy: "insideSalesPerson",
      render: (row) => row.insideSalesPerson.name,
    },
    {
      id: "outSideSalesPerson",
      label: "Outside Sales Person",
      sortBy: "outSideSalesPerson",
      render: (row) => row.outSideSalesPerson.name,
    },
    {
      id: "paymentTerm",
      label: "Payment Term",
      sortBy: "paymentTerm",
      render: (row) => row.paymentTerm.name,
    },
    {
      id: "poRequired",
      label: "PO Required",
      sortBy: "poRequired",
      customRClasses: "w-8",
      render: (row) => {
        return (
          <div className="text-center flex-center">
            {row.poRequired ? (
              <div className="w-10 h-6 flex-center bg-green-100 border-green-300 text-green-800 border text-center rounded-md">
                <span className="text-xs uppercase font-semibold">Yes</span>
              </div>
            ) : (
              <div className="w-10 h-6 flex-center bg-red-100 border-red-300 text-red-800 border text-center rounded-md">
                <span className="text-xs uppercase font-semibold">No</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      id: "state",
      label: "State",
      sortBy: "state",
      customRClasses: "w-8 text-center",
      customHClasses: "w-8 text-center",
      render: (row) => row.state,
    },
    {
      id: "locationId",
      label: "Location",
      sortBy: "locationId",
      render: (row) => row.locations.locationName,
    },
    {
      id: "actions",
      label: "Actions",
      sortBy: false,

      render: (row) => {
        return (
          <div className="me-4">
            <Button title="Edit" variant="primary" size="sm" />
          </div>
        );
      },
    },
  ]);

  /*  ========================= All Functions ========================= */
  const handleLimitChange = (value) => {
    setLimit(value);
    setPage(1);
  };

  /* ========================= All UseEffects ========================= */

  return (
    <div className="h-full">
      <ActionItems
        limit={limit}
        handleLimitChange={handleLimitChange}
        searchBy={searchBy}
        setSearchBy={setSearchBy}
        tableHeaders={tableHeaders}
        setShowAddUpdateModal={setShowAddUpdateModal}
      />

      <Table
        heightClasses={"lg:h-[79vh] h-[79dvh] overflow-y-auto"}
        headers={tableHeaders}
        data={tableData}
      />
      <div className="bg-white grow w-full shadow-md rounded-xl px-4 py-2 mt-2">
        <Pagination
          page={1}
          setPage={setPage}
          totalPages={1}
          totalResults={totalResults}
        />
      </div>
    </div>
  );
}
