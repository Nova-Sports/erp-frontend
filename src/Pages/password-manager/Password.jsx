import React, { useEffect, useMemo, useState } from "react";
import { useNotification } from "@/contexts/NotificationContext";
import { Menu, Search } from "lucide-react";
import { Dropdown } from "@/components/dropdown/Dropdown";
import Button from "@/components/buttons/Button";
import Table from "@/components/table/Table";
import { Modal } from "@/components/modal/Modal";
import FormInput from "@/components/form-input/FormInput";
import Tabs from "@/components/tabs/Tabs";

export default function Password() {
  /* ========================= All States ========================= */
  const [limit, setLimit] = useState(20);

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
  ]);

  const [filterByTab, setFilterByTab] = useState("Company");

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
      const sortedData = [...tableLimitData].sort((a, b) => {
        const aValue = a[sortColumn].name.toLowerCase();
        const bValue = b[sortColumn].name.toLowerCase();
        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
      setTableLimitData(sortedData);
      return;
    }

    if (sortColumn === "locationId") {
      const sortedData = [...tableLimitData].sort((a, b) => {
        const aValue = a.locations.locationName.toLowerCase();
        const bValue = b.locations.locationName.toLowerCase();
        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
      setTableLimitData(sortedData);
      return;
    }

    const sortedData = [...tableLimitData].sort((a, b) => {
      if (a[sortColumn] < b[sortColumn])
        return sortDirection === "asc" ? -1 : 1;
      if (a[sortColumn] > b[sortColumn])
        return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    setTableLimitData(sortedData);
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

    const RenderFilterTabs = () => {
      const activeTabClass = "bg-primary text-white";
      const inactiveTabClass = "bg-white !text-gray-600 hover:!text-white";
      const commonTabClasses = "rounded-none border border-primary shadow-none";

      return (
        <div className="">
          <Button
            title="Company"
            appendClasses={`rounded-none rounded-l ${filterByTab === "Company" ? activeTabClass : inactiveTabClass} ${commonTabClasses} border-r-0`}
            onClick={() => {
              setFilterByTab("Company");
            }}
          />
          <Button
            title="Bid"
            appendClasses={`rounded-none border-x-0 ${filterByTab === "Bid" ? activeTabClass : inactiveTabClass} ${commonTabClasses} `}
            onClick={() => {
              setFilterByTab("Bid");
            }}
          />
          <Button
            title="Private"
            appendClasses={`rounded-none border-x-0 ${filterByTab === "Private" ? activeTabClass : inactiveTabClass} ${commonTabClasses} `}
            onClick={() => {
              setFilterByTab("Private");
            }}
          />
          <Button
            title="Password Generator"
            appendClasses={`rounded-none rounded-r border-l-0 ${filterByTab === "Password Generator" ? activeTabClass : inactiveTabClass} ${commonTabClasses} `}
            onClick={() => {
              setFilterByTab("Password Generator");
            }}
          />
        </div>
      );
    };

    const RenderLimit = () => {
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
          <Button
            title="Search"
            variant="info"
            appendClasses="hidden lg:block"
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
          className={`mx-3 my-4 py-3 px-4 ${true && "bg-white shadow-sm"} hidden lg:flex lg:flex-row flex-col items-center  justify-between rounded-xl`}
        >
          <div>
            <RenderFilterTabs />
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
      <div className="lg:h-[83vh] h-[79dvh] px-3 pb-1 overflow-y-auto ">
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
