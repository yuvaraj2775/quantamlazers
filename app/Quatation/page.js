"use client";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
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

  const [suggestions, setSuggestions] = useState([]);
  const [itemdata, setitemdata] = useState([]);
  const [hsndata, sethsndata] = useState([]);
  const [newItemDescription, setNewItemDescription] = useState("");
  const [addingNewIndex, setAddingNewIndex] = useState(null);

  const [hsnSuggestions, setHsnSuggestions] = useState([]);
  const [newHsnCode, setNewHsnCode] = useState("");
  const [addingNewHsnIndex, setAddingNewHsnIndex] = useState(null);

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

  useEffect(() => {
    const hsnSuggestions = hsndata.map((item, index) => ({
      name: `${item.name} (IT${String(index + 1).padStart(3, "0")})`, // Formatted name
      enabled: item.enabled, // Include the enabled property
    }));

     setHsnSuggestions(hsnSuggestions);
  }, [hsndata]);
  console.log(hsnSuggestions,"hsnSuggestions")

  useEffect(() => {
    const suggestions = itemdata.map((item, index) => ({
      name: `${item.name} (IT${String(index + 1).padStart(3, "0")})`, // Formatted name
      enabled: item.enabled, // Include the enabled property
    }));

    setSuggestions(suggestions);
  }, [itemdata]);

  const saveHsnValue = (index) => {
    if (newHsnCode.trim()) {
      setItems((prevItems) => {
        const updatedItems = [...prevItems];
        updatedItems[index].hsncode = newHsnCode;
        return updatedItems;
      });

      // Add the new HSN code to suggestions
      setHsnSuggestions((prevSuggestions) => [
        ...prevSuggestions,
        {
          name: newHsnCode,
          enabled: 1,
        },
      ]);

      setAddingNewHsnIndex(null);
      setNewHsnCode("");
    }
  };

  const saveCustomValue = (index) => {
    if (newItemDescription.trim()) {
      setItems((prevItems) => {
        const updatedItems = [...prevItems];
        updatedItems[index].description = newItemDescription;
        return updatedItems;
      });

      // Add the new item to suggestions as a formatted object
      setSuggestions((prevSuggestions) => [
        ...prevSuggestions,
        {
          name: newItemDescription, // Add new item as a suggestion
          enabled: 1, // Set enabled or however you want to handle this
        },
      ]);

      setAddingNewIndex(null);
      setNewItemDescription("");
    }
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
  
    setItems((prevItems) => {
      const newItems = [...prevItems];
  
      // Update the specific item
      newItems[index] = { ...newItems[index], [name]: value };
  
      // Calculate taxable value if quantity or unit cost changes
      if (name === "qty" || name === "unitCost") {
        const qty = parseFloat(newItems[index].qty) || 0;
        const unitCost = parseFloat(newItems[index].unitCost) || 0;
        newItems[index].taxableValue = (qty * unitCost).toFixed(2);
      }
  
      // Recalculate tax amounts based on selected tax type
      const taxableValue = parseFloat(newItems[index].taxableValue) || 0;
  
      if (name === "taxtype") {
        // Reset tax amounts when changing tax types
        newItems[index].taxamt = "0.00";
        newItems[index].taxamt2 = "0.00";
  
        if (value === "CGST") {
          newItems[index].percentage = "9";
          newItems[index].percentage2 = "9"; // SGST percentage
          newItems[index].taxamt = ((taxableValue * 9) / 100).toFixed(2); // CGST
          newItems[index].taxamt2 = newItems[index].taxamt; // SGST
        } else if (value === "IGST") {
          newItems[index].percentage = "18";
          newItems[index].percentage2 = "0"; // No SGST
          newItems[index].taxamt = "0.00"; // CGST amount
          newItems[index].taxamt2 = ((taxableValue * 18) / 100).toFixed(2); // IGST
        } else if (value === "UGST") {
          newItems[index].percentage = "0";
          newItems[index].percentage2 = "18"; // UGST percentage
          newItems[index].taxamt = "0.00";
          newItems[index].taxamt2 = ((taxableValue * 18) / 100).toFixed(2); // UGST
        }
      }
  
      // Calculate totals based on all items
      const newTotals = {
        subTotal: 0,
        totalCGST: 0,
        totalSGST: 0,
        totalIGST: 0,
        totalUGST: 0,
        totalTax: 0,
        discountAmount: 0,
        grandTotal: 0,
      };
  
      newItems.forEach((item) => {
        const itemTaxableValue = parseFloat(item.taxableValue) || 0;
        const taxamt = parseFloat(item.taxamt) || 0;
        const taxamt2 = parseFloat(item.taxamt2) || 0;
        
        newTotals.subTotal += itemTaxableValue;
  
        // Sum up tax amounts for each tax type
        if (item.taxtype === "CGST") {
          newTotals.totalCGST += taxamt;
          newTotals.totalSGST += taxamt2;
        } else if (item.taxtype === "IGST") {
          newTotals.totalIGST += taxamt2;
        } else if (item.taxtype === "UGST") {
          newTotals.totalUGST += taxamt2;
        }
  
        newTotals.totalTax += taxamt + taxamt2;
      });
  
      // Calculate discount and grand total
      newTotals.discountAmount = (newTotals.subTotal * (input.discount || 0)) / 100;
      newTotals.grandTotal =
        newTotals.subTotal - newTotals.discountAmount + newTotals.totalTax;
  
      // Update items and totals state
      setItems(newItems);
      setTotals(newTotals);
  
      return newItems;
    });
  };
  
  

  const handleAddRowClick = () => {
    handleAddRow();
  
  };

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
  const [fetched, setfetched] = useState([]);

  const [totalss, setTotals] = useState({
    subTotal: 0,
    discountAmount: 0,
    totalCGST: 0,
    totalSGST: 0,
    totalIGST: 0,
    grandTotal: 0,
  });
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/itemmaster");
        if (!response.ok) throw new Error("failed to fetch data");
        const result = await response.json();
        setitemdata(result.data || []);
      } catch (error) {
        console.log("fetch failes:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/hsnmaster");
        if (!response.ok) throw new Error("failed to fetch data");
        const result = await response.json();
        sethsndata(result.data || []);
      } catch (error) {
        console.log("fetch failes:", error);
      }
    };
    fetchData();
  }, []);

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

  const onDelete = () => {
    if (rowToDelete !== null) {
      handleDeleteRow(rowToDelete);
    }
  };
  const handleDeleteRow = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    setDeleteDialogOpen(false);
    setRowToDelete(null);
  };

  const openDeleteDialog = (index) => {
    setRowToDelete(index);
    setDeleteDialogOpen(true);
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setRowToDelete(null);
  };

  const handleAddNew = (index) => {
    setAddingNewIndex(index);
    setNewItemDescription(""); // Clear any previous new item input
  };

  useEffect(() => {
    const calculatedTotals = calculateTotals();
    setTotals(calculatedTotals);
  }, [items, input]);

  const dataed = fetched?.data?.length ? fetched.data[0].id + 1 : null;

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

  const calculateTotals = () => {
    // Ensure items is an array and filter out any invalid items
    const validItems = items.filter(
      (item) => item && typeof item.taxableValue === "string"
    );

    const subTotal = validItems.reduce(
      (sum, item) => sum + (parseFloat(item.taxableValue) || 0),
      0
    );

    const totalTax = validItems.reduce(
      (sum, item) =>
        sum + (parseFloat(item.taxamt) || 0) + (parseFloat(item.taxamt2) || 0),
      0
    );

    const discountAmount = subTotal * (parseFloat(input.discount) / 100 || 0);
    const packageCharges = parseFloat(input.packages) || 0;
    const transportCharges = parseFloat(input.transport) || 0;
    const otherCosts = parseFloat(input.othercost) || 0;

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

  const totals = calculateTotals();
  let grandTotalInWords = toWords(totals.grandTotal);

  const handleNewItemDescriptionChange = (e) => {
    const value = e.target.value;
    setNewItemDescription(value.charAt(0).toUpperCase() + value.slice(1).toLowerCase());
  };

  const handleNewHsnCodeChange = (e) => {
    const value = e.target.value;
    setNewHsnCode(value.charAt(0).toUpperCase() + value.slice(1).toLowerCase());
  };

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

      <div className="relative">
        <div className="mt-5  ">
          <div className=" overflow-x-auto">
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
                  <React.Fragment key={index}>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="border border-gray-300 p-2 text-center">
                        {index + 1}
                      </td>
                      <td className="border p-2">
                        {addingNewIndex !== index ? (
                          <select
                            className="border w-52  h-10 px-2"
                            name="description"
                            value={item.description}
                            required
                            onChange={(e) => {
                              if (e.target.value === "add-new") {
                                handleAddNew(index);
                              } else {
                                handleItemChange(index, e);
                              }
                            }}
                            style={{
                              color:
                                suggestions.find(
                                  (suggestion) =>
                                    suggestion.name === item.description
                                )?.enabled === 0
                                  ? "red"
                                  : "black",
                            }} // Change color based on enabled status
                          >
                            <option value="">Select an item</option>
                            {suggestions.map((suggestion, suggestionIndex) => (
                              <option
                                key={suggestionIndex}
                                value={suggestion.name}
                                style={{
                                  color:
                                    suggestion.enabled === 0 ? "red" : "black",
                                }}
                              >
                                {suggestion.name}
                              </option>
                            ))}
                            <option value="add-new">Add New...</option>
                          </select>
                        ) : (
                          <input
                            type="text"
                            className="border w-52  h-10 px-2 mt-2"
                            placeholder="Enter new item"
                            name="description"
                            value={newItemDescription}
                            onChange={handleNewItemDescriptionChange
                            }
                            onBlur={() => saveCustomValue(index)}
                          />
                        )}
                      </td>

                      <td className="border border-gray-300 p-2">
                        {addingNewHsnIndex !== index ? (
                          <select
                            className="border w-52 capitalize h-10 px-2"
                            name="hsncode"
                            value={item.hsncode}
                            required
                            onChange={(e) => {
                              if (e.target.value === "add-new") {
                                setAddingNewHsnIndex(index);
                             
                              } else {
                                handleItemChange(index, e);
                              }
                            }}
                            style={{
                              color:
                                hsnSuggestions.find(
                                  (suggestion) =>
                                    suggestion.name === item.hsncode
                                )?.enabled === 0
                                  ? "red"
                                  : "black",
                            }}
                          >
                            <option value="">Select an HSN Code</option>
                            {hsnSuggestions.map(
                              (suggestion, suggestionIndex) => (
                                <option
                                  key={suggestionIndex}
                                  value={suggestion.name}
                                  style={{
                                    color:
                                      suggestion.enabled === 0
                                        ? "red"
                                        : "black",
                                  }}
                                >
                                  {suggestion.name}
                                </option>
                              )
                            )}
                            <option value="add-new">Add New...</option>
                          </select>
                        ) : (
                          <input
                            type="text"
                            className="border w-52  h-10 px-2 mt-2"
                            placeholder="Enter new HSN Code"
                            name="hsncode"
                            value={newHsnCode}
                            onChange={handleNewHsnCodeChange}
                            onBlur={() => saveHsnValue(index)}
                          />
                        )}
                      </td>
                      <td className="border border-gray-300 p-2">
                        <input
                          type="number"
                          className="border border-gray-300 text-right rounded-md w-24 h-10 px-2"
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
                          className="border border-gray-300 rounded-md text-right w-24 h-10 px-2"
                          name="unitCost"
                          value={item.unitCost}
                          onChange={(e) => handleItemChange(index, e)}
                        />
                        {errors.unitCost && (
                          <p className="text-red-500 text-sm min-h-[1.5rem]">
                            {errors.unitCost.message}
                          </p>
                        )}
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
                          className="border border-gray-300 rounded-md w-16 h-10"
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
                          className="border border-gray-300 rounded-md w-10 text-right h-10 px-2"
                          name="percentage"
                          value={item.percentage}
                          onChange={(e) => handleItemChange(index, e)}
                        />
                      </td>
                      <td className="border border-gray-300 p-2 w-16">
                        <input
                          type="text"
                          className="border border-gray-300 rounded-md w-16 text-right h-10 px-2"
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
                          className="border border-gray-300 rounded-md w-14 text-right h-10 px-2"
                          name="percentage2"
                          value={item.percentage2}
                          onChange={(e) => handleItemChange(index, e)}
                        />
                      </td>
                      <td className="border border-gray-300 p-2 w-14">
                        <input
                          type="text"
                          className="border border-gray-300 rounded-md w-14 text-right h-10 px-2"
                          name="taxamt2"
                          value={item.taxamt2}
                          readOnly
                        />
                      </td>
                      <td className="flex justify-center items-center mt-3 border-gray-300 space-x-2 px-2">
                        <button
                          type="button"
                          onClick={handleAddRowClick}
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
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="sticky">
          <Discount input={input} handleInputChange={handleInputChange} />
        </div>
      </div>

      {/* Additional Costs Section */}

      {/* Summary Section */}

      <div className="grid grid-cols-2 gap-4 mt-5">
        <div>
          <div>
            <span className="text-sm font-semibold">
              Grand Total (In Words)
            </span>
            <p className="capitalize">{grandTotalInWords}</p>
          </div>
          <div>
            <span className="text-sm font-semibold">Tax Amount</span>
            <div className="grid grid-cols-2">
              <div>
                <label className="text-sm">CGST:</label>
                <p className="text-sm">
                  {totals.totalTax > 0 &&
                  items.some((item) => item.taxtype === "CGST")
                    ? (totals.totalTax / 2).toFixed(2)
                    : "0.00"}
                </p>
              </div>
              <div>
                <label className="text-sm">IGST:</label>
                <p className="text-sm">
                  {totals.totalTax > 0 &&
                  items.every((item) => item.taxtype == "IGST")
                    ? totals.totalTax.toFixed(2)
                    : "0.00"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 mt-2">
              <div>
                <label className="text-sm">SGST:</label>
                <p className="text-sm">
                  {totals.totalTax > 0 &&
                  items.some((item) => item.taxtype == "CGST")
                    ? (totals.totalTax / 2).toFixed(2)
                    : "0.00"}
                </p>
              </div>
              <div>
                <label className="text-sm">UGST:</label>
                <p className="text-sm">
                  {totals.totalTax > 0 &&
                  items.every((item) => item.taxtype == "UGST")
                    ? totals.totalTax.toFixed(2)
                    : "0.00"}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[70%]">
          <div className="grid grid-cols-2">
            <p className="text-sm">Sub-Total Amt</p>
            <p className="text-sm text-right">{totals.subTotal.toFixed(2)}</p>
          </div>
          <div className="grid grid-cols-2 mt-1">
            <p className="text-sm">Discount ({input.discount || 0}%)</p>
            <p className="text-sm text-right">
              {totals.discountAmount.toFixed(2)}
            </p>
          </div>
          <div className="grid grid-cols-2 mt-1">
            <p className="text-sm">CGST</p>
            <p className="text-sm text-right">
              {totals.totalTax > 0 &&
              items.some((item) => item.taxtype === "CGST")
                ? (totals.totalTax / 2).toFixed(2)
                : "0.00"}
            </p>
          </div>
          <div className="grid grid-cols-2 mt-1">
            <p className="text-sm">SGST</p>
            <p className="text-sm text-right">
              {totals.totalTax > 0 &&
              items.some((item) => item.taxtype === "CGST")
                ? (totals.totalTax / 2).toFixed(2)
                : "0.00"}
            </p>
          </div>
          <div className="grid grid-cols-2 mt-1">
            <p className="text-sm">IGST</p>
            <p className="text-sm text-right">
              {totals.totalTax > 0 &&
              items.every((item) => item.taxtype === "IGST")
                ? totals.totalTax.toFixed(2)
                : "0.00"}
            </p>
          </div>
          <div className="grid grid-cols-2 mt-1">
            <p className="text-sm">UGST</p>
            <p className="text-sm text-right">
              {totals.totalTax > 0 &&
              items.every((item) => item.taxtype === "UGST")
                ? totals.totalTax.toFixed(2)
                : "0.00"}
            </p>
          </div>
          <div className="grid grid-cols-2 mt-1">
            <p className="text-sm">Package Charges</p>
            <p className="text-sm text-right">{input.packages || 0}</p>
          </div>
          <div className="grid grid-cols-2 mt-1">
            <p className="text-sm">Transportation Charges</p>
            <p className="text-sm text-right">{input.transport || 0.0}</p>
          </div>
          <div className="grid grid-cols-2 mt-1">
            <p className="text-sm">Other Cost</p>
            <p className="text-sm text-right">{input.othercost || 0}</p>
          </div>
          <div className="grid grid-cols-2 mt-1">
            <p className="text-sm">Grand Total (RS)</p>
            <p className="text-sm text-right">{totals.grandTotal.toFixed(2)}</p>
          </div>
        </div>
      </div>

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
        open={deleteDialogOpen}
        onClose={cancelDelete}
        onDelete={onDelete}
      />
    </form>
  );
};

export default Page;
