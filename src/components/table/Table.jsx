import { ArrowDown, ArrowUp, EllipsisVertical, Menu } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Dropdown } from "../dropdown/Dropdown";
import FormInput from "../form-input/FormInput";

export default function Table({
  headers,
  data,
  onClick,
  onDoubleClick,
  handleSortBy,
}) {
  /* ========================= All States ========================= */
  const [searchParams, setSearchParams] = useSearchParams();

  const [sortBy, setSortBy] = useState({
    sortBy: null,
    sortDirection: "asc",
  });

  const [tableData, setTableData] = useState([]);
  const [tableColumnsList, setTableColumnsList] = useState([]);

  /*  ========================= All Functions ========================= */

  const _handleSortBy = (sortColumn) => {
    let sortDirection = "asc";
    if (sortColumn === sortBy.sortBy) {
      sortDirection = sortBy.sortDirection === "asc" ? "desc" : "asc";
    }
    setSearchParams({ "sort-by": sortColumn, "sort-direction": sortDirection });
    handleSortBy && handleSortBy(sortColumn, sortDirection);
  };

  const handleEnableChange = (column) => {
    const updatedColumns = tableColumnsList.map((col) =>
      col.label === column.label ? { ...col, enabled: !col.enabled } : col,
    );

    setTableColumnsList(updatedColumns);

    let enabledColumns = headers.filter((header) =>
      updatedColumns.find((col) => col.label === header.label && col.enabled),
    );

    // get action column from headers and add it to enabled columns if not already there
    const actionColumn = headers.find((header) => header.id === "actions");
    if (actionColumn && !enabledColumns.includes(actionColumn.label)) {
      enabledColumns.push(actionColumn);
    }

    setTableData(enabledColumns);
  };

  /* ========================= All UseEffects ========================= */

  useEffect(() => {
    // get sort-by and sort-direction from url
    let sortBy = searchParams.get("sort-by") || null;
    let sortDirection = searchParams.get("sort-direction") || null;
    setSortBy({ sortBy, sortDirection });
  }, [searchParams]);

  useEffect(() => {
    setTableData((prev) => headers);
    let filteredColumns = headers?.filter((header) => header.id !== "actions");

    setTableColumnsList(
      filteredColumns?.map((header) => ({
        label: header.label,
        enabled: true,
      })) || [],
    );
  }, [headers, data]);

  return (
    <div className="relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-xl max-md:overflow-x-auto">
      <table className="w-full md:table-fixed">
        <thead>
          <tr>
            {tableData?.map((header) => (
              <th
                onClick={() => {
                  header.sortBy && _handleSortBy(header.sortBy);
                }}
                className={[
                  "px-4 py-2 border-b border-blue-gray-50 bg-blue-gray-50",
                  header.id === "actions" ? "text-end" : "text-left",
                  header.customHClasses || "",
                  header.sortBy ? "cursor-pointer" : "",
                ].join(" ")}
                key={header.id}
              >
                {/*=======================================
                    Render Columns With Sort Functions    
                ========================================= */}
                {header.sortBy && sortBy.sortBy === header.sortBy ? (
                  <div className="flex items-center gap-1">
                    {header.label}
                    <span>
                      {sortBy.sortDirection === "asc" ? (
                        <ArrowUp size={15} />
                      ) : (
                        <ArrowDown size={15} />
                      )}
                    </span>
                  </div>
                ) : /*=======================================
                    Render Column Select for Table    
                ========================================= */
                header.id === "actions" ? (
                  <div className="flex items-center justify-end">
                    <div>{header.label}</div>
                    <Dropdown onChange={() => {}} autoCloseOnChange={false}>
                      <Dropdown.Trigger
                        appendClass={"border-0"}
                        renderIcon={false}
                      >
                        <EllipsisVertical size={18} />
                      </Dropdown.Trigger>
                      <Dropdown.Menu>
                        <h4 className="text-sm text-center py-2 px-2">
                          Toggle Columns
                        </h4>
                        <hr />
                        {tableColumnsList?.map((column) => {
                          // if (column.label === "Actions") return null;
                          return (
                            <Dropdown.Item
                              key={column.label}
                              appendClass={"py-0"}
                              value={column}
                            >
                              <div className="flex items-center gap-2">
                                <div className="mb-0">
                                  <FormInput
                                    onChange={(e) => {
                                      handleEnableChange(column);
                                    }}
                                    labelTrue={"Show"}
                                    labelFalse={"Hide"}
                                    type="checkbox"
                                    value={column.enabled}
                                    id={`checkbox-${column.label}`}
                                  />
                                </div>
                                <label
                                  htmlFor={`checkbox-${column.label}`}
                                  className="mb-1 w-full cursor-pointer select-none text-sm py-2"
                                >
                                  {column.label}
                                </label>
                              </div>
                            </Dropdown.Item>
                          );
                        })}
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                ) : (
                  <>
                    {/*=======================================
                    Render Column Label for Table 
                  ========================================= */}
                    {header.label}
                  </>
                )}
              </th>
            ))}
          </tr>
        </thead>
        {/*=======================================
            Render Table Row    
        ========================================= */}
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              onClick={() => onClick && onClick(row)}
              onDoubleClick={() => onDoubleClick && onDoubleClick(row)}
              className="hover:bg-primary-light transition-colors duration-150"
            >
              {tableData?.map((header) => (
                <td
                  className={[
                    "px-4 py-2 border-b  border-blue-gray-50 md:truncate",
                    header.id === "actions" ? "text-end" : "text-left",
                    header.customRClasses || "",
                  ].join(" ")}
                  key={header.id}
                >
                  {header.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
