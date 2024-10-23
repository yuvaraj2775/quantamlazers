"use client"
import React, { useState } from "react";

const SimpleTable = () => {
  const [items] = useState([
    { id: 1, name: "Item 1", description: "Description 1", quantity: 10, enabled: true },
    { id: 2, name: "Item 2", description: "Description 2", quantity: 20, enabled: false },
    { id: 3, name: "Item 3", description: "Description 3", quantity: 30, enabled: true },
  ]);

  const downloadCSV = () => {
    const headers = ["ID", "Name", "Description", "Quantity", "Enabled"];
    const csvRows = [];

    // Add headers
    csvRows.push(headers.join(","));

    // Add data rows
    items.forEach(item => {
      const row = [
        item.id,
        item.name,
        item.description,
        item.quantity,
        item.enabled ? "Yes" : "No"
      ];
      csvRows.push(row.join(","));
    });

    // Create a CSV blob
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/pdf" });
    const url = URL.createObjectURL(blob);

    // Create a link to download the CSV file
    const a = document.createElement("a");
    a.href = url;
    a.download = "items.pdf"; // Name of the file
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Cleanup
  };

  return (
    <div>
      <h1>Simple Item Table</h1>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Enabled</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>{item.quantity}</td>
              <td>{item.enabled ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={downloadCSV} style={{ marginTop: "10px", padding: "5px 10px" }}>
        Download CSV
      </button>
    </div>
  );
};

export default SimpleTable;
