"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import swal from 'sweetalert';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';

export default function Page() {
  const [formData, setFormData] = useState({ items: [] });
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
          umoremarks: "",
          remarks: "",
        },
      ],
    }));
  };

  const handleRowChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [name]: value };
    setFormData({ items: newItems });
  };

  const handleDeleteRow = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ items: newItems });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      } else {
        console.log("Data added successfully:", result.message || "Success");
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

        // Show alert for quotation ID
        if (fetchedData?.data.length) {
          swal(`Your quotation ID is ${fetchedData.data[0].id + 1}`);
        }
        router.push("/viewpg");
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="h-screen overflow-y-auto w-full p-6  bg-gray-50">
        <h1 className="text-center mt-5 font-bold text-xl">DC Form</h1>
        <h1  className="text-right mt-5 font-bold text-blue-700 ">DC NO : <span className="text-red-900">Draft</span> </h1>

        <div className="grid grid-cols-2 gap-4">
          <div className="capitalize">
            <label htmlFor="Buyer" className="text-sm font-semibold">Buyer</label>
            <textarea
              type="text"
              className="border-2 rounded mt-1 uppercase  w-full h-[175px] px-2 -pt-10 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
              name="Buyer"
              value={inputData.Buyer}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="capitalize">
            <label htmlFor="docdate" className="text-sm font-semibold">DC Date</label>
            <input
              type="date"
              className="border-2 mt-1 h-10 rounded w-full px-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
              name="docdate"
              value={inputData.docdate}
              onChange={handleInputChange}
            />
            <div>
              <label htmlFor="ordernumber" className="text-sm font-semibold">Your Order Number</label>
              <input
                type="number"
                name="ordernumber"
                value={inputData.ordernumber}
                onChange={handleInputChange}
                className="border-2 h-10 rounded mt-1 w-full px-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
              />
              <label htmlFor="orderdate" className="text-sm font-semibold">Your Order Date</label>
              <input
                type="date"
                name="orderdate"
                value={inputData.orderdate}
                onChange={handleInputChange}
                className="border-2 h-10 mt-1 rounded w-full px-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-4">
          <div>
            <label htmlFor="vehiclenumber" className="text-sm font-semibold">Vehicle Number</label>
            <input
              type="text"
              name="vehiclenumber"
              value={inputData.vehiclenumber}
              onChange={handleInputChange}
              className="h-10 w-full uppercase border-2 mt-1 rounded px-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <div>
            <label htmlFor="gstnumber" className="text-sm font-semibold">GST Number</label>
            <input
              type="text"
              name="gstnumber"
              value={inputData.gstnumber}
              onChange={handleInputChange}
              className="h-10 w-full uppercase border-2 rounded px-2 mt-1 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label htmlFor="dcnumber" className="text-sm font-semibold">DC Number</label>
            <input
              type="text"
              name="dcnumber"
              value={inputData.dcnumber}
              onChange={handleInputChange}
              className="h-10 w-full border-2 uppercase rounded px-2 mt-1 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label htmlFor="dcdate" className="text-sm font-semibold">DC Date</label>
            <input
              type="date"
              name="dcdate"
              value={inputData.dcdate}
              onChange={handleInputChange}
              className="h-10 w-full border-2 px-2 mt-1 rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
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
              className="w-full border uppercase border-r-gray-300  rounded p-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
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
              name="qty"
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
     
       <button
              type="button"
              onClick={handleAddRow}
              className="flex items-center justify-center w-8 h-8 text-green-700 bg-green-100 rounded-full hover:bg-green-200 transition"
              title="Add Row"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
    </tbody>
  </table>
  <div className="flex justify-evenly w-3/4">
      <p className="font-bold mt-2 ">
    Total Number of Qty:{" "}
    
  </p>
  <span className="-ml-16 font-bold mt-2"> {formData.items.reduce((acc, item) => acc + Number(item.qty || 0), 0)}</span>

  </div>

</div>

        <div className="flex justify-center mt-4 gap-4">
          <button
            type="submit"
            className="text-center cursor-pointer border-2 p-2 w-24 rounded-md bg-blue-500 text-white"
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
}
