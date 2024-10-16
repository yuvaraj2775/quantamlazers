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
import { useForm } from "react-hook-form";
import { toWords } from "number-to-words";
import ItemTablevalues from "./ItemTablevalues";
import Discount from "./Discount";
import Quotationdelete from "./Quotationdelete";
import Invoicesummary from "./Invoicesummary";
import AddressForm from "./AddressForm";

const Page = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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
    term1: "",
    term2: "",
    term3: "",
    term4: "",
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

  const [totalss, setTotals] = useState({
    subTotal: 0,
    discountAmount: 0,
    totalCGST: 0,
    totalSGST: 0,
    totalIGST: 0,
    grandTotal: 0,
  });
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

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

  useEffect(() => {
    const calculatedTotals = calculateTotals();
    setTotals(calculatedTotals);
  }, [items, input]);

  console.log(totalss, "totals");

  const dataed = fetched?.data.length ? fetched.data[0].id + 1 : null;

  const onSubmit = async (data) => {
    try {
      const response = await fetch("/api/quatation", {
        method: "POST",
        body: JSON.stringify({ ...input, items, ...totalss }), // Send form data with items
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      console.log("Data added", result);
      setOpen(true); // Open the dialog on success
      // Optionally reset the form and items
    } catch (error) {
      console.error("Error while submitting:", error);
    }
  };
  const totals = calculateTotals();
  let grandTotalInWords = toWords(totals.grandTotal);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className=" overflow-y-auto h-screen p-6 bg-white rounded-lg shadow-md"
    >
      <div className="flex justify-between mb-4">
        <h1></h1>
        <h1 className="text-xl  font-bold">Quotation Form</h1>
        <h2 className="text-lg">Quotation NO: Draft</h2>
      </div>

      <AddressForm
        input={input}
        handleInputChange={handleInputChange}
        register={register}
        errors={errors}
      />

      <div>
        <ItemTablevalues
          items={items}
          handleItemChange={handleItemChange}
          handleAddRow={handleAddRow}
          openDeleteDialog={openDeleteDialog}
          errors={{}} // Replace with actual error handling if needed
          register={() => {}}
        />
      </div>

      {/* Additional Costs Section */}

      <Discount input={input} handleInputChange={handleInputChange} />

      {/* Summary Section */}

      <Invoicesummary
        grandTotalInWords={grandTotalInWords}
        totals={totals}
        items={items}
        input={input}
      />

      {/* Payment Terms Section */}
      <div className="mt-5">
        <h1 className="text-sm  font-semibold">Payment Terms</h1>
        <div className="border border-gray-300 p-4">
          <input
            type="text"
            name="term1"
            value={input.term1}
            onChange={handleInputChange}
            placeholder="Enter Payment Term 1"
            className="border text-sm uppercase border-gray-300 rounded-md w-full mb-2 h-10 px-2"
          />
          <input
            type="text"
            value={input.term2}
            name="term2"
            onChange={handleInputChange}
            placeholder="Enter Payment Term 2"
            className="border text-sm uppercase border-gray-300 rounded-md w-full mb-2 h-10 px-2"
          />
          <input
            type="text"
            value={input.term3}
            name="term3"
            onChange={handleInputChange}
            placeholder="Enter Payment Term 3"
            className="border text-sm uppercase border-gray-300 rounded-md w-full mb-2 h-10 px-2"
          />
          <input
            type="text"
            value={input.term4}
            name="term4"
            onChange={handleInputChange}
            placeholder="Enter Payment Term 4"
            className="border text-sm uppercase border-gray-300 rounded-md w-full mb-2 h-10 px-2"
          />
        </div>
      </div>
      <div className="mt-5 flex justify-center">
        <button
          type="submit"
          className="bg-blue-600 flex items-center text-white rounded-md px-4 py-2"
        >
          <img
            src={"./img/save.png"}
            alt=""
            className="w-5 mr-1 h-5 text-white"
          />
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

      <Quotationdelete
        deleteDialogOpen={deleteDialogOpen}
        cancelDelete={cancelDelete}
        onDelete={onDelete}
      />
    </form>
  );
};

export default Page;
