"use client"
import React from 'react';
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";

const ItemRow = ({ item, index, handleRowChange, handleAddRow, openDeleteDialog }) => {
  return (
    <tr className="border-b">
      <td className="p-2 border-2 w-10 border-r-gray-300">{index + 1}</td>
      <td className="border-r-gray-300 border-2 px-2">
        <input
          type="text"
          name="name"
          value={item.name}
          onChange={(e) => handleRowChange(index, e)}
          placeholder="Name"
          className="w-64 border h-10 border-r-gray-300 rounded p-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
        />
      </td>
      <td className="border-r-gray-300 border-2 px-1">
        <input
          type="text"
          name="hsn"
          value={item.hsn}
          onChange={(e) => handleRowChange(index, e)}
          placeholder="HSN"
          className="w-28 border rounded p-1 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
        />
      </td>
      <td className="border-r-gray-300 border-2 px-2">
        <input
          type="number"
          name="qty"
          value={item.qty}
          onChange={(e) => handleRowChange(index, e)}
          placeholder="Qty"
          className="w-20 text-right border rounded p-1 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
        />
      </td>
      <td className="border-r-gray-300 border-2 px-2">
        <select 
          name="umoremarks" 
          value={item.umoremarks} 
          onChange={(e) => handleRowChange(index, e)}
          className="border rounded p-1 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
        >
          <option value="NOS">NOS</option>
          <option value="EACH">EACH</option>
          <option value="SET">SET</option>
        </select>
      </td>
      <td className="border-r-gray-300 border-2 px-2">
        <textarea
          name="remarks"
          value={item.remarks}
          onChange={(e) => handleRowChange(index, e)}
          placeholder="Remarks"
          className="w-[230px] border h-14 rounded p-1 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
        />
      </td>
      <td className="flex justify-center items-center mt-3 border-gray-300 space-x-2 px-2">
        <button
          type="button"
          onClick={handleAddRow}
          className="flex items-center justify-center w-8 h-8 text-green-700 bg-green-100 rounded-full hover:bg-green-200 transition"
          title="Add Row"
        >
          <PlusIcon className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => openDeleteDialog(index)}
          className="flex items-center justify-center w-8 h-8 text-red-900 bg-red-100 rounded-full hover:bg-red-200 transition"
          title="Delete Row"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </td>
    </tr>
  )
}
export default ItemRow