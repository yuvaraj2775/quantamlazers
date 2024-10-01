"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { PlusIcon, XMarkIcon ,PlusCircleIcon , BookmarkIcon , ViewfinderCircleIcon } from "@heroicons/react/24/solid";
import { useRouter,useSearchParams } from "next/navigation";
import { CheckIcon } from "@heroicons/react/24/outline";



export default function Page({params}) {
  const [formData, setFormData] = useState({ items: [] ,items1:[] });
  const [fetchedData, setFetchedData] = useState(null);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const searchid = useSearchParams().get("id");
  console.log(formData,"data")

  useEffect(() => {
    const fetchData = async () => {
      if (searchid) {
        try {
          const response = await fetch(`/api/Formdata?id=${searchid}`);
          if (!response.ok) throw new Error("Failed to fetch data");
          const result = await response.json();
          setFormData({
            // ...result.data[0], // Update formData with the fetched data
            items1: result.data ||[],
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    // Check if the input is part of items1
    if (name in formData.items1) {
      setFormData((prev) => ({
        ...prev,
        items1: {
          ...prev.items1,
          [name]: value,
        },
      }));
    } else {
      // Otherwise handle items (this is for your table rows)
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  

  const handleRowChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [name]: value };
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
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = {
      ...formData.items1, // This spreads the fields from items1
      items: formData.items, // Keep the items for the table
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
        setOpen(true);
      } else {
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
        DC NO: <span className="text-red-900 text-lg">{formData.items1?.id}</span>{" "}
      </h1>

      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="capitalize">
          <label htmlFor="buyer" className="text-sm font-semibold">
            Buyer
          </label>
          <textarea
            className="border-2 mt-1 rounded uppercase w-full h-[175px] px-2 -pt-10 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            name="buyer"
            value={formData.items1?.buyer || ""}
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
                value={formData.items1?.dc_date || ""}
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
                value={formData.items1?.ordernumber || ""}
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
                value={formData.items1?.orderdate || ""}
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
                  value={formData.items1?.vehicle_number || ""}
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
                  value={formData.items1?.gst_number || ""}
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
                  value={formData.items1?.dc_number || ""}
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
                  value={formData.items1?.dc_issue_date || ""}
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
              {formData.items?.map((item, i) => (
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
                      <select name="umoremarks" id=""  value={item.umoremarks}
                      onChange={(e) => handleRowChange(i, e)}>
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
            <p className="font-bold mt-2">Total Number of Qty: </p>
            <span className="  text-right mt-2 inline-block">
              {/* {formDatadata.reduce(
                (acc, item) => acc + Number(item.qty || 0),
                0
              )} */}
            </span>
          </div>
        </div>

      <div className="flex justify-center gap-3 mt-5">
        <button
          type="button"
          
          className="text-center cursor-pointer border-2 p-2 w-24 flex items-center justify-center rounded-md bg-green-500 text-white"
        >
          <PlusCircleIcon className="w-4 h-4 mr-1 mt-1" />
          New
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
            router.push("/"); // Navigate to another page
          }}
        >
          <ViewfinderCircleIcon    className="w-4 h-4 mr-1 mt-1" />

          View
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
                    DC challan number {formData.items1?.id}
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
                    router.push(`/DeliveryChallanPdf/${searchid}`); // Navigate to another page
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