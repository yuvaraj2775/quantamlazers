"use client";
import React, { useState, useEffect } from "react";

export default function Page() {
  const [fetchedData, setFetchedData] = useState(null);
  const [formData, setFormData] = useState({
    items: [],
  });

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
        setFormData({ items: result.data });
      } catch (error) {
        console.error("Fetch failed:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRowChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.items];
    updatedItems[index][name] = value;
    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
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
    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    // You can send the data to the API here.
  };

  return (
    <form onSubmit={handleSubmit}>
      {fetchedData?.data.map((item, index) => (
        <div className="h-screen w-full p-4" key={index}>
          <h1 className="text-center mt-5 font-bold text-xl">DC Form</h1>

          <div className="grid grid-cols-2 gap-4">
            <div className="capitalize">
              <label htmlFor="Buyer">Buyer</label>
              <input
                type="text"
                className="border-2 rounded h-10 w-full"
                name="Buyer"
                value={item.buyer}
                onChange={handleInputChange}
              />
            </div>

            <div className="capitalize">
              <label htmlFor="docdate">DC Date</label>
              <input
                type="date"
                className="px-2 border-2 h-10 rounded w-full"
                name="docdate"
                value={item.dc_date}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-4">
            <div>
              <label htmlFor="vehiclenumber">Vehicle Number</label>
              <input
                type="text"
                name="vehiclenumber"
                value={item.vehicle_number}
                onChange={handleInputChange}
                className="h-10 w-full border-2"
              />
            </div>
            <div>
              <label htmlFor="gstnumber">GST Number</label>
              <input
                type="text"
                name="gstnumber"
                value={item.gst_number}
                onChange={handleInputChange}
                className="h-10 w-full border-2"
              />
            </div>
            <div>
              <label htmlFor="dcnumber">DC Number</label>
              <input
                type="text"
                name="dcnumber"
                value={item.dc_number}
                onChange={handleInputChange}
                className="h-10 w-full border-2"
              />
            </div>
            <div>
              <label htmlFor="dcdate">DC Date</label>
              <input
                type="text"
                name="dcdate"
                value={item.dc_date}
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

              { formData.items.map((e, i) => (
                <tbody key={i}>
                  <tr>
                    <td>{i + 1}</td>
                    <td>
                      <input
                        type="text"
                        name="name"
                        value={e.name}
                        onChange={(e) => handleRowChange(i, e)}
                        placeholder="Name"
                        className="w-full border-2 rounded p-1"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="hsn"
                        value={e.hsn}
                        onChange={(e) => handleRowChange(i, e)}
                        placeholder="HSN"
                        className="w-full border-2 rounded p-1"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="qty"
                        value={e.qty}
                        onChange={(e) => handleRowChange(i, e)}
                        placeholder="Qty"
                        className="w-full border-2 rounded p-1"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="umoremarks"
                        value={e.umoremarks}
                        onChange={(e) => handleRowChange(i, e)}
                        placeholder="UMO "
                        className="w-full border-2 rounded p-1"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="remarks"
                        value={e.remarks}
                        onChange={(e) => handleRowChange(i, e)}
                        placeholder="Remarks"
                        className="w-full border-2 rounded p-1"
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleDeleteRow(i)}
                        className="text-red-500"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              ))}
            </table>
            <p className="font-bold mt-2">
              Total Number of Qty:{" "}
              {formData.items.reduce(
                (acc, item) => acc + Number(item.qty || 0),
                0
              )}
            </p>
          </div>
        </div>
      ))}
    </form>
  );
}
