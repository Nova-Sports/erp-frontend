import React from "react";

export default function Table({ headers, data }) {
  return (
    <table>
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header.id}>{header.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            {headers.map((header) => (
              <td key={header.id}>{header.render(row)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
