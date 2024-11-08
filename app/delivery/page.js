"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Forminput from "./Forminput"; // Adjust the import path as necessary
import Itemrows from "./Itemrows"; // Adjust the import path as necessary
import Deletedialog from "./Deletedialog"; // Adjust the import path as necessary
import Successdialog from "./Successdialog"; // Adjust the import path as necessary
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import {
  FolderArrowDownIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useForm } from "react-hook-form";

export default function Page() {
  // All your state and handlers remain here
  const {
    register,

    formState: { errors },
  } = useForm();
  // ...
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [itemdata, setitemdata] = useState([]);
  const [newItemDescription, setNewItemDescription] = useState("");
  const [addingNewIndex, setAddingNewIndex] = useState(null);
  const [hsndata, sethsndata] = useState([]);
  const [hsnSuggestions, setHsnSuggestions] = useState([]);
  const [newHsnCode, setNewHsnCode] = useState("");
  const [addingNewHsnIndex, setAddingNewHsnIndex] = useState(null);
  const [formData, setFormData] = useState({
    items: [
      {
        id: "",
        name: "",
        hsn: "",
        qty: "",
        umoremarks: "NOS",
        remarks: "",
      },
    ],
  });
  const [open, setOpen] = useState(false);

  const [inputData, setInputData] = useState({
    Buyer: "",
    docdate: "",
    vehiclenumber: "",
    gstnumber: "",
    dcnumber: "",
    dcdate: "",
    ordernumber: "",
    orderdate: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const suggestions = itemdata.map((item, index) => ({
      name: `${item.name} (IT${String(index + 1).padStart(3, "0")})`, // Formatted name
      enabled: item.enabled, // Include the enabled property
    }));

    setSuggestions(suggestions);
  }, [itemdata]);

  const onclose = () => {
    setOpen(false); // Close the dialog by setting the state to false
  };
  

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

  const handleAddNew = (index) => {
    setAddingNewIndex(index);
    setNewItemDescription(""); // Clear any previous new item input
  };

  const saveCustomValue = (index) => {
    if (newItemDescription.trim()) {
      setFormData((prevFormData) => {
        const updatedItems = [...prevFormData.items];
        updatedItems[index] = {
          ...updatedItems[index],
          name: newItemDescription, // Update the name instead of description
        };
        return { ...prevFormData, items: updatedItems };
      });

      // Add the new item to suggestions
      setSuggestions((prevSuggestions) => [
        ...prevSuggestions,
        {
          name: newItemDescription,
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

  const handleAddRow = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: "",
          name: "",
          hsn: "",
          qty: "",
          umoremarks: "NOS",
          remarks: "",
        },
      ],
    }));
  };
  const handleRowChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.items];

    // Check if the first character is a number or not
    if (isNaN(value.charAt(0))) {
      // Capitalize the first letter if it's a text
      updatedItems[index] = {
        ...updatedItems[index],
        [name]: value.charAt(0).toUpperCase() + value.slice(1),
      };
    } else {
      // Keep the value unchanged if it's a number
      updatedItems[index] = { ...updatedItems[index], [name]: value };
    }

    // Update the formData with the modified items
    setFormData((prev) => ({ ...prev, items: updatedItems }));
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

  const [fetchedData, setFetchedData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/Formdata");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        console.log("Fetched Data:", result);
        setFetchedData(result);
      } catch (error) {
        console.error("Fetch failed:", error);
      }
    };

    fetchData();
  }, []);

  const dataed = fetchedData?.data.length ? fetchedData.data[0].id + 1 : null;

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
  
    try {
      const response = await fetch("/api/Formdata", {
        method: "POST",
        body: JSON.stringify({ ...inputData, items: formData.items }),
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const result = await response.json();
      if (!response.ok) {
        console.error("Error while submitting:", result.error || "Unknown error");
        return;
      }
  
      console.log("Data added successfully:", result.message || "Success");
      setOpen(true); // Open the success dialog
  
      // Reset form and navigate
      setInputData({
        Buyer: "",
        docdate: "",
        vehiclenumber: "",
        gstnumber: "",
        dcnumber: "",
        dcdate: "",
        ordernumber: "",
        orderdate: "",
      });
      setFormData({ items: [] });
  
      // Fetching data ID for routing
      const dataed = result.data.length ? result.data[0].id + 1 : null; // Ensure this logic is correct
      if (dataed) {
        router.push(`/DeliveryChallanPdf/${dataed}`);
      } else {
        console.error("DC Challan number is missing.");
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <div className="h-screen overflow-y-auto w-full p-6 bg-gray-50">
        <div className="grid grid-cols-3 mt-5">
          <h1></h1>
          <h1 className="text-center font-bold text-xl">DC Form</h1>
          <h1 className="text-right text-lg font-bold text-blue-700 mr-1">
            DC NO : <span className="text-red-900 text-2xl">Draft</span>
          </h1>
        </div>

        <div className="grid grid-cols-2 mt-4 gap-4">
          <div>
            <Forminput
              label="Buyer"
              type="textarea"
              name="Buyer"
              value={inputData.Buyer}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <div className="capitalize gap-1 grid grid-cols-3">
              <div>
                <Forminput
                  label="DC Date"
                  type="date"
                  name="docdate"
                  className=""
                  {...register("docdate", { required: "Date is required" })}
                  value={inputData.docdate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Forminput
                  label="     Your Order Number"
                  type="text"
                  className=""
                  name="ordernumber"
                  value={inputData.ordernumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Forminput
                  label="  Your Order Date"
                  type="date"
                  name="orderdate"
                  value={inputData.orderdate}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="grid gap-1 grid-cols-2 mt">
              <div>
                <Forminput
                  label="   Vehicle Number"
                  type="text"
                  name="vehiclenumber"
                  value={inputData.vehiclenumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Forminput
                  label="   GST Number"
                  type="text"
                  name="gstnumber"
                  value={inputData.gstnumber}
                  onChange={handleInputChange}
                />
              </div>

              <Forminput
                label=" Your DC Number"
                type="text"
                name="dcnumber"
                value={inputData.dcnumber}
                onChange={handleInputChange}
              />
              <Forminput
                label=" Your  DC Date"
                type="date"
                name="dcdate"
                value={inputData.dcdate}
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
              {formData.items.map((item, index) => (
                <tr className="border-b">
                  <td className="p-2 w-10 border-r-gray-300">{index + 1}</td>
                  <td className="border-r-gray-300 px-2">
                    {addingNewIndex !== index ? (
                      <select
                        className="border w-52 capitalize h-10 px-2"
                        name="name"
                        value={formData.items[index].name} // Use formData for value
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
                              (suggestion) =>
                                suggestion.name === formData.items[index].name
                            )?.enabled === 0
                              ? "red"
                              : "black",
                        }}
                      >
                        <option value="">Select an item</option>
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
                        <option value="add-new">Add New...</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        className="border w-52 capitalize h-10 px-2 mt-2"
                        placeholder="Enter new item"
                        name="description"
                        value={newItemDescription}
                        onChange={(e) => setNewItemDescription(e.target.value)}
                        onBlur={() => saveCustomValue(index)} // Call saveCustomValue
                      />
                    )}
                    {errors.name && (
                      <p className="text-red-500">{errors.name.message}</p>
                    )}
                  </td>

                  <td className="px-1">
                    {addingNewHsnIndex !== index ? (
                      <select
                        className="border w-52 capitalize h-10 px-2"
                        name="hsn"
                        value={formData.items[index].hsn} // Use formData.items for value
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
                              (suggestion) =>
                                suggestion.name === formData.items[index].hsn
                            )?.enabled === 0
                              ? "red"
                              : "black",
                        }}
                      >
                        <option value="">Select an HSN Code</option>
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
                        <option value="add-new">Add New...</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        className="border w-52 capitalize h-10 px-2 mt-2"
                        placeholder="Enter new HSN Code"
                        name="hsn"
                        value={newHsnCode} // Ensure this is set correctly
                        onChange={(e) => setNewHsnCode(e.target.value)}
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
                    {/* {errors.qty && (
                      <p className="text-red-500">{errors.qty.message}</p>
                    )} */}
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
                      className="w-full border h-14 rounded p-1 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
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
          </table>
          <div className="flex justify-evenly  w-[87%]">
            <p className="font-bold mt-2">Total Number of Qty : </p>
            <span className="  text-right mt-2 pr-5 inline-block">
              {formData.items.reduce(
                (acc, item) => acc + Number(item.qty || 0),
                0
              )}
            </span>
          </div>
        </div>

        <div className="flex justify-center mt-4 gap-4">
          <button
            type="submit"
            className="text-center justify-center cursor-pointer border-2 flex items-center  p-2 w-24 rounded-md bg-blue-500 text-white"
          >
            <img
              src={"./img/save.png"}
              alt=""
              className="w-5 mr-1 h-5 text-white"
            />
            Save
          </button>
        </div>

        <Dialog open={open} onClose={onclose} className="relative">
          <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <DialogPanel className="relative transform overflow-hidden rounded-lg w-1/3 h-1/3 bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all">
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <CheckIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <DialogTitle
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                      id="dialog-title"
                    >
                      DC Challan Number {dataed}
                    </DialogTitle>
                    <div className="mt-2">
                      <p
                        className="text-sm text-gray-500"
                        id="dialog-description"
                      >
                        Saved Successfully!
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      if (dataed) {
                        router.push(`/DeliveryChallanPdf/${dataed}`);
                      } else {
                        console.error("DC Challan number is missing.");
                        // Optionally, show an error message to the user
                      }
                    }}
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

        <Deletedialog
          open={deleteDialogOpen}
          onClose={cancelDelete}
          onDelete={handleDeleteRow}
        />
      </div>
    </form>
  );
}
