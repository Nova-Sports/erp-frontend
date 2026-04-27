import React, { useState } from "react";

export default function TableLoader({ headers, limit = 10 }) {
  const data = [...Array(limit).keys()];

  return (
    <div
      className={`relative flex flex-col w-full h-full text-gray-700 bg-white overflow-y-auto shadow-lg py-3 px-3 rounded-xl max-md:overflow-x-auto `}
    >
      <table className="w-full table-auto">
        <thead className="">
          <tr className="bg-primary/15 text-primary">
            {headers?.map((header, index) => (
              <th
                className={[
                  "px-4 py-3 text-nowrap",
                  index === 0 ? "rounded-l-xl" : "",
                  index === headers.length - 1 ? "rounded-r-xl" : "",
                  header.id === "actions" ? "text-end" : "text-left",
                ].join(" ")}
                key={header.id}
              >
                {/*=======================================
                    Render Columns With Sort Functions    
                ========================================= */}

                <>
                  {/*=======================================
                    Render Column Label for Table 
                  ========================================= */}
                  {header.label}
                </>
              </th>
            ))}
          </tr>
        </thead>
        {/*=======================================
            Render Table Row    
        ========================================= */}
        <tbody>
          {data.map((_, rowIndex) => (
            <tr key={rowIndex}>
              {headers?.map((header) => (
                <td key={header.id} className="px-1 py-3">
                  <div className="h-4 rounded w-full flash-loading"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
