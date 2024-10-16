"use client";
import { EyeIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toWords } from "number-to-words";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

import Itemtable from "./Itemtable";
import Deleteconfirm from "./component/Deleteconfirm";
import Summary from "./component/Summary";
import Addressform from "./component/Addressform";

const page = () => {
  const [fetchdata, setfetchdata] = useState(null);
  const [totals, setTotals] = useState({
    subTotal: 0,
    discountAmount: 0,
    totalCGST: 0,
    totalSGST: 0,
    totalIGST: 0,
    grandTotal: 0,
  });

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

    const packageCharges = parseFloat(formdata.items1.packageCharges) || 0;
    const transportCharges = parseFloat(formdata.items1.transportCharges) || 0;
    const otherCosts = parseFloat(formdata.items1.otherCosts) || 0;

    const grandTotal =
      subtotal -
      discountAmount +
      totalCGST +
      totalSGST +
      totalIGST +
      packageCharges +
      transportCharges +
      otherCosts;

    return {
      subTotal: subtotal,
      discountAmount,
      totalTax: totalCGST + totalSGST + totalIGST,
      totalCGST,
      totalSGST,
      totalIGST,
      grandTotal,
    };
  };

  useEffect(() => {
    const calculatedTotals = calculateTotals();
    setTotals(calculatedTotals);
  }, [formdata]);

  let grandTotalInWords = toWords(totals.grandTotal);

  console.log(totals, "totals");
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

  const handlesubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = {
      ...formdata.items1,
      items: formdata.items,
      quotationId: fetchdata?.data?.id || null,
      grandTotal: totals.grandTotal,
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
        setOpen(true);
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
          (parseFloat(updatedItems[index].taxableValue) * 18) /
          100
        ).toFixed(2); // Calculate IGST tax amount
      }
    }

    // Update quantities and unit costs to recalculate taxable values and tax amounts
    if (name === "qty" || name === "unitCost") {
      const qty = parseFloat(updatedItems[index].qty) || 0;
      const unitCost = parseFloat(updatedItems[index].unitCost) || 0;
      updatedItems[index].taxableValue = (qty * unitCost).toFixed(2);
    }

    // Recalculate tax amounts based on selected tax type
    const taxableValue = parseFloat(updatedItems[index].taxableValue) || 0;
    const cgstPercentage = parseFloat(updatedItems[index].percentage) || 0;
    const sgstPercentage = parseFloat(updatedItems[index].percentage2) || 0;

    if (updatedItems[index].taxtype === "CGST") {
      updatedItems[index].taxamt = (
        (taxableValue * cgstPercentage) /
        100
      ).toFixed(2);
      updatedItems[index].taxamt2 = (
        (taxableValue * sgstPercentage) /
        100
      ).toFixed(2); // SGST
    } else if (updatedItems[index].taxtype === "IGST") {
      updatedItems[index].taxamt = (
        (taxableValue * (cgstPercentage + sgstPercentage)) /
        100
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
      onSubmit={handlesubmit}
      className="overflow-y-auto h-screen p-6 bg-white rounded-lg shadow-md"
    >
      <div className="flex justify-between mb-4">
        <h1></h1>
        <h1 className="text-xl font-bold">Quotation Form</h1>
        <h2 className="text-lg">Quotation NO: {searchid}</h2>
      </div>

      <Addressform formdata={formdata} handleInputChange={handleInputChange} />

      <Itemtable
        formdata={formdata}
        handleItemChange={handleItemChange}
        handleAddRow={handleAddRow}
        openDeleteDialog={openDeleteDialog}
      />

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

      <Summary
        grandTotalInWords={grandTotalInWords}
        totals={totals}
        formdata={formdata}
      />

      <div className="mt-5">
        <h1 className="text-sm  font-semibold">Payment Terms</h1>
        <div className="border border-gray-300 p-4 mt-2">
          <input
            type="text"
            value={formdata?.items1.term1}
            name="term1"
            onChange={handleInputChange}
            placeholder="Enter Payment Term 1"
            className="border uppercase text-sm border-gray-300 rounded-md w-full mb-2 h-10 px-2"
          />
          <input
            type="text"
            value={formdata?.items1.term2}
            name="term2"
            onChange={handleInputChange}
            placeholder="Enter Payment Term 2"
            className="border uppercase text-sm border-gray-300 rounded-md w-full mb-2 h-10 px-2"
          />
          <input
            type="text"
            value={formdata?.items1.term3}
            name="term3"
            onChange={handleInputChange}
            placeholder="Enter Payment Term 3"
            className="border uppercase text-sm border-gray-300 rounded-md w-full mb-2 h-10 px-2"
          />
          <input
            type="text"
            name="term4"
            value={formdata?.items1.term4}
            onChange={handleInputChange}
            placeholder="Enter Payment Term 4"
            className="border uppercase text-sm border-gray-300 rounded-md w-full mb-2 h-10 px-2"
          />
        </div>
      </div>

      <div className="flex justify-center">
        <Link
          className="mt-4 px-4 py-2 flex items-center bg-green-500 text-white rounded-md hover:bg-green-700"
          href={`/Quatation`}
        >
          <PlusIcon className="w-5 h-5 mt-0.5 mr-1 text-white" />
          New
        </Link>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-500 text-white flex items-center mx-3 rounded-md hover:bg-blue-600"
        >
          <img
            src={"./img/save.png"}
            alt=""
            className="w-5 mr-1 h-5 text-white"
          />
          Submit
        </button>
        <Link
          type="submit"
          className="mt-4 px-4 py-2 flex items-center bg-gray-500 text-white rounded-md hover:bg-gray-700"
          href={`/quotationchallanpdf/${searchid}`}
        >
          <EyeIcon className="w-4 h-4 mt-0.5 mr-1" />
          view
        </Link>
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
                  onClick={() =>
                    router.push(`/quotationchallanpdf/${searchid}`)
                  }
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

      <Deleteconfirm
        deleteDialogOpen={deleteDialogOpen}
        cancelDelete={cancelDelete}
        onDelete={onDelete}
      />
    </form>
  );
};

export default page;
