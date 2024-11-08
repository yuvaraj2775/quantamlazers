"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

import { useRouter, useSearchParams } from "next/navigation";
import Formitems from "./Formitems";
import ItemRows from "./ItemRows";
import Windialog from "./Windialog";
import Losedialog from "./Losedialog";
import { PlusIcon, XMarkIcon, EyeIcon } from "@heroicons/react/24/solid";

export default function Page({ params }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [formData, setFormData] = useState({ items: [], items1: [] });
  const [fetchedData, setFetchedData] = useState(null);
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const searchid = useSearchParams().get("id");
  const [suggestions, setSuggestions] = useState([]);
  const [itemdata, setitemdata] = useState([]);
  const [newItemDescription, setNewItemDescription] = useState("");
  const [addingNewIndex, setAddingNewIndex] = useState(null);
  const [hsndata, sethsndata] = useState([]);
  const [hsnSuggestions, setHsnSuggestions] = useState([]);
  const [newHsnCode, setNewHsnCode] = useState("");
  const [addingNewHsnIndex, setAddingNewHsnIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (searchid) {
        try {
          const response = await fetch(`/api/Formdata?id=${searchid}`);
          if (!response.ok) throw new Error("Failed to fetch data");
          const result = await response.json();
          setFormData({
            items1: result.data || [],
            items: result.data2 || [],
          });
          setFetchedData(result);
        } catch (error) {
          console.error("Fetch failed:", error);
        }
      }
    };

    fetchData();
  }, [searchid]);

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
    const suggestions = itemdata.map((item, index) => ({
      name: `${item.name} (IT${String(index + 1).padStart(3, "0")})`, // Formatted name
      enabled: item.enabled, // Include the enabled property
    }));

    setSuggestions(suggestions);
  }, [itemdata]);

  const handleAddNew = (index) => {
    setAddingNewIndex(index);
    setNewItemDescription(""); // Clear any previous new item input
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };
  
  const saveCustomValue = (index) => {
    if (newItemDescription.trim()) {
      const capitalizedDescription = capitalizeFirstLetter(newItemDescription);
      
      setFormData((prevFormData) => {
        const updatedItems = [...prevFormData.items];
        updatedItems[index] = {
          ...updatedItems[index],
          name: capitalizedDescription, // Update the name with only the first letter capitalized
        };
        return { ...prevFormData, items: updatedItems };
      });
  
      // Add the new item to suggestions
      setSuggestions((prevSuggestions) => [
        ...prevSuggestions,
        {
          name: capitalizedDescription,
          enabled: 1,
        },
      ]);
  
      setAddingNewIndex(null);
      setNewItemDescription("");
    }
  };
  

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
  useEffect(() => {
    const hsnSuggestions = hsndata.map((item, index) => ({
      name: `${item.name} (IT${String(index + 1).padStart(3, "0")})`, // Formatted name
      enabled: item.enabled, // Include the enabled property
    }));

    setHsnSuggestions(hsnSuggestions);
  }, [hsndata]);

  const saveHsnValue = (index) => {
    if (newHsnCode.trim()) {
      setFormData((prevFormData) => {
        const updatedItems = [...prevFormData.items];
        updatedItems[index].hsn = newHsnCode; // Update the correct property
        return { ...prevFormData, items: updatedItems };
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Update formData based on input name
    setFormData((prev) => ({
      ...prev,
      items1: {
        ...prev.items1,
        [name]: value,
      },
    }));
  };

  const handleRowChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.items];

    // Capitalize the first letter if it's text
    if (isNaN(value.charAt(0))) {
      updatedItems[index] = {
        ...updatedItems[index],
        [name]: value.charAt(0).toUpperCase() + value.slice(1),
      };
    } else {
      updatedItems[index] = { ...updatedItems[index], [name]: value };
    }

    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  const handleAddRow = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { name: "", hsn: "", qty: "", umoremarks: "NOS", remarks: "" },
      ],
    }));
  };

  const openDeleteDialog = (index) => {
    setRowToDelete(index);
    setDeleteDialogOpen(true);
  };

  const handleDeleteRow = () => {
    const newItems = formData.items.filter((_, i) => i !== rowToDelete);
    setFormData({ items: newItems });
    setDeleteDialogOpen(false);
    setRowToDelete(null);
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setRowToDelete(null);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.items1.buyer) newErrors.buyer = "Buyer is required.";
    if (!formData.items1.dc_date) newErrors.dc_date = "DC Date is required.";
    if (!formData.items1.ordernumber)
      newErrors.ordernumber = "Order Number is required.";
    if (!formData.items1.orderdate)
      newErrors.orderdate = "Order Date is required.";

    // Add more validations as needed...

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // Only proceed if validation passes

    const formDataToSend = {
      ...formData.items1,
      items: formData.items,
      quotation_id: fetchedData?.data?.id || null,
    };

    try {
      const response = await fetch(`/api/Formdata?id=${searchid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formDataToSend),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Update successful:", result);
        setOpen(true); // Open the success dialog
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  const dated = formData.items1?.id;
  
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
      onSubmit={handleSubmit}
      className="h-screen capitalize p-6 overflow-y-auto bg-gray-50"
    >
      <div className="grid grid-cols-3">
        <h1></h1>
        <h1 className="text-center mt-5 font-bold text-xl text-gray-800">
          Edit page
        </h1>
        <h1 className="text-right mt-5 font-bold text-lg text-blue-600 mr-1">
          DC NO:{" "}
          <span className="text-red-900 text-2xl">{formData.items1?.id}</span>{" "}
        </h1>
      </div>
      <div className="grid grid-cols-2 mt-4 gap-4">
        <div>
          <Formitems
            label="Buyer"
            type="textarea"
            name="buyer"
            value={formData.items1?.buyer}
            onChange={handleInputChange}
            required
            error={errors.buyer} // Show error message if exists
          />
        </div>

        <div>
          <div className="capitalize gap-1 grid grid-cols-3">
            <Formitems
              label="DC Date"
              type="date"
              name="dc_date"
              value={formData.items1?.dc_date}
              onChange={handleInputChange}
              required
              error={errors.dc_date} // Show error message if exists
            />
            <Formitems
              label="Your Order Number"
              type="text"
              name="ordernumber"
              value={formData.items1?.ordernumber}
              onChange={handleInputChange}
              required
              error={errors.ordernumber} // Show error message if exists
            />
            <Formitems
              label="Your Order Date"
              type="date"
              name="orderdate"
              value={formData.items1?.orderdate}
              onChange={handleInputChange}
              required
              error={errors.orderdate} // Show error message if exists
            />
          </div>

          <div className="grid grid-cols-2 gap-1 mt">
            <Formitems
              label="Vehicle Number"
              type="text"
              name="vehicle_number"
              value={formData.items1?.vehicle_number}
              onChange={handleInputChange}
            />
            <Formitems
              label="GST Number"
              type="text"
              name="gst_number"
              value={formData.items1?.gst_number}
              onChange={handleInputChange}
            />
            <Formitems
              label="Your DC Number"
              type="text"
              name="dc_number"
              value={formData.items1?.dc_number}
              onChange={handleInputChange}
            />
            <Formitems
              label="Your DC Date"
              type="date"
              name="dc_issue_date"
              value={formData.items1?.dc_issue_date}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      <div className="border-2 border-gray-300 mt-5 rounded-lg overflow-x-auto shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-200 font-semibold">
            <tr>
              <th>Sl. No</th>
              <th>Item Name</th>
              <th>HSN Code</th>
              <th>Qty</th>
              <th>UMO</th>
              <th>Remarks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {formData.items?.map((item, index) => (
              <tr className="border-b">
                <td className="p-2 w-10">{index + 1}</td>
                <td className="px-2">
                  {addingNewIndex !== index ? (
                    <select
                      className="border w-52  h-10 px-2"
                      name="name"
                      value={item.name || ""} // Use item.name as the value
                      required
                      onChange={(e) => {
                        if (e.target.value === "add-new") {
                          handleAddNew(index);
                        } else {
                          handleRowChange(index, e); // Correctly call the handleRowChange
                        }
                      }}
                      style={{
                        color:
                          suggestions.find(
                            (suggestion) => suggestion.name === item.name
                          )?.enabled === 0
                            ? "red"
                            : "black",
                      }}
                    >
                      <option value="">Select an item</option>

                      {/* Render existing suggestions */}
                      {suggestions.map((suggestion, suggestionIndex) => (
                        <option
                          key={suggestionIndex}
                          value={suggestion.name}
                          style={{
                            color: suggestion.enabled === 0 ? "red" : "black",
                          }}
                        >
                          {suggestion.name}
                        </option>
                      ))}

                      {/* Add the current item as an option if it doesn't match any suggestion */}
                      {item.name &&
                        !suggestions.find(
                          (suggestion) => suggestion.name === item.name
                        ) && <option value={item.name}>{item.name}</option>}

                      <option value="add-new">Add New...</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      className="border w-52  h-10 px-2 mt-2"
                      placeholder="Enter new item"
                      name="name"
                      value={newItemDescription}
                      onChange={handleNewItemDescriptionChange}
                      onBlur={() => saveCustomValue(index)} // Call saveCustomValue
                    />
                  )}
                </td>

                <td className="px-1">
                  {addingNewHsnIndex !== index ? (
                    <select
                      className="border w-52 capitalize h-10 px-2"
                      name="hsn"
                      value={item.hsn || ""} // Use item.hsn as the value, with fallback to ""
                      required
                      onChange={(e) => {
                        if (e.target.value === "add-new") {
                          setAddingNewHsnIndex(index);
                        } else {
                          handleRowChange(index, e); // Call handleRowChange
                        }
                      }}
                      style={{
                        color:
                          hsnSuggestions.find(
                            (suggestion) => suggestion.name === item.hsn
                          )?.enabled === 0
                            ? "red"
                            : "black",
                      }}
                    >
                      <option value="">Select an HSN Code</option>

                      {/* Render existing HSN suggestions */}
                      {hsnSuggestions.map((suggestion, suggestionIndex) => (
                        <option
                          key={suggestionIndex}
                          value={suggestion.name}
                          style={{
                            color: suggestion.enabled === 0 ? "red" : "black",
                          }}
                        >
                          {suggestion.name}
                        </option>
                      ))}

                      {/* Add the current HSN code as an option if it doesn't match any suggestion */}
                      {item.hsn &&
                        !hsnSuggestions.find(
                          (suggestion) => suggestion.name === item.hsn
                        ) && <option value={item.hsn}>{item.hsn}</option>}

                      <option value="add-new">Add New...</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      className="border w-52  h-10 px-2 mt-2"
                      placeholder="Enter new HSN Code"
                      name="hsn"
                      value={newHsnCode} // Set this to the correct state
                      onChange={handleNewHsnCodeChange}
                      onBlur={() => saveHsnValue(index)} // Call saveHsnValue
                    />
                  )}
                </td>

                <td className="px-2">
                  <input
                    type="number"
                    name="qty"
                    value={item.qty}
                    onChange={(e) => handleRowChange(index, e)}
                    placeholder="Qty"
                    className="w-full text-right border rounded p-1 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                  />
                </td>
                <td className="px-2">
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
                <td className="px-2">
                  <textarea
                    name="remarks"
                    value={item.remarks}
                    onChange={(e) => handleRowChange(index, e)}
                    placeholder="Remarks"
                    className="border w-full h-14 rounded p-1 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
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
                  {index === 0 ? ( // Dummy button for the first row
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
          </tbody>
          <tfoot>
            <tr>
              <td></td>
              <td></td>
              <td className="col-span-2">
                <p className="font-bold mt-2">Total Number of Qty : </p>
              </td>
             
             
              <td className="text-right pr-7 ">
                <span className=" mt-2 inline-block ">
                  {formData.items.reduce(
                    (acc, item) => acc + Number(item.qty || 0),
                    0
                  )}
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
       
      </div>

      <div className="flex justify-center gap-3 mt-5">
        <button
          type="button"
          onClick={() => router.push("/delivery")}
          className="text-center cursor-pointer border-2 p-2 w-24 flex items-center justify-center rounded-md bg-green-500 text-white"
        >
          <PlusIcon className="w-5 h-5 mr-1 text-white" />
          New
        </button>
        <button
          type="submit"
          className="text-center cursor-pointer border-2 p-2 w-24 flex items-center justify-center rounded-md bg-blue-500 text-white"
        >
          <img
            src={"./img/save.png"}
            alt=""
            className="w-5 mr-1 h-5 text-white"
          />
          Save
        </button>
        <button
          type="button"
          className="text-center cursor-pointer border-2 p-2 w-24 flex items-center justify-center rounded-md bg-gray-500 text-white"
          onClick={() => router.push(`/DeliveryChallanPdf/${searchid}`)}
        >
          <EyeIcon className="w-4 h-4 mr-1" />
          View
        </button>
      </div>

      <Windialog
        open={open}
        onClose={() => setOpen(false)}
        dataId={dated}
        onRedirect={() => router.push(`/DeliveryChallanPdf/${searchid}`)}
      />
      <Losedialog
        open={deleteDialogOpen}
        onClose={cancelDelete}
        onDelete={handleDeleteRow}
      />
    </form>
  );
}
