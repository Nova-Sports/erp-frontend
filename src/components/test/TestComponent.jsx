import React, { useState } from "react";
import Button from "../buttons/Button";
import Table from "../table/Table";
import { useNotification } from "@/contexts/NotificationContext";
import { Dropdown } from "../dropdown/Dropdown";
import { Modal } from "../modal/Modal";
import { Menu, Search } from "lucide-react";
import { div, span } from "framer-motion/client";
import FormInput from "../form-input/FormInput";

export default function TestComponent() {
  /* ========================= All States ========================= */
  const [limit, setLimit] = useState(10);

  const [searchBy, setSearchBy] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationsList, setLocationsList] = useState([
    { id: 1, locationName: "Krown Sports" },
    { id: 2, locationName: "Krown Retails" },
    { id: 3, locationName: "Krown Resellers" },
    { id: 4, locationName: "Nova Sports" },
  ]);

  // Modal States
  const [showAddUpdateModal, setShowAddUpdateModal] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [currentRowData, setCurrentRowData] = useState(null);

  /*  ========================= All Functions ========================= */

  /* ========================= All UseEffects ========================= */
  const { notify } = useNotification();

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
    {
      id: 12,
      customerId: 12,
      customerName: "Customer 12",
      insideSalesPerson: { id: 4, name: "Inside Sales Person 4" },
      outSideSalesPerson: { id: 2, name: "Outside Sales Person 2" },
      paymentTerm: { id: 3, name: "Payment Term 3" },
      poRequired: false,
      state: "GA2",
      locationId: 1,
      locations: { id: 3, locationName: "Krown Resellers" },
      createdAt: "2024-06-12T10:00:00Z",
      updatedAt: "2024-06-12T10:00:00Z",
    },
    {
      id: 13,
      customerId: 13,
      customerName: "Customer 13",
      insideSalesPerson: { id: 1, name: "Inside Sales Person 1" },
      outSideSalesPerson: { id: 3, name: "Outside Sales Person 3" },
      paymentTerm: { id: 4, name: "Payment Term 4" },
      poRequired: true,
      state: "GA3",
      locationId: 2,
      locations: { id: 2, locationName: "Krown Retails" },
      createdAt: "2024-06-13T10:00:00Z",
      updatedAt: "2024-06-13T10:00:00Z",
    },
    {
      id: 14,
      customerId: 14,
      customerName: "Customer 14",
      insideSalesPerson: { id: 2, name: "Inside Sales Person 2" },
      outSideSalesPerson: { id: 4, name: "Outside Sales Person 4" },
      paymentTerm: { id: 1, name: "Payment Term 1" },
      poRequired: false,
      state: "GA4",
      locationId: 1,
      locations: { id: 4, locationName: "Nova Sports" },
      createdAt: "2024-06-14T10:00:00Z",
      updatedAt: "2024-06-14T10:00:00Z",
    },
    {
      id: 15,
      customerId: 15,
      customerName: "Customer 15",
      insideSalesPerson: { id: 3, name: "Inside Sales Person 3" },
      outSideSalesPerson: { id: 2, name: "Outside Sales Person 2" },
      paymentTerm: { id: 2, name: "Payment Term 2" },
      poRequired: true,
      state: "GA5",
      locationId: 2,
      locations: { id: 2, locationName: "Krown Retails" },
      createdAt: "2024-06-15T10:00:00Z",
      updatedAt: "2024-06-15T10:00:00Z",
    },
    {
      id: 16,
      customerId: 16,
      customerName: "Customer 16",
      insideSalesPerson: { id: 4, name: "Inside Sales Person 4" },
      outSideSalesPerson: { id: 1, name: "Outside Sales Person 1" },
      paymentTerm: { id: 3, name: "Payment Term 3" },
      poRequired: false,
      state: "GA6",
      locationId: 1,
      locations: { id: 3, locationName: "Krown Resellers" },
      createdAt: "2024-06-16T10:00:00Z",
      updatedAt: "2024-06-16T10:00:00Z",
    },
    {
      id: 17,
      customerId: 17,
      customerName: "Customer 17",
      insideSalesPerson: { id: 1, name: "Inside Sales Person 1" },
      outSideSalesPerson: { id: 4, name: "Outside Sales Person 4" },
      paymentTerm: { id: 4, name: "Payment Term 4" },
      poRequired: true,
      state: "GA7",
      locationId: 2,
      locations: { id: 2, locationName: "Krown Retails" },
      createdAt: "2024-06-17T10:00:00Z",
      updatedAt: "2024-06-17T10:00:00Z",
    },
    {
      id: 18,
      customerId: 18,
      customerName: "Customer 18",
      insideSalesPerson: { id: 2, name: "Inside Sales Person 2" },
      outSideSalesPerson: { id: 3, name: "Outside Sales Person 3" },
      paymentTerm: { id: 1, name: "Payment Term 1" },
      poRequired: false,
      state: "GA8",
      locationId: 1,
      locations: { id: 4, locationName: "Nova Sports" },
      createdAt: "2024-06-18T10:00:00Z",
      updatedAt: "2024-06-18T10:00:00Z",
    },
    {
      id: 19,
      customerId: 19,
      customerName: "Customer 19",
      insideSalesPerson: { id: 3, name: "Inside Sales Person 3" },
      outSideSalesPerson: { id: 2, name: "Outside Sales Person 2" },
      paymentTerm: { id: 2, name: "Payment Term 2" },
      poRequired: true,
      state: "GA9",
      locationId: 2,
      locations: { id: 2, locationName: "Krown Retails" },
      createdAt: "2024-06-19T10:00:00Z",
      updatedAt: "2024-06-19T10:00:00Z",
    },
    {
      id: 20,
      customerId: 20,
      customerName: "Customer 20",
      insideSalesPerson: { id: 4, name: "Inside Sales Person 4" },
      outSideSalesPerson: { id: 1, name: "Outside Sales Person 1" },
      paymentTerm: { id: 3, name: "Payment Term 3" },
      poRequired: false,
      state: "LA0",
      locationId: 1,
      locations: { id: 3, locationName: "Krown Resellers" },
      createdAt: "2024-06-20T10:00:00Z",
      updatedAt: "2024-06-20T10:00:00Z",
    },
    {
      id: 21,
      customerId: 21,
      customerName: "Customer 21",
      insideSalesPerson: { id: 1, name: "Inside Sales Person 1" },
      outSideSalesPerson: { id: 2, name: "Outside Sales Person 2" },
      paymentTerm: { id: 4, name: "Payment Term 4" },
      poRequired: true,
      state: "LA1",
      locationId: 2,
      locations: { id: 2, locationName: "Krown Retails" },
      createdAt: "2024-06-21T10:00:00Z",
      updatedAt: "2024-06-21T10:00:00Z",
    },
    {
      id: 22,
      customerId: 22,
      customerName: "Customer 22",
      insideSalesPerson: { id: 2, name: "Inside Sales Person 2" },
      outSideSalesPerson: { id: 3, name: "Outside Sales Person 3" },
      paymentTerm: { id: 1, name: "Payment Term 1" },
      poRequired: false,
      state: "LA2",
      locationId: 1,
      locations: { id: 4, locationName: "Nova Sports" },
      createdAt: "2024-06-22T10:00:00Z",
      updatedAt: "2024-06-22T10:00:00Z",
    },
    {
      id: 23,
      customerId: 23,
      customerName: "Customer 23",
      insideSalesPerson: { id: 3, name: "Inside Sales Person 3" },
      outSideSalesPerson: { id: 4, name: "Outside Sales Person 4" },
      paymentTerm: { id: 2, name: "Payment Term 2" },
      poRequired: true,
      state: "LA3",
      locationId: 2,
      locations: { id: 2, locationName: "Krown Retails" },
      createdAt: "2024-06-23T10:00:00Z",
      updatedAt: "2024-06-23T10:00:00Z",
    },
    {
      id: 24,
      customerId: 24,
      customerName: "Customer 24",
      insideSalesPerson: { id: 4, name: "Inside Sales Person 4" },
      outSideSalesPerson: { id: 1, name: "Outside Sales Person 1" },
      paymentTerm: { id: 3, name: "Payment Term 3" },
      poRequired: false,
      state: "LA4",
      locationId: 1,
      locations: { id: 3, locationName: "Krown Resellers" },
      createdAt: "2024-06-24T10:00:00Z",
      updatedAt: "2024-06-24T10:00:00Z",
    },
    {
      id: 25,
      customerId: 25,
      customerName: "Customer 25",
      insideSalesPerson: { id: 1, name: "Inside Sales Person 1" },
      outSideSalesPerson: { id: 3, name: "Outside Sales Person 3" },
      paymentTerm: { id: 4, name: "Payment Term 4" },
      poRequired: true,
      state: "LA5",
      locationId: 2,
      locations: { id: 2, locationName: "Krown Retails" },
      createdAt: "2024-06-25T10:00:00Z",
      updatedAt: "2024-06-25T10:00:00Z",
    },
    {
      id: 26,
      customerId: 26,
      customerName: "Customer 26",
      insideSalesPerson: { id: 2, name: "Inside Sales Person 2" },
      outSideSalesPerson: { id: 4, name: "Outside Sales Person 4" },
      paymentTerm: { id: 1, name: "Payment Term 1" },
      poRequired: false,
      state: "LA6",
      locationId: 1,
      locations: { id: 4, locationName: "Nova Sports" },
      createdAt: "2024-06-26T10:00:00Z",
      updatedAt: "2024-06-26T10:00:00Z",
    },
    {
      id: 27,
      customerId: 27,
      customerName: "Customer 27",
      insideSalesPerson: { id: 3, name: "Inside Sales Person 3" },
      outSideSalesPerson: { id: 2, name: "Outside Sales Person 2" },
      paymentTerm: { id: 2, name: "Payment Term 2" },
      poRequired: true,
      state: "LA7",
      locationId: 2,
      locations: { id: 2, locationName: "Krown Retails" },
      createdAt: "2024-06-27T10:00:00Z",
      updatedAt: "2024-06-27T10:00:00Z",
    },
    {
      id: 28,
      customerId: 28,
      customerName: "Customer 28",
      insideSalesPerson: { id: 4, name: "Inside Sales Person 4" },
      outSideSalesPerson: { id: 1, name: "Outside Sales Person 1" },
      paymentTerm: { id: 3, name: "Payment Term 3" },
      poRequired: false,
      state: "LA8",
      locationId: 1,
      locations: { id: 3, locationName: "Krown Resellers" },
      createdAt: "2024-06-28T10:00:00Z",
      updatedAt: "2024-06-28T10:00:00Z",
    },
    {
      id: 29,
      customerId: 29,
      customerName: "Customer 29",
      insideSalesPerson: { id: 1, name: "Inside Sales Person 1" },
      outSideSalesPerson: { id: 4, name: "Outside Sales Person 4" },
      paymentTerm: { id: 4, name: "Payment Term 4" },
      poRequired: true,
      state: "LA9",
      locationId: 2,
      locations: { id: 2, locationName: "Krown Retails" },
      createdAt: "2024-06-29T10:00:00Z",
      updatedAt: "2024-06-29T10:00:00Z",
    },
    {
      id: 30,
      customerId: 30,
      customerName: "Customer 30",
      insideSalesPerson: { id: 2, name: "Inside Sales Person 2" },
      outSideSalesPerson: { id: 3, name: "Outside Sales Person 3" },
      paymentTerm: { id: 1, name: "Payment Term 1" },
      poRequired: false,
      state: "State 30",
      locationId: 1,
      locations: { id: 4, locationName: "Nova Sports" },
      createdAt: "2024-06-30T10:00:00Z",
      updatedAt: "2024-06-30T10:00:00Z",
    },
  ]);

  const [tableLimitData, setTableLimitData] = useState(
    tableData.slice(0, limit),
  );

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

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    // Update TableData to show new limit of entries
    setTableLimitData(tableData.slice(0, newLimit));
  };

  /* =============================== Actions Filters ======================================= */

  const ActionItems = () => {
    /* ========================= All States ========================= */

    // Modal States
    const [showMobileActionMenu, setSHowMobileActionMenu] = useState(false);

    /*  ========================= All Functions ========================= */

    /* ========================= All UseEffects ========================= */

    /*=======================================
        Custom Components    
    ========================================= */

    const RenderLimit = () => {
      return (
        <div className="flex items-center gap-2">
          <span className=" md:inline">Show</span>
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

    const RenderFilterByLocation = () => {
      return (
        <Dropdown
          value={selectedLocation}
          onChange={(value) => setSelectedLocation(value)}
        >
          <Dropdown.Trigger
            appendClass={"!border-primary !border-1 !bg-primary/10"}
            // renderIcon={false}
          >
            Filter By : {selectedLocation?.locationName || "All Locations"}
          </Dropdown.Trigger>
          <Dropdown.Menu>
            <Dropdown.Item value={{ id: 9999999, locationName: "no-location" }}>
              Without Location
            </Dropdown.Item>
            {locationsList.map((location) => (
              <Dropdown.Item
                key={location.id}
                value={location.id}
                onClick={() => setSelectedLocation(location)}
              >
                {location.locationName}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      );
    };

    const RenderSearchFilters = () => {
      return (
        <Dropdown value={searchBy} onChange={(value) => setSearchBy(value)}>
          <Dropdown.Trigger appendClass={"!border-info !border-1 !bg-info/10"}>
            <span className="md:inline">Search By : </span>
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
          <div className="hidden md:block">
            <RenderSearchFilters />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="form-control md:!w-96 flex-1"
          />

          <Button
            title=""
            afterTitle={() => {
              return <Search size={18} />;
            }}
            variant="info"
            appendClasses="md:hidden"
          />
          <Button
            title="Search"
            variant="info"
            appendClasses="hidden md:block"
          />
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
          className={`mx-3 my-3 py-3 px-4 ${true && "bg-white shadow-sm"} hidden md:flex md:flex-row flex-col items-center  justify-between rounded-xl`}
        >
          <div>
            <RenderLimit />
          </div>
          <div className="">
            <div className="flex flex-col md:flex-row items-center gap-5">
              {/* =============== Filter By Locations */}
              <div>
                <RenderFilterByLocation />
              </div>

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
        <div className="md:hidden flex flex-col bg-white rounded-xl py-3 px-3 mx-3 my-2">
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
          appendClass={"max-h-[50dvh]"}
        >
          <Modal.Header>Actions</Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <RenderLimit />
                <RenderFilterByLocation />
              </div>

              <RenderAfterSearchButtons />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              title="Close"
              variant="secondary"
              onClick={() => {
                setSHowMobileActionMenu(false);
              }}
            />
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  /* =============================== Table Functions ======================================= */

  return (
    <div className="">
      {/*=======================================
            Top Action Row    
        ========================================= */}
      <ActionItems />

      {/*=======================================
          Table Section    
      ========================================= */}
      <div className="md:h-[84vh] h-[80dvh] px-3 pb-1 overflow-y-auto ">
        <Table
          headers={tableHeaders}
          data={tableLimitData}
          handleSortBy={handleSortBy}
          onClick={() => {
            notify("Table row clicked", "info", 3000);
          }}
          onDoubleClick={() => {
            notify("Table row double-clicked", "success", 3000);
          }}
        />
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
        <Modal.Header>
          {isUpdateMode ? "Update Entry" : "Add New Entry"}
        </Modal.Header>
        <Modal.Body>
          {/* Form fields for adding/updating entry go here */}
          <form>
            <div className="mb-3 bg-neutral-200 p-3 rounded-md">
              <label htmlFor="customerName" className="block mb-1 font-medium">
                Customer Name
              </label>
              <FormInput
                type="text"
                id={"customerName"}
                placeholder="Enter Customer Name..."
                value={currentRowData?.customerName || ""}
                onChange={(e) => {
                  setCurrentRowData({
                    ...currentRowData,
                    customerName: e.target.value,
                  });
                }}
              />
            </div>
            <div className="mb-3 bg-neutral-200 p-3 rounded-md">
              <label htmlFor="state" className="block mb-1 font-medium">
                State
              </label>

              {/* <input
                type="text"
                id="state"
                className="form-control"
                value={currentRowData?.state || ""}
                onChange={(e) => {
                  setCurrentRowData({
                    ...currentRowData,
                    state: e.target.value,
                  });
                }}
              /> */}
              <FormInput
                type="text"
                id={"state"}
                placeholder="Enter State..."
                value={currentRowData?.state || ""}
                onChange={(e) => {
                  setCurrentRowData({
                    ...currentRowData,
                    state: e.target.value,
                  });
                }}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            title={isUpdateMode ? "Update" : "Add"}
            variant="primary"
            onClick={() => {
              // Handle add/update logic here
              setShowAddUpdateModal(false);
              setIsUpdateMode(false);
              setCurrentRowData(null);
              notify(
                isUpdateMode
                  ? "Entry updated successfully"
                  : "Entry added successfully",
                "success",
                3000,
              );
            }}
          />
          <Button
            title="Cancel"
            variant="secondary"
            onClick={() => {
              setShowAddUpdateModal(false);
              setIsUpdateMode(false);
              setCurrentRowData(null);
              notify("Action cancelled", "warning", 3000);
            }}
          />
        </Modal.Footer>
      </Modal>
    </div>
  );
}
