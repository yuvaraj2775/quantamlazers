"use client";
import React, { useState, useEffect } from "react";
import swal from 'sweetalert';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';

export default function Page() {
  const [formData, setFormData] = useState({
    buyer: "",
    dc_date: "",
    vehicle_number: "",
    gst_number: "",
    dc_number: "",
    dc_issue_date: "",
    ordernumber:"",
    orderdate:"",
    items: [],
  });

  const [fetchedData, setFetchedData] = useState(null);

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
    updatedItems[index][name] = value;
    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  const handleAddRow = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { name: "", hsn: "", qty: "", umoremarks: "", remarks: "" }],
    }));
  };

  const handleDeleteRow = (index) => {
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);
    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    swal(`Saved successfully`);

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
    <form onSubmit={handleSubmit} className="h-screen capitalize p-6 overflow-y-auto bg-gray-50">
      <h1 className="text-center mt-5 font-bold text-xl text-gray-800">Edit page</h1>
      <h1 className="text-right font-bold text-blue-600">DC NO: <span className="text-red-900">{formData.id}</span> </h1>

      <div className="grid grid-cols-2 gap-4 mt-5">
        <div className="capitalize">
          <label htmlFor="buyer" className="text-sm font-semibold ">Buyer</label>
          <textarea
            type="text"
            className="border-2 mt-1  rounded uppercase w-full h-[175px] px-2 -pt-10 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            name="buyer"
            value={formData.buyer || ""}
            onChange={handleInputChange}
          />
        </div>

        <div className="capitalize">
         <div>
         <label htmlFor="dc_date" className="text-sm font-semibold ">DC Date</label>
          <input
            type="date"
            className="border-2 mt-1 h-10 rounded w-full px-2 shadow-sm  focus:outline-none focus:ring focus:ring-blue-300"
            name="dc_date"
            value={formData.dc_date || ""}
            onChange={handleInputChange}
          />
         </div>
         <div>
         <div>
         <label htmlFor="dc_date" className="text-sm font-semibold ">your order number</label>
          <input
            type="number"
            className="border-2 mt-1 h-10 rounded w-full px-2 shadow-sm  focus:outline-none focus:ring focus:ring-blue-300"
            name="ordernumber"
            value={formData.ordernumber || ""}
            onChange={handleInputChange}
          />
         </div>
         <div>
         <label htmlFor="dc_date" className="text-sm font-semibold ">your order date</label>
          <input
            type="date"
            className="border-2 h-10 rounded mt-1 w-full  px-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            name="orderdate"
            value={formData.orderdate || ""}
            onChange={handleInputChange}
          />
         </div> 

         </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mt-4">
        <div>
          <label htmlFor="vehicle_number" className="text-sm font-semibold  ">Vehicle Number</label>
          <input
            type="text"
            name="vehicle_number"
            value={formData.vehicle_number || ""}
            onChange={handleInputChange}
            className="h-10 w-full border-2 uppercase px-2 mt-1 shadow-sm rounded focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div>
          <label htmlFor="gst_number" className="text-sm font-semibold ">GST Number</label>
          <input
            type="text"
            name="gst_number"
            value={formData.gst_number || ""}
            onChange={handleInputChange}
            className="h-10 w-full border-2 uppercase mt-1 px-2 shadow-sm rounded focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div>
          <label htmlFor="dc_number" className="text-sm font-semibold  ">DC Number</label>
          <input
            type="text"
            name="dc_number"
            value={formData.dc_number || ""}
            onChange={handleInputChange}
            className="h-10 w-full border-2 uppercase px-2 mt-1 shadow-sm rounded focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div>
          <label htmlFor="dc_issue_date" className="text-sm font-semibold ">DC  Date</label>
          <input
            type="date"
            name="dc_issue_date"
            value={formData.dc_issue_date || ""}
            onChange={handleInputChange}
            className="h-10 w-full border-2 mt-1 px-2 shadow-sm rounded focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
      </div>

      <div className="border-2 border-gray-300 mt-5 rounded-lg overflow-hidden shadow-sm">
  <table className="w-full">
    <thead className="bg-gray-200 font-semibold">
      <tr className="font-normal">
        <th className="p-2 border-2 border-r-gray-300">Sl. No</th>
        <th className="p-2 border-2 border-r-gray-300">Item Name / Description</th>
        <th className="p-2 border-2 border-r-gray-300">HSN Code</th>
        <th className="p-2 border-2 border-r-gray-300 ">Qty</th>
        <th className="p-2 border-2 border-r-gray-300">UMO</th>
        <th className="p-2 border-2 border-r-gray-300">Remarks</th>
        <th className="p-2 ">Actions</th>
      </tr>
    </thead>
    <tbody>
      {formData.items.map((item, i) => (
        <tr key={i} className="border-b">
          <td className="p-2  border-2 border-r-gray-300 ">{i + 1}</td>
          <td className="border-r-gray-300 border-2 px-2">
            <input
              type="text"
              name="name"
              value={item.name}
              onChange={(e) => handleRowChange(i, e)}
              placeholder="Name"
              className="w-full border border-r-gray-300 uppercase rounded p-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            />
          </td>
          <td className="border-r-gray-300 border-2 px-2">
            <input
              type="text"
              name="hsn"
              value={item.hsn}
              onChange={(e) => handleRowChange(i, e)}
              placeholder="HSN"
              className="w-full border uppercase rounded p-1 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            />
          </td>
          <td className="border-r-gray-300 border-2 px-2">
            <input
              type="number"
              name="QTY"
              value={item.qty}
              onChange={(e) => handleRowChange(i, e)}
              placeholder="Qty"
              className="w-full text-right border rounded p-1 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            />
          </td>
          <td className="border-r-gray-300 border-2 px-2">
            <input
              type="text"
              name="umoremarks"
              value={item.umoremarks}
              onChange={(e) => handleRowChange(i, e)}
              placeholder="UMO"
              className="w-full border uppercase rounded p-1 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            />
          </td>
          <td className="border-r-gray-300 border-2 px-2">
            <input
              type="text"
              name="remarks"
              value={item.remarks}
              onChange={(e) => handleRowChange(i, e)}
              placeholder="Remarks"
              className="w-full border uppercase rounded p-1 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            />
          </td>
          <td className="flex justify-center items-center border-b-2 border-gray-300 space-x-2 p-2">
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
  <div className="flex justify-evenly w-3/4">
      <p className="font-bold mt-2 ">
    Total Number of Qty:{" "}
    
  </p>
  <span className="-ml-16 font-bold mt-2"> {formData.items.reduce((acc, item) => acc + Number(item.qty || 0), 0)}</span>

  </div>

</div>


      <div className="flex justify-center mt-5">
        <button
          type="submit"
          className="p-2 border-2 rounded-md bg-green-400 text-white hover:bg-green-500 transition"
        >
          Save
        </button>
      </div>
    </form>
  );
}
