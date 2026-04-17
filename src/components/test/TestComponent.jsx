import React, { useState } from "react";
import Button from "../buttons/Button";
import Table from "../table/Table";
import { useNotification } from "@/contexts/NotificationContext";
import { Dropdown } from "../dropdown/Dropdown";

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

  /*  ========================= All Functions ========================= */

  /* ========================= All UseEffects ========================= */
  const { notify } = useNotification();

  const [tableData, setTableData] = useState([
    {
      name: "Bob",
      age: 25,
      email: "bob@example.com",
      phone: "123-456-7890",
      address: "123 Main St",
      company: "Acme Inc",
      department: "Sales",
    },
    {
      name: "Alice",
      age: 30,
      email: "alice@example.com",
      phone: "987-654-3210",
      address: "456 Elm St",
      company: "Globex Corp",
      department: "Marketing",
    },
    {
      name: "Charlie",
      age: 35,
      email: "charlie@example.com",
      phone: "555-555-5555",
      address: "789 Oak St",
      company: "Initech",
      department: "Engineering",
    },
    {
      name: "David",
      age: 40,
      email: "david@example.com",
      phone: "444-444-4444",
      address: "101 Pine St",
      company: "Hooli",
      department: "Finance",
    },
    {
      name: "Eve",
      age: 28,
      email: "eve@example.com",
      phone: "333-333-3333",
      address: "202 Maple St",
      company: "Umbrella Corp",
      department: "Research",
    },
    {
      name: "Frank",
      age: 32,
      email: "frank@example.com",
      phone: "222-222-2222",
      address: "303 Birch St",
      company: "Stark Industries",
      department: "Development",
    },
  ]);

  const handleSortBy = (sortColumn, sortDirection) => {
    const sortedData = [...tableData].sort((a, b) => {
      if (a[sortColumn] < b[sortColumn])
        return sortDirection === "asc" ? -1 : 1;
      if (a[sortColumn] > b[sortColumn])
        return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    setTableData(sortedData);
  };

  const headers = [
    {
      id: "name",
      label: "Name",
      sortBy: "name",
      customHClasses: "w-32",
      customRClasses: "w-32",
      render: (row) => row.name,
    },
    {
      id: "age",
      label: "Age",
      customHClasses: "w-16",
      customRClasses: "w-16",
      sortBy: "age",
      render: (row) => row.age,
    },
    {
      id: "email",
      label: "Email",
      sortBy: "email",
      render: (row) => row.email,
    },
    {
      id: "phone",
      label: "Phone",
      sortBy: "phone",
      render: (row) => row.phone || "N/A",
    },
    {
      id: "status",
      label: "Status",
      sortBy: "age",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            row.age < 30
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.age < 30 ? "Young" : "Old"}
        </span>
      ),
    },
    {
      id: "address",
      label: "Address",
      sortBy: "address",
      render: (row) => row.address || "N/A",
    },
    {
      id: "company",
      label: "Company",
      sortBy: "company",
      render: (row) => row.company || "N/A",
    },
    {
      id: "department",
      label: "Department",
      sortBy: "department",
      render: (row) => row.department || "N/A",
    },

    {
      id: "actions",
      label: "Actions",
      sortBy: false,
      render: (row) => <Button title="Edit" variant="primary" size="sm" />,
    },
  ];

  return (
    <>
      <div
        className={`py-2 px-4 mb-3 ${true && "bg-white shadow-sm"}  flex items-center  justify-between rounded-xl`}
      >
        <div className="flex items-center  gap-2">
          Show
          <Dropdown value={limit} onChange={(v) => setLimit(v)}>
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
        <div>
          <div className="flex items-center gap-5">
            {/* Filter By Locations */}
            <Dropdown
              value={selectedLocation}
              onChange={(value) => setSelectedLocation(value)}
            >
              <Dropdown.Trigger
                appendClass={"!border-primary !border-1 !bg-primary/10"}
                renderIcon={false}
              >
                Filter By : {selectedLocation?.locationName || "All Locations"}
              </Dropdown.Trigger>
              <Dropdown.Menu>
                <Dropdown.Item
                  value={{ id: 9999999, locationName: "no-location" }}
                >
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

            {/* Search */}
            <form className="flex items-center gap-2">
              {/* Search By Filters */}
              <Dropdown
                value={searchBy}
                onChange={(value) => setSearchBy(value)}
              >
                <Dropdown.Trigger
                  appendClass={"!border-info !border-1 !bg-info/10"}
                >
                  Search By : {searchBy || "All"}
                </Dropdown.Trigger>
                <Dropdown.Menu>
                  {headers
                    .filter((header) => header.sortBy)
                    .map((header) => (
                      <Dropdown.Item key={header.id} value={header.id}>
                        {header.label}
                      </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
              </Dropdown>
              <input
                type="text"
                placeholder="Search..."
                className="form-control !w-96"
              />
              <Button title="Search" variant="info" />
            </form>
            {/* Add New Entry */}
            <Button title="Add New" />
          </div>
        </div>
      </div>
      <div className="h-[84dvh] pb-1 pr-1 overflow-y-auto ">
        <Table
          headers={headers}
          data={tableData}
          handleSortBy={handleSortBy}
          onClick={() => {
            notify("Table row clicked", "info", 3000);
          }}
          onDoubleClick={() => {
            notify("Table row double-clicked", "success", 3000);
          }}
        />
      </div>
    </>
  );
}
