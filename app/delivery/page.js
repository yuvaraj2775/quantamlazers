"use client";
import { Textarea } from "@headlessui/react";
import React, { useState } from "react";

export default function Page() {
  const [data, setData] = useState([]);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    hsn: "",
    qty: "",
    umoremarks: "",
  });

  const [inputData, setInputData] = useState({
    Buyer: "",
    docdate: "",
    ordername: "",
    orderdate: "",
    vehiclenumber: "",
    gstnumber: "",
    dcnumber: "",
    dcdate: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddRow = (e) => {
    e.preventDefault();
    const { id, name, hsn, qty, umoremarks } = formData;
    if (id && name && hsn && qty && umoremarks) {
      const newRow = {
        id: parseInt(id),
        name,
        hsn,
        qty: parseInt(qty),
        umoremarks,
      };
      setData((prev) => [...prev, newRow]);

      setFormData({
        id: "",
        name: "",
        hsn: "",
        qty: "",
        umoremarks: "",
      });
    }
  };

  const deleteItem = (indexToDelete) => {
    const updatedItems = [
      ...formData.slice(0, indexToDelete),
      ...formData.slice(indexToDelete + 1),
    ];
    setItems(updatedItems);
  };

  const handleChange = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior

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
        console.error(
          "Error while submitting:",
          result.error || "Unknown error"
        );
      } else {
        console.log("Data added successfully:", result.message || "Success");
        // Reset the form data only if submission is successful
        setInputData({
          Buyer: "",
          docdate: "",
          ordername: "",
          orderdate: "",
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
    const result = await response.json()
    console.log("result",result)
  };
  const changing = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <form onSubmit={handleChange}>
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
                onChange={changing}
              />
            </div>

            <div className="capitalize ml-3">
              <label htmlFor="docdate">DC date</label>
              <input
                type="date"
                className="px-2 border-2 h-10 rounded w-full"
                name="docdate"
                value={inputData.docdate}
                onChange={changing}
              />
              <div className="grid grid-cols-2">
                <div>
                  <label htmlFor="ordername">Order Number</label>
                  <input
                    type="text"
                    className="border-2 h-10 rounded w-full"
                    name="ordername"
                    value={inputData.ordername}
                    onChange={changing}
                  />
                </div>
                <div className="ml-2">
                  <label htmlFor="orderdate">Order Date</label>
                  <input
                    type="date"
                    className="px-2 border-2 rounded h-10 w-full"
                    name="orderdate"
                    value={inputData.orderdate}
                    onChange={changing}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 capitalize">
            <div>
              <label htmlFor="vehiclenumber">Vehicle Number</label>
              <input
                type="text"
                name="vehiclenumber"
                value={inputData.vehiclenumber}
                onChange={changing}
                className="h-10 w-full border-2"
              />
            </div>
            <div>
              <label htmlFor="gstnumber">GST Number</label>
              <input
                type="text"
                name="gstnumber"
                value={inputData.gstnumber}
                onChange={changing}
                className="h-10 w-full border-2"
              />
            </div>
            <div>
              <label htmlFor="dcnumber">DC Number</label>
              <input
                type="text"
                name="dcnumber"
                value={inputData.dcnumber}
                onChange={changing}
                className="h-10 w-full border-2"
              />
            </div>
            <div>
              <label htmlFor="dcdate">DC Date</label>
              <input
                type="text"
                name="dcdate"
                value={inputData.dcdate}
                onChange={changing}
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
                  <th className="w-32 border-l-2">UMO / Remarks</th>
                  <th className="w-32 border-l-2"></th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index}>
                    <td>{row.id}</td>
                    <td>{row.name}</td>
                    <td>{row.hsn}</td>
                    <td>{row.qty}</td>
                    <td>{row.umoremarks}</td>
                  </tr>
                ))}
                <tr>
                  <td>
                    <input
                      type="number"
                      name="id"
                      value={formData.id}
                      onChange={handleInputChange}
                      placeholder="ID"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Name"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="hsn"
                      value={formData.hsn}
                      onChange={handleInputChange}
                      placeholder="HSN"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="qty"
                      value={formData.qty}
                      onChange={handleInputChange}
                      placeholder="Qty"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="umoremarks"
                      value={formData.umoremarks}
                      onChange={handleInputChange}
                      placeholder="UMO / Remarks"
                    />
                  </td>
                  <td>
                    <button onClick={handleAddRow}>Add</button>
                  </td>
                  <td>
                    <button onClick={deleteItem}>delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="font-bold">
              Total Number of Qty: {data.reduce((acc, row) => acc + row.qty, 0)}
            </p>
          </div>

          <div className="flex justify-center mt-4">
            <div className="text-center cursor-pointer border-2 p-2 w-14 rounded-md bg-green-500 text-white">
              <button type="submit">Save</button>
            </div>
            <div onClick={handlefetch} className="text-center cursor-pointer border-2 p-2 w-14 rounded-md bg-green-500 text-white">
              <button type="button">fetch</button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
