"use client"
import React, { useState } from 'react';

const TableComponent = () => {
  // Initialize state with an array of objects representing table rows
  const [data, setData] = useState([
    { id: 1, name: 'Item 1', value: 'Value 1' },
    { id: 2, name: 'Item 2', value: 'Value 2' },
    { id: 3, name: 'Item 3', value: 'Value 3' },
  ]);

  // State to manage form inputs for adding a new row
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    value: '',
    index: data.length, // Default to the end of the table
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleAddRow = (e) => {
    e.preventDefault();
    const { id, name, value, index } = formData;
    if (id && name && value && index >= 0 && index <= data.length) {
      const newRow = {
        id: parseInt(id), // Convert id to a number
        name,
        value,
      };

      setData(prevData => {
        const newData = [...prevData];
        newData.splice(parseInt(index), 0, newRow); // Insert the new row at the specified index
        return newData;
      });
      setFormData({ id: '', name: '', value: '', index: data.length }); // Clear form and reset index to end
    } else {
      alert('Please fill in all fields and ensure index is valid');
    }
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Value</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.value}</td>
              <td>
                {/* Add any actions here if needed */}
              </td>
            </tr>
          ))}
          {/* Row for adding new data */}
          <tr>
            <td>
              <input
                type="number"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                placeholder="ID"
                required
              />
            </td>
            <td>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Name"
                required
              />
            </td>
            <td>
              <input
                type="text"
                name="value"
                value={formData.value}
                onChange={handleInputChange}
                placeholder="Value"
                required
              />
            </td>
            <td>
              <input
                type="number"
                name="index"
                value={formData.index}
                onChange={handleInputChange}
                placeholder="Index"
                min="0"
                max={data.length}
                required
              />
            </td>
            <td>
              <button onClick={handleAddRow}>Add</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;