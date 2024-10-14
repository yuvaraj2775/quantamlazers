"use client";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toWords } from 'number-to-words';

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const page = () => {
  const [fetchdata, setfetchdata] = useState(null);
  const [formdata, setformdata] = useState({ items: [], items1: [] });
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const searchid = useSearchParams().get("id");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);

  const calculateTotals = () => {
    const subtotal = formdata.items.reduce((sum, item) => {
      const taxableValue = parseFloat(item.taxableValue) || 0;
      return sum + taxableValue;
    }, 0);

  

    const discountAmount =
      (subtotal * (parseFloat(formdata.items1.discount) || 0)) / 100;

    const totalCGST = formdata.items.reduce((sum, item) => {
      return item.taxtype === "CGST"
        ? sum + (parseFloat(item.taxamt) || 0)
        : sum;
    }, 0);

    const totalSGST = formdata.items.reduce((sum, item) => {
      return item.taxtype === "CGST"
        ? sum + (parseFloat(item.taxamt2) || 0)
        : sum;
    }, 0);

    const totalIGST = formdata.items.reduce((sum, item) => {
      return item.taxtype === "IGST"
        ? sum + (parseFloat(item.taxamt) || 0)
        : sum;
    }, 0);

    const totalUGST = formdata.items.reduce((sum, item) => {
      return item.taxtype === "UGST"
        ? sum + (parseFloat(item.taxamt2) || 0)
        : sum;
    }, 0);

    const packageCharges = parseFloat(formdata.items1.packageCharges) || 0;
    const transportCharges = parseFloat(formdata.items1.transportCharges) || 0;
    const otherCosts = parseFloat(formdata.items1.otherCosts) || 0;

    const grandTotal =
      subtotal -
      discountAmount +
      totalCGST +
      totalSGST +
      totalIGST +
      totalUGST +
      packageCharges +
      transportCharges +
      otherCosts;

    return {
      subTotal: subtotal,
      discountAmount,
      totalTax: totalCGST + totalSGST + totalIGST + totalUGST,
      totalCGST: totalCGST || 0, // Ensure zero is returned
      totalSGST: totalSGST || 0, // Ensure zero is returned
      totalIGST: totalIGST || 0, // Ensure zero is returned
      totalUGST: totalUGST || 0, // Ensure zero is returned
      grandTotal,
    };
  };

  const totals = calculateTotals();
  const fulltotals = {
    grandTotal: parseFloat(totals.grandTotal.toFixed(2)), // Convert to a number
    // other totals...
  };

  let grandTotalInWords = toWords(fulltotals.grandTotal);

  useEffect(() => {
    const fetchData = async () => {
      if (searchid) {
        try {
          const response = await fetch(`/api/quatation?id=${searchid}`);
          if (!response.ok) throw new Error("Failed to fetch data");
          const result = await response.json();
          setformdata({
            // ...result.data[0], // Update formData with the fetched data
            items1: result.data || [],
            items: result.itemdata || [],
          });
          setfetchdata(result);
        } catch (error) {
          console.error("Fetch failed:", error);
        }
      }
    };

    fetchData();
  }, [searchid]);

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    const formDataToSend = {
      ...formdata.items1,
      items: formdata.items,
      quotationId: fetchdata?.data?.id || null,
    };

    try {
      const response = await fetch(`/api/quatation?id=${searchid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formDataToSend),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Update successful:", result);
        setOpen(true)
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name in formdata.items1) {
      setformdata((prev) => ({
        ...prev,
        items1: {
          ...prev.items1,
          [name]: value,
        },
      }));
    } else {
      setformdata((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...formdata.items];

    // Update the item value
    updatedItems[index] = {
        ...updatedItems[index],
        [name]: value,
    };

    // Handle tax type changes
    if (name === "taxtype") {
        // Reset tax amounts based on selected tax type
        if (value === "CGST") {
            updatedItems[index].percentage = "9";
            updatedItems[index].percentage2 = "9"; // SGST percentage
            updatedItems[index].taxamt = "0.00"; // Resetting taxamt for IGST
            updatedItems[index].taxamt2 = "0.00"; // Resetting taxamt2 for IGST
        } else if (value === "IGST") {
            updatedItems[index].percentage = "18"; // Set IGST percentage
            updatedItems[index].percentage2 = "0"; // No SGST
            updatedItems[index].taxamt = "0.00"; // Resetting taxamt for CGST
            updatedItems[index].taxamt2 = (
                (parseFloat(updatedItems[index].taxableValue) * 18) / 100
            ).toFixed(2); // Calculate IGST tax amount
        }
    }

    // Update quantities and unit costs to recalculate taxable values and tax amounts
    if (name === "qty" || name === "unitCost") {
        const qty = parseFloat(updatedItems[index].qty) || 0;
        const unitCost = parseFloat(updatedItems[index].unitCost) || 0;
        updatedItems[index].taxableValue = (qty * unitCost).toFixed(2);
    }

    // Calculate tax amounts based on the current taxable value
    const taxableValue = parseFloat(updatedItems[index].taxableValue) || 0;
    const cgstPercentage = parseFloat(updatedItems[index].percentage) || 0;
    const sgstPercentage = parseFloat(updatedItems[index].percentage2) || 0;

    // Recalculate tax amounts based on selected tax type
    if (updatedItems[index].taxtype === "CGST") {
        updatedItems[index].taxamt = (
            (taxableValue * cgstPercentage) / 100
        ).toFixed(2);
        updatedItems[index].taxamt2 = (
            (taxableValue * sgstPercentage) / 100
        ).toFixed(2); // SGST
    } else if (updatedItems[index].taxtype === "IGST") {
        updatedItems[index].taxamt = (
            (taxableValue * (cgstPercentage + sgstPercentage)) / 100
        ).toFixed(2);
        updatedItems[index].taxamt2 = "0.00"; // IGST does not have a second type tax amount
    }

    setformdata((prev) => ({ ...prev, items: updatedItems }));
};


  const handleAddRow = () => {
    setformdata((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          description: "",
          hsncode: "",
          percentage: "9",
          percentage2: "9",
          taxableValue: "",
          taxamt: "",
          taxamt2: "",
          unitCost: "",
          unit: "NOS",
          taxtype: "CGST",
          typeoftax: "",
          qty: "",
        },
      ],
    }));
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
    console.log(`Deleting item at index: ${index}`);
    const newItems = formdata.items.filter((_, i) => i !== index);
    setformdata((prev) => ({ ...prev, items: newItems }));
    setDeleteDialogOpen(false);
    setRowToDelete(null);
  };

  
  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setRowToDelete(null);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-y-auto h-screen p-6 bg-white rounded-lg shadow-md"
    >
      <div className="flex justify-between mb-4">
        <h1></h1>
        <h1 className="text-xl font-bold">Quotation Form</h1>
        <h2 className="text-lg">Quotation NO: Draft</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="Address" className="block mb-1 text-sm font-semibold">
            Address
          </label>
          <textarea
            name="Address"
            value={formdata?.items1.Address}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md w-full h-32 px-2 py-1 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="Date"
                className="block mb-1 text-sm font-semibold"
              >
                Date
              </label>
              <input
                type="date"
                className="border border-gray-300 rounded-md w-full h-10 px-2"
                name="Date"
                value={formdata?.items1.Date}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label
                htmlFor="reference"
                className="block mb-1 text-sm font-semibold"
              >
                Reference Number
              </label>
              <input
                type="text"
                className="border border-gray-300 rounded-md w-full h-10 px-2"
                name="reference"
                value={formdata?.items1.reference}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="gstnumber"
                className="block mb-1 text-sm font-semibold"
              >
                GST Number
              </label>
              <input
                type="text"
                className="border border-gray-300 rounded-md w-full h-10 px-2"
                name="gstnumber"
                value={formdata?.items1.gstnumber}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label
                htmlFor="kindattention"
                className="block mb-1 text-sm font-semibold"
              >
                Kind Attention
              </label>
              <input
                type="text"
                className="border border-gray-300 rounded-md w-full h-10 px-2"
                name="kindattention"
                value={formdata?.items1.kindattention}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <label htmlFor="subject" className="block mb-1 text-sm font-semibold">
          Subject
        </label>
        <input
          type="text"
          className="border border-gray-300 rounded-md w-full h-10 px-2"
          name="subject"
          value={formdata?.items1.subject}
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
                    className="border px-2 border-gray-300 w-20 rounded-md   h-10 "
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
                    className="border border-gray-300 rounded-md w-20 h-10 px-2"
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
                    <button type="button" onClick={() => handleAddRow()}>
                      <PlusIcon className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openDeleteDialog(index)}
                    >
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
            {formdata?.items.reduce(
              (sum, item) => sum + (parseInt(item.qty) || 0),
              0
            )}
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
            value={formdata?.items1.discount}
            onChange={handleInputChange}
            className="border border-gray-300 h-10 rounded-md w-full px-2"
          />
        </div>
        <div>
          <label className="text-sm  font-semibold">Package Charges</label>
          <input
            type="number"
            name="packageCharges"
            value={formdata?.items1.packageCharges}
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
            name="transportCharges"
            value={formdata?.items1.transportCharges}
            onChange={handleInputChange}
            className="border border-gray-300 h-10 rounded-md w-full px-2"
          />
        </div>
        <div>
          <label className="text-sm  font-semibold">Other Cost</label>
          <input
            type="number"
            name="otherCosts"
            value={formdata?.items1.otherCosts}
            onChange={handleInputChange}
            className="border border-gray-300 h-10 rounded-md w-full px-2"
          />
        </div>
      </div>
      <div className="grid grid-cols-2">
        <div>
          <div>
            <div>
              <span className="text-sm font-semibold">
                Grand Total (In Words)
              </span>
              <p>
            {grandTotalInWords}
              </p>
            </div>
            <div>
              <span className="text-sm font-semibold">Tax Amount</span>
              <div className="grid grid-cols-2">
                <div>
                  <label>CGST:</label>
                  <p>{totals.totalCGST.toFixed(2)}</p>{" "}
                  {/* Use calculated CGST value */}
                </div>
                <div>
                  <label>IGST:</label>
                  <p>{totals.totalIGST.toFixed(2)}</p>{" "}
                  {/* Use calculated IGST value */}
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div>
                  <label>SGST:</label>
                  <p>{totals.totalSGST.toFixed(2)}</p>{" "}
                  {/* Use calculated SGST value */}
                </div>
                <div>
                  <label>UGST:</label>
                  <p>{totals.totalUGST.toFixed(2)}</p>{" "}
                  {/* Use calculated UGST value */}
                </div>
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
            <p>Discount ({formdata.items1.discount} %)</p>
            <p>{totals.discountAmount.toFixed(2)}</p>
          </div>
          <div className="grid grid-cols-2">
            <p>Total CGST</p>
            <p>{totals.totalCGST > 0 ? totals.totalCGST.toFixed(2) : "0.00"}</p>
          </div>
          <div className="grid grid-cols-2">
            <p>Total SGST</p>
            <p>{totals.totalTax.toFixed(2)}</p>
          </div>
          <div className="grid grid-cols-2">
            <p>Total IGST</p>
            <p>{totals.totalIGST > 0 ? totals.totalIGST.toFixed(2) : "0.00"}</p>
          </div>
          <div className="grid grid-cols-2">
            <p>Total UGST</p>
            <p>{totals.totalUGST > 0 ? totals.totalUGST.toFixed(2) : "0.00"}</p>
          </div>
          <div className="grid grid-cols-2">
            <p>Package Charges</p>
            <p>{formdata.items1.packageCharges}</p>
          </div>
          <div className="grid grid-cols-2">
            <p>Transportation Charges</p>
            <p>{formdata.items1.transportCharges}</p>
          </div>
          <div className="grid grid-cols-2">
            <p>Other Cost</p>
            <p>{formdata.items1.otherCosts}</p>
          </div>
          <div className="grid grid-cols-2">
            <p>Grand Total (RS)</p>
            <p>{totals.grandTotal.toFixed(2)}</p>
          </div>
        </div>
      </div>

  <div className="flex justify-center" >
    <div>
      <Link  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" href={`/Quatation`} >
        New
      </Link>
    <button
        type="submit"
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Submit
      </button>
      <Link
        type="submit"
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        href={`/quotationchallanpdf/${searchid}`}
      >
        view
      </Link>
   
    </div>

  </div>

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
                    Quotation Number {searchid}
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
                  onClick={() => router.push(`/quotationchallanpdf/${searchid}`)}
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

export default page;
