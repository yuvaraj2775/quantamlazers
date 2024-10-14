"use client";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";

const Page = () => {
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [input, setInput] = useState({
    Address: "",
    Date: "",
    gstnumber: "",
    kindattention: "",
    reference: "",
    subject: "",
    discount: "",
    transport: "",
    packages: "",
    othercost: "",
  });
  const [fetched, setfetched] = useState(null);
  const [items, setItems] = useState([
    {
      description: "",
      hsncode: "",
      qty: "",
      unit: "NOS",
      unitCost: "",
      taxableValue: "",
      taxtype: "CGST",
      percentage: "9",
      taxamt: "",
      typeoftax: "SGST",
      percentage2: "9",
      taxamt2: "",
    },
  ]);
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };
  console.log("fn", fetched);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/quatation");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        console.log("Fetched Data:", result);
        setfetched(result);
      } catch (error) {
        console.error("Fetch failed:", error);
      }
    };

    fetchData();
  }, []);

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...items];
    newItems[index][name] = value;

    // Reset tax amounts when changing tax types
    if (name === "taxtype") {
      newItems[index].taxamt = "0.00"; // Reset CGST amount
      newItems[index].taxamt2 = "0.00"; // Reset SGST/IGST/UGST amount

      if (value === "CGST") {
        newItems[index].percentage = "9";
        newItems[index].percentage2 = "9"; // SGST percentage
        newItems[index].taxamt = (
          (parseFloat(newItems[index].taxableValue) * 9) /
          100
        ).toFixed(2); // Calculate CGST tax amount
      } else if (value === "IGST") {
        newItems[index].percentage = "18";
        newItems[index].percentage2 = "0"; // No SGST
        newItems[index].taxamt = "0.00"; // CGST amount
        newItems[index].taxamt2 = (
          (parseFloat(newItems[index].taxableValue) * 18) /
          100
        ).toFixed(2); // Calculate IGST tax amount
      } else if (value === "UGST") {
        newItems[index].percentage = "0"; // Assuming UGST has its percentage
        newItems[index].percentage2 = "18"; // UGST percentage
        newItems[index].taxamt = "0.00"; // CGST amount
        newItems[index].taxamt2 = (
          (parseFloat(newItems[index].taxableValue) * 18) /
          100
        ).toFixed(2); // Calculate UGST tax amount
      }
    }

    // Update quantities and unit costs to recalculate taxable values and tax amounts
    if (name === "qty" || name === "unitCost") {
      const qty = parseFloat(newItems[index].qty) || 0;
      const unitCost = parseFloat(newItems[index].unitCost) || 0;
      newItems[index].taxableValue = (qty * unitCost).toFixed(2);
    }

    // Calculate tax amounts based on the current taxable value
    const taxableValue = parseFloat(newItems[index].taxableValue) || 0;
    const cgstPercentage = parseFloat(newItems[index].percentage) || 0;
    const sgstPercentage = parseFloat(newItems[index].percentage2) || 0;

    // Recalculate tax amounts based on selected tax type
    if (newItems[index].taxtype === "CGST") {
      newItems[index].taxamt = ((taxableValue * cgstPercentage) / 100).toFixed(
        2
      );
      newItems[index].taxamt2 = ((taxableValue * sgstPercentage) / 100).toFixed(
        2
      ); // SGST
    } else if (newItems[index].taxtype === "IGST") {
      newItems[index].taxamt = "0.00"; // CGST to zero
      newItems[index].taxamt2 = (
        (taxableValue * (cgstPercentage + sgstPercentage)) /
        100
      ).toFixed(2);
    } else if (newItems[index].taxtype === "UGST") {
      newItems[index].taxamt = "0.00"; // CGST to zero
      newItems[index].taxamt2 = ((taxableValue * sgstPercentage) / 100).toFixed(
        2
      ); // Calculate UGST tax amount
    }

    setItems(newItems);
  };

  const handleAddRow = () => {
    setItems((prevItems) => [
      ...prevItems,
      {
        description: "",
        hsncode: "",
        qty: "",
        unit: "NOS",
        unitCost: "",
        taxableValue: "",
        taxtype: "CGST",
        percentage: "9",
        taxamt: "",
        typeoftax: "SGST",
        percentage2: "9",
        taxamt2: "",
      },
    ]);
  };

  const openDeleteDialog = (index) => {
    setRowToDelete(index);
    setDeleteDialogOpen(true);
  };

  const onDelete = () => {
    if (rowToDelete !== null) {
      handleDeleteRow(rowToDelete);
    }
  };
  const handleDeleteRow = (index) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
    setDeleteDialogOpen(false);
    setRowToDelete(null);
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setRowToDelete(null);
  };

  const calculateTotals = () => {
    const subTotal = items.reduce(
      (sum, item) => sum + parseFloat(item.taxableValue || 0),
      0
    );
  
    const totalTax = items.reduce(
      (sum, item) =>
        sum + (parseFloat(item.taxamt || 0) + parseFloat(item.taxamt2 || 0)),
      0
    );
  
    const discountAmount = subTotal * (input.discount / 100);
    const packageCharges = parseFloat(input.packages || 0);
    const transportCharges = parseFloat(input.transport || 0);
    const otherCosts = parseFloat(input.othercost || 0);
  
    const grandTotal =
      subTotal +
      totalTax -
      discountAmount +
      packageCharges +
      transportCharges +
      otherCosts;
  
    return {
      subTotal,
      totalTax,
      discountAmount,
      grandTotal,
      otherCosts,
      transportCharges,
      packageCharges,
    };
  };
  

  const dataed = fetched?.data.length ? fetched.data[0].id + 1 : null;
  console.log(dataed, "jnj");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Ensure `dataed` is defined

    const response = await fetch("/api/quatation", {
      method: "POST",
      body: JSON.stringify({ ...input, items }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    if (!response.ok) {
      console.error("Error while submitting:", result.error);
    } else {
      console.log("Data added", result);
      setOpen(true); // Open the dialog on success
      // Reset input and items as needed
    }
  };
  const totals = calculateTotals();

  return (
    <form
      onSubmit={handleSubmit}
      className=" overflow-y-auto h-screen p-6 bg-white rounded-lg shadow-md"
    >
      <div className="flex justify-between mb-4">
        <h1></h1>
        <h1 className="text-xl  font-bold">Quotation Form</h1>
        <h2 className="text-lg">Quotation NO: Draft</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="Address"
            className="block mb-1 text-sm font-semibold "
          >
            Address
          </label>
          <textarea
            name="Address"
            value={input.Address}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md w-full h-32 px-2 py-1 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="Date"
                className="block mb-1 text-sm  font-semibold "
              >
                Date
              </label>
              <input
                type="date"
                className="border border-gray-300 rounded-md w-full h-10 px-2"
                name="Date"
                value={input.Date}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label
                htmlFor="reference"
                className="block mb-1 text-sm  font-semibold"
              >
                Reference Number
              </label>
              <input
                type="text"
                className="border border-gray-300 rounded-md w-full h-10 px-2"
                name="reference"
                value={input.reference}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="gstnumber"
                className="block mb-1 text-sm  font-semibold"
              >
                GST Number
              </label>
              <input
                type="text"
                className="border border-gray-300 rounded-md w-full h-10 px-2"
                name="gstnumber"
                value={input.gstnumber}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label
                htmlFor="kindattention"
                className="block mb-1 text-sm  font-semibold"
              >
                Kind Attention
              </label>
              <input
                type="text"
                className="border border-gray-300 rounded-md w-full h-10 px-2"
                name="kindattention"
                value={input.kindattention}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <label htmlFor="subject" className="block mb-1 text-sm  font-semibold">
          Subject
        </label>
        <input
          type="text"
          className="border border-gray-300 rounded-md w-full h-10 px-2"
          name="subject"
          value={input.subject}
          onChange={handleInputChange}
        />
      </div>

      <div className="overflow-x-auto mt-5">
        <table className="border border-gray-300 custom-table">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 p-2">SL.NO</th>
              <th className="border border-gray-300 p-2">
                Item Name/Description
              </th>
              <th className="border border-gray-300 p-2">HSN Code</th>
              <th className="border border-gray-300 p-2">Qty</th>
              <th className="border border-gray-300 p-2">Unit</th>
              <th className="border border-gray-300 p-2">Unit Cost</th>
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
            {items.map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="border border-gray-300 p-2 text-center">
                  {index + 1}
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md w-full h-10 px-2"
                    name="description"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, e)}
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md w-full h-10 px-2"
                    name="hsncode"
                    value={item.hsncode}
                    onChange={(e) => handleItemChange(index, e)}
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="number"
                    className="border border-gray-300 rounded-md w-full h-10 px-2"
                    name="qty"
                    value={item.qty}
                    onChange={(e) => handleItemChange(index, e)}
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <select
                    name="unit"
                    onChange={(e) => handleItemChange(index, e)}
                    value={item.unit}
                    className="border border-gray-300 rounded-md h-10 w-full"
                  >
                    <option value="NOS">NOS</option>
                    <option value="EACH">EACH</option>
                    <option value="SET">SET</option>
                  </select>
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="number"
                    className="border border-gray-300 rounded-md w-full h-10 px-2"
                    name="unitCost"
                    value={item.unitCost}
                    onChange={(e) => handleItemChange(index, e)}
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md w-full h-10 px-2"
                    name="taxableValue"
                    value={item.taxableValue}
                    readOnly
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <select
                    name="taxtype"
                    className="border border-gray-300 rounded-md h-10 w-full"
                    onChange={(e) => handleItemChange(index, e)}
                    value={item.taxtype}
                  >
                    <option value="CGST">CGST</option>
                    <option value="IGST">IGST</option>
                  </select>
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md w-full h-10 px-2"
                    name="percentage"
                    value={item.percentage}
                    onChange={(e) => handleItemChange(index, e)}
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md w-full h-10 px-2"
                    name="taxamt"
                    value={item.taxamt}
                    readOnly
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <select
                    name="typeoftax"
                    onChange={(e) => handleItemChange(index, e)}
                    value={item.typeoftax}
                    className="border border-gray-300 rounded-md h-10 w-full"
                  >
                    {item.taxtype === "CGST" ? (
                      <option value="SGST">SGST</option>
                    ) : (
                      <option value="UGST">UGST</option>
                    )}
                  </select>
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md w-full h-10 px-2"
                    name="percentage2"
                    value={item.percentage2}
                    onChange={(e) => handleItemChange(index, e)}
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md w-full h-10 px-2"
                    name="taxamt2"
                    value={item.taxamt2}
                    readOnly
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <div className="flex justify-center">
                    <button className="" onClick={handleAddRow}>
                      <PlusIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => openDeleteDialog(index)}>
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4">
          <label className="text-sm font-semibold">
            Total Number of Quantities:
          </label>
          <p>
            {items.reduce((sum, item) => sum + (parseInt(item.qty) || 0), 0)}
          </p>
        </div>
      </div>

      {/* Additional Costs Section */}
      <div className="grid grid-cols-4 gap-4 mt-5">
        <div>
          <label className="text-sm  font-semibold">Discount Amount (%)</label>
          <input
            type="number"
            name="discount"
            value={input.discount}
            onChange={handleInputChange}
            className="border border-gray-300 h-10 rounded-md w-full px-2"
          />
        </div>
        <div>
          <label className="text-sm  font-semibold">Package Charges</label>
          <input
            type="number"
            name="packages"
            value={input.packages}
            onChange={handleInputChange}
            className="border border-gray-300 h-10 rounded-md w-full px-2"
          />
        </div>
        <div>
          <label className="text-sm  font-semibold">
            Transportation Charges
          </label>
          <input
            type="number"
            name="transport"
            value={input.transport}
            onChange={handleInputChange}
            className="border border-gray-300 h-10 rounded-md w-full px-2"
          />
        </div>
        <div>
          <label className="text-sm  font-semibold">Other Cost</label>
          <input
            type="number"
            name="othercost"
            value={input.othercost}
            onChange={handleInputChange}
            className="border border-gray-300 h-10 rounded-md w-full px-2"
          />
        </div>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-2 gap-4 mt-5">
  <div>
    <div>
      <span className="text-sm font-semibold">Grand Total (In Words)</span>
      <p>{/* Placeholder for grand total in words */}</p>
    </div>
    <div>
      <span className="text-sm font-semibold">Tax Amount</span>
      <div className="grid grid-cols-2">
        <div>
          <label>CGST:</label>
          <p>{(totals.totalTax > 0 && items.some(item => item.taxtype === "CGST")) ? (totals.totalTax / 2).toFixed(2) : "0.00"}</p>
        </div>
        <div>
          <label>IGST:</label>
          <p>{(totals.totalTax > 0 && items.every(item => item.taxtype === "IGST")) ? totals.totalTax.toFixed(2) : "0.00"}</p>
        </div>
      </div>
      <div className="grid grid-cols-2">
        <div>
          <label>SGST:</label>
          <p>{(totals.totalTax > 0 && items.some(item => item.taxtype === "CGST")) ? (totals.totalTax / 2).toFixed(2) : "0.00"}</p>
        </div>
        <div>
          <label>UGST:</label>
          <p>{(totals.totalTax > 0 && items.every(item => item.taxtype === "UGST")) ? totals.totalTax.toFixed(2) : "0.00"}</p>
        </div>
      </div>
    </div>
  </div>
  <div>
    <div className="grid grid-cols-2">
      <p>Sub-Total Amt</p>
      <p>{totals.subTotal.toFixed(2)}</p>
    </div>
    <div className="grid grid-cols-2">
      <p>Discount ({input.discount} %)</p>
      <p>{totals.discountAmount.toFixed(2)}</p>
    </div>
    <div className="grid grid-cols-2">
      <p>CGST</p>
      <p>{(totals.totalTax > 0 && items.some(item => item.taxtype === "CGST")) ? (totals.totalTax / 2).toFixed(2) : "0.00"}</p>
    </div>
    <div className="grid grid-cols-2">
      <p>SGST</p>
      <p>{(totals.totalTax > 0 && items.some(item => item.taxtype === "CGST")) ? (totals.totalTax / 2).toFixed(2) : "0.00"}</p>
    </div>
    <div className="grid grid-cols-2">
      <p>IGST</p>
      <p>{(totals.totalTax > 0 && items.every(item => item.taxtype === "IGST")) ? totals.totalTax.toFixed(2) : "0.00"}</p>
    </div>
    <div className="grid grid-cols-2">
      <p>UGST</p>
      <p>{(totals.totalTax > 0 && items.every(item => item.taxtype === "UGST")) ? totals.totalTax.toFixed(2) : "0.00"}</p>
    </div>
    <div className="grid grid-cols-2">
      <p>Package Charges</p>
      <p>{input.packages}</p>
    </div>
    <div className="grid grid-cols-2">
      <p>Transportation Charges</p>
      <p>{input.transport}</p>
    </div>
    <div className="grid grid-cols-2">
      <p>Other Cost</p>
      <p>{input.othercost}</p>
    </div>
    <div className="grid grid-cols-2">
      <p>Grand Total (RS)</p>
      <p>{totals.grandTotal.toFixed(2)}</p>
    </div>
  </div>
</div>


      {/* Payment Terms Section */}
      <div className="mt-5">
        <h1 className="text-sm  font-semibold">Payment Terms</h1>
        <div className="border border-gray-300 p-4">
          <input
            type="text"
            placeholder="Enter Payment Term 1"
            className="border border-gray-300 rounded-md w-full mb-2 h-10 px-2"
          />
          <input
            type="text"
            placeholder="Enter Payment Term 2"
            className="border border-gray-300 rounded-md w-full mb-2 h-10 px-2"
          />
          <input
            type="text"
            placeholder="Enter Payment Term 3"
            className="border border-gray-300 rounded-md w-full mb-2 h-10 px-2"
          />
          <input
            type="text"
            placeholder="Enter Payment Term 4"
            className="border border-gray-300 rounded-md w-full mb-2 h-10 px-2"
          />
        </div>
      </div>
      <div className="mt-5 flex justify-center">
        <button
          type="submit"
          className="bg-blue-600 r text-white rounded-md px-4 py-2"
        >
          Save
        </button>
      </div>

      {/* Dialog Component */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className="relative z-10"
      >
        <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
              <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <CheckIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold leading-6 text-gray-900"
                  >
                    Quotation Number {dataed}
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {" "}
                      Saved successfully!
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  onClick={() => router.push(`/quotationchallanpdf/${dataed}`)}
                  className="inline-flex w-full justify-center"
                >
                  <span className="bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 rounded-md">
                    Done
                  </span>
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={cancelDelete}
        className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75 transition-opacity overflow-y-auto"
      >
        <DialogBackdrop onClick={cancelDelete} />
        <DialogPanel className="bg-white p-3 rounded-md shadow-xl transition-all">
          <DialogTitle className="text-lg font-bold">
            Confirm Deletion
          </DialogTitle>
          <p>Are you sure you want to delete this item?</p>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={cancelDelete}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              onClick={onDelete}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </div>
        </DialogPanel>
      </Dialog>
    </form>
  );
};

export default Page;
