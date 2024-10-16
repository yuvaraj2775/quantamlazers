// ItemTable.js
import React from 'react';

import { EyeIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";

const Itemtable = ({ formdata, handleItemChange, handleAddRow, openDeleteDialog }) => {
  return (
    <div className="overflow-x-auto mt-5">
      <table className="border border-gray-300 custom-table">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-300 p-2">SL.NO</th>
            <th className="border border-gray-300 p-2">Item Name/Description</th>
            <th className="border border-gray-300 p-2">HSN Code</th>
            <th className="border border-gray-300 p-2 px-2 w-20">Qty</th>
            <th className="border border-gray-300 p-2">Unit</th>
            <th className="border border-gray-300 p-2 px-2 w-20">Unit Cost</th>
            <th className="border border-gray-300 p-2">Taxable Value</th>
            <th className="border border-gray-300 p-2">Type of Tax</th>
            <th className="border border-gray-300 p-2">%</th>
            <th className="border border-gray-300 p-2">Tax Amt</th>
            <th className="border border-gray-300 p-2">Type of Tax</th>
            <th className="border border-gray-300 p-2">%</th>
            <th className="border border-gray-300 p-2">Tax Amt</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {formdata?.items.map((item, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
              <td className="border border-gray-300 p-2">
                <input
                  type="text"
                  className="border capitalize border-gray-300 rounded-md w-52 h-10 px-2"
                  name="description"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, e)}
                />
              </td>
              <td className="border border-gray-300 p-2">
                <input
                  type="text"
                  className="border text-right border-gray-300 rounded-md w-20 h-10 px-2"
                  name="hsncode"
                  value={item.hsncode}
                  onChange={(e) => handleItemChange(index, e)}
                />
              </td>
              <td className="border border-gray-300 p-2">
                <input
                  type="number"
                  className="border px-2 text-right border-gray-300 w-24 rounded-md h-10"
                  name="qty"
                  value={item.qty}
                  onChange={(e) => handleItemChange(index, e)}
                />
              </td>
              <td className="border border-gray-300 p-2 w-16">
                <select
                  name="unit"
                  onChange={(e) => handleItemChange(index, e)}
                  value={item.unit}
                  className="border border-gray-300 rounded-md h-10 w-16"
                >
                  <option value="NOS">NOS</option>
                  <option value="EACH">EACH</option>
                  <option value="SET">SET</option>
                </select>
              </td>
              <td className="border border-gray-300 p-2">
                <input
                  type="number"
                  className="border text-right border-gray-300 rounded-md w-24 h-10 px-2"
                  name="unitCost"
                  value={item.unitCost}
                  onChange={(e) => handleItemChange(index, e)}
                />
              </td>
              <td className="border border-gray-300 p-2">
                <input
                  type="text"
                  className="border text-right border-gray-300 rounded-md w-full h-10 px-2"
                  name="taxableValue"
                  value={item.taxableValue}
                  readOnly
                />
              </td>
              <td className="border border-gray-300 p-2 w-16">
                <select
                  name="taxtype"
                  className="border border-gray-300 rounded-md h-10 w-16"
                  onChange={(e) => handleItemChange(index, e)}
                  value={item.taxtype}
                >
                  <option value="CGST">CGST</option>
                  <option value="IGST">IGST</option>
                </select>
              </td>
              <td className="border border-gray-300 p-2 w-10">
                <input
                  type="text"
                  className="border text-right border-gray-300 rounded-md w-10 h-10 px-2"
                  name="percentage"
                  value={item.percentage}
                  onChange={(e) => handleItemChange(index, e)}
                />
              </td>
              <td className="border border-gray-300 p-2 w-16">
                <input
                  type="text"
                  className="border text-right border-gray-300 rounded-md w-16 h-10 px-2"
                  name="taxamt"
                  value={item.taxamt}
                  readOnly
                />
              </td>
              <td className="border border-gray-300 p-2 w-16">
                <select
                  name="typeoftax"
                  onChange={(e) => handleItemChange(index, e)}
                  value={item.typeoftax}
                  className="border border-gray-300 rounded-md h-10 w-16"
                >
                  {item.taxtype === "CGST" ? (
                    <option value="SGST">SGST</option>
                  ) : (
                    <option value="UGST">UGST</option>
                  )}
                </select>
              </td>
              <td className="border border-gray-300 p-2 w-14">
                <input
                  type="text"
                  className="border text-right border-gray-300 rounded-md w-14 h-10 px-2"
                  name="percentage2"
                  value={item.percentage2}
                  onChange={(e) => handleItemChange(index, e)}
                />
              </td>
              <td className="border border-gray-300 p-2 w-14">
                <input
                  type="text"
                  className="border text-right border-gray-300 rounded-md w-14 h-10 px-2"
                  name="taxamt2"
                  value={item.taxamt2}
                  readOnly
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
                {index === 0 ? (
                  <button
                    type="button"
                    className="flex items-center justify-center w-8 h-8 text-gray-400 bg-gray-200 rounded-full"
                    title="First row cannot be deleted"
                    disabled
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => openDeleteDialog(index)}
                    className="flex items-center justify-center w-8 h-8 text-red-900 bg-red-100 rounded-full hover:bg-red-200 transition"
                    title="Delete Row"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                )}
              </td>
            </tr>
          ))}
          <tr>
            <td></td>
            <td className="w-[50%]">
              <label className="text-sm font-semibold">Total Number of Quantities:</label>
            </td>
            <td></td>
            <td className="text-right pr-8">
              <p>
                {formdata?.items.reduce(
                  (sum, item) => sum + (parseInt(item.qty) || 0),
                  0
                )}
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Itemtable;
