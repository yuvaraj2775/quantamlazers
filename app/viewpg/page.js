"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import {
  PlusIcon,
  XMarkIcon,
  PlusCircleIcon,
  BookmarkIcon,
  ViewfinderCircleIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { CheckIcon } from "@heroicons/react/24/outline";

export default function Page() {
  const [formData, setFormData] = useState({
    buyer: "",
    dc_date: "",
    vehicle_number: "",
    gst_number: "",
    dc_number: "",
    dc_issue_date: "",
    ordernumber: "",
    orderdate: "",
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

  const [fetchedData, setFetchedData] = useState(null);
  const router = useRouter();
  const [open, setOpen] = useState(false); // Dialog initially closed
  const nextpage = () => {
    router.push("/delivery");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/Formdata");
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        setFetchedData(result);

        if (result.data && result.data.length > 0) {
          setFormData({
            ...formData,
            ...result.data[0],
            items: result.data2,
          });
        }
      } catch (error) {
        console.error("Fetch failed:", error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleAddRow = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { name: "", hsn: "", qty: "", umoremarks: "NOS", remarks: "" },
      ],
    }));
  };

  const handleDeleteRow = (index) => {
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);
    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = {
      ...formData,
      quotation_id: fetchedData?.data?.[0]?.id || null,
    };

    try {
      const response = await fetch("/api/Formdata", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formDataToSend),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Update successful:", result);
        setOpen(true); // Open the dialog on successful submission
      } else {
        const errorData = await response.json();
        console.error("Update failed:", errorData);
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="h-screen capitalize p-6 overflow-y-auto bg-gray-50"
    >
      <h1 className="text-center mt-5 font-bold text-xl text-gray-800">
        Edit page
      </h1>
      <h1 className="text-right mt-5 font-bold text-blue-600 mr-1">
        DC NO: <span className="text-red-900 text-lg">{formData.id}</span>{" "}
      </h1>

      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="capitalize">
          <label htmlFor="buyer" className="text-sm font-semibold">
            Buyer
          </label>
          <textarea
            className="border-2 mt-1 rounded uppercase w-full h-[175px] px-2 -pt-10 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            name="buyer"
            value={formData.buyer || ""}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <div className="capitalize grid grid-cols-3">
            <div>
              <label htmlFor="dc_date" className="text-sm font-semibold">
                DC Date
              </label>
              <input
                type="date"
                className="border-2 mt-1 h-10 rounded w-full px-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                name="dc_date"
                value={formData.dc_date || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="mx-1">
              <label htmlFor="ordernumber" className="text-sm font-semibold">
                Your Order Number
              </label>
              <input
                type="text"
                className="border-2 mt-1 h-10 rounded w-full px-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                name="ordernumber"
                value={formData.ordernumber || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="orderdate" className="text-sm font-semibold">
                Your Order Date
              </label>
              <input
                type="date"
                className="border-2 h-10 rounded mt-1 w-full px-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                name="orderdate"
                value={formData.orderdate || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div>
            <div className="grid grid-cols-2">
              <div className="mr-1">
                <label
                  htmlFor="vehicle_number"
                  className="text-sm font-semibold"
                >
                  Vehicle Number
                </label>
                <input
                  type="text"
                  name="vehicle_number"
                  value={formData.vehicle_number || ""}
                  onChange={handleInputChange}
                  className="h-10 w-full border-2 uppercase px-2 mt-1 shadow-sm rounded focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
              <div>
                <label htmlFor="gst_number" className="text-sm font-semibold">
                  GST Number
                </label>
                <input
                  type="text"
                  name="gst_number"
                  value={formData.gst_number || ""}
                  onChange={handleInputChange}
                  className="h-10 w-full border-2 uppercase mt-1 px-2 shadow-sm rounded focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
              <div className="mr-1">
                <label htmlFor="dc_number" className="text-sm font-semibold">
                  Your DC Number
                </label>
                <input
                  type="text"
                  name="dc_number"
                  value={formData.dc_number || ""}
                  onChange={handleInputChange}
                  className="h-10 w-full border-2 uppercase px-2 mt-1 shadow-sm rounded focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
              <div>
                <label
                  htmlFor="dc_issue_date"
                  className="text-sm font-semibold"
                >
                  Your DC Date
                </label>
                <input
                  type="date"
                  name="dc_issue_date"
                  value={formData.dc_issue_date || ""}
                  onChange={handleInputChange}
                  className="h-10 w-full border-2 mt-1 px-2 shadow-sm rounded focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-2 border-gray-300 mt-5 rounded-lg overflow-x-auto shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-200 font-semibold">
            <tr className="font-normal">
              <th className="p-1 border-2 border-r-gray-300">Sl. No</th>
              <th className=" border-2 w-40 border-r-gray-300">
                Item Name / <br />
                Description
              </th>
              <th className="p-1 border-2 border-r-gray-300">HSN Code</th>
              <th className="p-2 border-2 border-r-gray-300">Qty</th>
              <th className="p-2 border-2 border-r-gray-300">UMO</th>
              <th className="p-2 border-2 border-r-gray-300">Remarks</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {formData.items.map((item, i) => (
              <tr key={i} className="border-b">
                <td className="p-2 border-2 w-10 border-r-gray-300">{i + 1}</td>
                <td className="border-r-gray-300 border-2  px-2">
                  <input
                    type="text"
                    name="name"
                    value={item.name}
                    onChange={(e) => handleRowChange(i, e)}
                    placeholder="Name"
                    className="w-64 border h-10  border-r-gray-300 rounded p-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                  />
                </td>
                <td className="border-r-gray-300 border-2 px-1">
                  <input
                    type="text"
                    name="hsn"
                    value={item.hsn}
                    onChange={(e) => handleRowChange(i, e)}
                    placeholder="HSN"
                    className="w-28 border  rounded p-1 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                  />
                </td>
                <td className="border-r-gray-300 border-2 px-2">
                  <input
                    type="number"
                    name="qty"
                    value={item.qty}
                    onChange={(e) => handleRowChange(i, e)}
                    placeholder="Qty"
                    className="w-20 text-right border rounded p-1 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                  />
                  {/* <select name="qty" id=""  onChange={(e) => handleRowChange(i, e)}>
                      <option value="NOS">NOS</option>
                      <option value="EACH">EACH</option>
                      <option value="SET">SET</option>
                    </select> */}
                </td>
                <td className="border-r-gray-300 border-2 px-2">
                  {/* <input
                      type="text"
                      name="umoremarks"
                      value={item.umoremarks}
                      onChange={(e) => handleRowChange(i, e)}
                      placeholder="UMO"
                      className="w-full border capitalize rounded p-1 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                    /> */}
                  <select
                    name="umoremarks"
                    id=""
                    value={item.umoremarks}
                    onChange={(e) => handleRowChange(i, e)}
                  >
                    <option value="NOS">NOS</option>
                    <option value="EACH">EACH</option>
                    <option value="SET">SET</option>
                  </select>
                </td>
                <td className="border-r-gray-300 border-2 px-2">
                  <textarea
                    type="text"
                    name="remarks"
                    value={item.remarks}
                    onChange={(e) => handleRowChange(i, e)}
                    placeholder="Remarks"
                    className="w-[230px] border h-14  rounded p-1 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                  />
                </td>
                <td className="flex justify-center items-center mt-3  border-gray-300 space-x-2 px-2">
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
                    onClick={() => handleDeleteRow(i)}
                    className="flex items-center justify-center w-8 h-8 text-red-900 bg-red-100 rounded-full hover:bg-red-200 transition"
                    title="Delete Row"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-evenly  w-[70%]">
          <p className="font-bold mt-2">Total Number of Qty : </p>
          <span className="  text-right mt-2 inline-block">
            {formData.items.reduce(
              (acc, item) => acc + Number(item.qty || 0),
              0
            )}
          </span>
        </div>
      </div>

      <div className="flex justify-center gap-3 mt-5">
        <button
          type="button"
          onClick={nextpage}
          className="text-center cursor-pointer border-2 p-2 w-24 flex items-center justify-center rounded-md bg-green-500 text-white"
        >
          <PlusCircleIcon className="w-4 h-4 mr-1 mt-1" />
          new
        </button>
        <button
          type="submit"
          className="text-center cursor-pointer border-2 p-2 w-24 flex items-center justify-center rounded-md bg-blue-500 text-white"
        >
          <BookmarkIcon className="w-4 h-4 mr-1 " />
          Save
        </button>
        <button
          type="button"
          className="text-center cursor-pointer border-2 p-2 w-24  flex items-center justify-center rounded-md bg-gray-500 text-white"
          onClick={() => {
            router.push("/deliverypg"); // Navigate to another page
          }}
        >
          <ViewfinderCircleIcon className="w-4 h-4 mr-1 mt-1" />
          view
        </button>
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} className="relative ">
        <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel className="relative transform overflow-hidden rounded-lg w-1/3 h-1/3 bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all">
              <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <CheckIcon
                    aria-hidden="true"
                    className="h-6 w-6 text-green-600"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold leading-6 text-gray-900"
                  >
                    DC challan number {formData.id}
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">saved successfully!</p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    router.push("/deliverypg"); // Navigate to another page
                  }}
                  className="inline-flex w-full justify-center "
                >
                  <span className=" bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 rounded-md">
                    {" "}
                    Done
                  </span>
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </form>
  );
}
