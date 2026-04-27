import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNotification } from "@/contexts/NotificationContext";
import { Menu, Search } from "lucide-react";
import { Dropdown } from "@/components/dropdown/Dropdown";
import Button from "@/components/buttons/Button";
import Table from "@/components/table/Table";
import { Modal } from "@/components/modal/Modal";
import FormInput from "@/components/form-input/FormInput";
import Tabs from "@/components/tabs/Tabs";
import API from "@/services/axios";
import authHeader from "@/services/auth-header";
import PsAddUpdate from "./PsAddUpdate";
import PsGenerator from "./PsGenerator";
import TableLoader from "@/components/table-loader/TableLoader";

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

export default function Password() {
  /* ========================= All States ========================= */
  const [limit, setLimit] = useState(10);
  const { notify } = useNotification();

  const [searchBy, setSearchBy] = useState(null);

  const [loading, setLoading] = useState(true);

  // Modal States
  const [showAddUpdateModal, setShowAddUpdateModal] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [currentRowData, setCurrentRowData] = useState(null);

  /*  ========================= All Functions ========================= */

  const [tableData, setTableData] = useState([]);

  const [filterByTab, setFilterByTab] = useState("Company");

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
  };

  const getPasswords = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await API.post(
        "/sales/passwords",
        { type: getPasswordType(filterByTab) },
        { headers: authHeader() },
      );
      if (data?.success) {
        setTableData(data.data);
      } else {
        notify(data.message || "Failed to fetch passwords", "error", 3000);
      }
      setLoading(false);
    } catch (err) {
      console.log(err.message);
      setLoading(false);
      notify(err.message, "error", 5000);
    }
  }, [filterByTab]);

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
            title="Customer Portal"
            appendClasses={`rounded-none border-x-0 ${filterByTab === "Customer Portal" ? activeTabClass : inactiveTabClass} ${commonTabClasses} `}
            onClick={() => {
              setFilterByTab("Customer Portal");
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

    // const RenderFilterByLocation = () => {
    //   return (
    //     <Dropdown
    //       value={selectedLocation}
    //       onChange={(value) => setSelectedLocation(value)}
    //     >
    //       <Dropdown.Trigger
    //         appendClass={"!border-primary !border-1 !bg-primary/10"}
    //         // renderIcon={false}
    //       >
    //         Filter By : {selectedLocation?.locationName || "All Locations"}
    //       </Dropdown.Trigger>
    //       <Dropdown.Menu>
    //         <Dropdown.Item value={{ id: 9999999, locationName: "no-location" }}>
    //           Without Location
    //         </Dropdown.Item>
    //         {locationsList.map((location) => (
    //           <Dropdown.Item
    //             key={location.id}
    //             value={location.id}
    //             onClick={() => setSelectedLocation(location)}
    //           >
    //             {location.locationName}
    //           </Dropdown.Item>
    //         ))}
    //       </Dropdown.Menu>
    //     </Dropdown>
    //   );
    // };

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
                {/* <RenderFilterByLocation /> */}
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

  const tableHeaders = [
    {
      id: "ps_title",
      label: "Title",
      sortBy: "ps_title",
      customHClasses: "",
      customRClasses: "",
      render: (row) => <span className="text-nowrap">{row.ps_title}</span>,
    },
    {
      id: "ps_username",
      label: "Username",
      sortBy: "ps_username",
      render: (row) => row.ps_username,
    },
    {
      id: "ps_passwordValue",
      label: "Password",
      sortBy: "ps_passwordValue",
      render: (row) => row.ps_passwordValue,
    },
    {
      id: "ps_url",
      label: "URL",
      sortBy: "ps_url",
      render: (row) => row.ps_url,
    },
    {
      id: "updatedAt",
      label: "Last Updated",
      sortBy: "updatedAt",
      render: (row) => row.updatedAt,
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
  }, [filterByTab]);

  return (
    <div className="">
      {/*=======================================
            Top Action Row    
        ========================================= */}
      <ActionItems />

      {/*=======================================
          Table Section    
      ========================================= */}
      {filterByTab === "Password Generator" ? (
        <div className="lg:h-[83vh] h-[79dvh] px-3 pb-1  overflow-y-auto ">
          <div>
            {/* <div className="bg-white rounded-md py-3 px-3 h-full"> */}
            <PsGenerator />
          </div>
        </div>
      ) : (
        <div className="lg:h-[83vh] h-[79dvh] px-3 pb-1 overflow-y-auto ">
          {loading ? (
            <TableLoader headers={tableHeaders} limit={limit} />
          ) : !tableData || tableData.length === 0 ? (
            <div className="bg-white rounded-md h-full flex-center">
              <div className="text-center text-3xl animate-pulse py-4">
                No passwords found!
              </div>
            </div>
          ) : (
            <Table
              headers={tableHeaders}
              data={tableData}
              handleSortBy={handleSortBy}
              onClick={() => {
                notify("Table row clicked", "info", 3000);
              }}
              onDoubleClick={() => {
                notify("Table row double-clicked", "success", 3000);
              }}
            />
          )}
        </div>
      )}

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
        />
      </Modal>
    </div>
  );
}
