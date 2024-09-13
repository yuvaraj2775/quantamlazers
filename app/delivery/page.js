"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";


export default function Page() {
  const [formData, setFormData] = useState({
    items: [],
  });

  const [inputData, setInputData] = useState({
    Buyer: "",
    docdate: "",
    vehiclenumber: "",
    gstnumber: "",
    dcnumber: "",
    dcdate: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/Formdata", {
        method: "POST",
        body: JSON.stringify(inputData),
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
        });
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  const handlefetch = async () => {
    const response = await fetch("/api/Formdata");
    const result = await response.json();
    console.log("result", result);
  };

  const router =useRouter();
  const handleClick = () => {
   
    router.push('/deliverypg');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="h-screen w-screen p-4">
        <h1 className="text-center mt-5 font-bold text-xl">DC Form</h1>

        <div className="grid grid-cols-2">
          <div className="capitalize">
            <label htmlFor="Buyer">Buyer</label>
            <input
              type="text"
              className="border-2 rounded h-32 w-full"
              name="Buyer"
              value={inputData.Buyer}
              onChange={handleInputChange}
            />
          </div>

          <div className="capitalize ml-3">
            <label htmlFor="docdate">DC date</label>
            <input
              type="date"
              className="px-2 border-2 h-10 rounded w-full"
              name="docdate"
              value={inputData.docdate}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-4 capitalize">
          <div>
            <label htmlFor="vehiclenumber">Vehicle Number</label>
            <input
              type="text"
              name="vehiclenumber"
              value={inputData.vehiclenumber}
              onChange={handleInputChange}
              className="h-10 w-full border-2"
            />
          </div>
          <div>
            <label htmlFor="gstnumber">GST Number</label>
            <input
              type="text"
              name="gstnumber"
              value={inputData.gstnumber}
              onChange={handleInputChange}
              className="h-10 w-full border-2"
            />
          </div>
          <div>
            <label htmlFor="dcnumber">DC Number</label>
            <input
              type="text"
              name="dcnumber"
              value={inputData.dcnumber}
              onChange={handleInputChange}
              className="h-10 w-full border-2"
            />
          </div>
          <div>
            <label htmlFor="dcdate">DC Date</label>
            <input
              type="text"
              name="dcdate"
              value={inputData.dcdate}
              onChange={handleInputChange}
              className="h-10 w-full border-2"
            />
          </div>
        </div>

        <div className="capitalize border-2 mt-5">
          <table className="w-full">
            <thead>
              <tr className="border-b-2">
                <th className="w-32">Sl. No</th>
                <th className="w-32 border-l-2">Item Name / Description</th>
                <th className="w-32 border-l-2">HSN Code</th>
                <th className="w-32 border-l-2">Qty</th>
                <th className="w-32 border-l-2">UMO</th>
                <th className="w-32 border-l-2">Remarks</th>
                <th className="w-32 border-l-2"></th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <input
                      type="text"
                      name="name"
                      value={item.name}
                      onChange={(e) => handleRowChange(index, e)}
                      placeholder="Name"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="hsn"
                      value={item.hsn}
                      onChange={(e) => handleRowChange(index, e)}
                      placeholder="HSN"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="qty"
                      value={item.qty}
                      onChange={(e) => handleRowChange(index, e)}
                      placeholder="Qty"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="umoremarks"
                      value={item.umoremarks}
                      onChange={(e) => handleRowChange(index, e)}
                      placeholder="UMO / Remarks"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="remarks"
                      value={item.remarks}
                      onChange={(e) => handleRowChange(index, e)}
                      placeholder="Remarks"
                    />
                  </td>
                  <td>
                    <button type="button" onClick={() => handleDeleteRow(index)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="7">
                  <button type="button" onClick={handleAddRow}>
                    Add
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <p className="font-bold">
            Total Number of Qty: {formData.items.reduce((acc, item) => acc + Number(item.qty || 0), 0)}
          </p>
        </div>

        <div className="flex justify-center mt-4">
          <div  onClick={handleClick} className="text-center cursor-pointer border-2 p-2 w-14 rounded-md bg-green-500 text-white">
            <button type="submit">Save</button>
          </div>
          <div onClick={handlefetch} className="text-center cursor-pointer border-2 p-2 w-14 rounded-md bg-green-500 text-white">
            <button type="button">Fetch</button>
          </div>
        </div>
      </div>
    </form>
  );
}
