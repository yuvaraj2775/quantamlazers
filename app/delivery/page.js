"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import swal from 'sweetalert';


export default function Page() {
  const [formData, setFormData] = useState({ items: [] });
  const [inputData, setInputData] = useState({
    Buyer: "",
    docdate: "",
    vehiclenumber: "",
    gstnumber: "",
    dcnumber: "",
    dcdate: "",
    items: [
      {
        id: "",
        name: "",
        hsn: "",
        qty: "",
        umoremarks: "",
        remarks: "",
      },
    ],
  });

  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData((prev) => ({ ...prev, [name]: value, items: formData }));
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
    setInputData((prev) => ({ ...prev, items: formData }));
  };

  const handleDeleteRow = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ items: newItems });
  };

  const [fetchedData, setFetchedData] = useState(null);

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

    function handlechange(){
      {fetchedData?.data.map((item) => (
       
          swal(`Your quotation ID is ${item.id + 1}`)
         ))}
  }

  

  const handleSubmit = async (e) => {
    console.log(inputData, "heloo");
    console.log("bye", formData);
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
        console.error(
          "Error while submitting:",
          result.error || "Unknown error"
        );
      } else {
        console.log("Data added successfully:", result.message || "Success");
        setInputData({
          Buyer: "",
          docdate: "",
          vehiclenumber: "",
          gstnumber: "",
          dcnumber: "",
          dcdate: "",
         
          table: [
            {
              id: "",
              name: "",
              hsn: "",
              qty: "",
              umoremarks: "",
              remarks: "",
            },
          ],
        });
        setFormData({ items: [] });
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  const handlefetch = async () => {
    try {
      const response = await fetch("/api/Formdata");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result = await response.json();
      console.log("Fetched data:", result);
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };

  const router = useRouter();
  const handleClick = () => {
    router.push("/deliverypg");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="h-screen w-full p-4">
     
        <h1 className="text-center mt-5 font-bold text-xl">DC Form</h1>

        <div className="grid grid-cols-2 gap-4">
          <div className="capitalize">
            <label htmlFor="Buyer">Buyer</label>
            <input
              type="text"
              className="border-2 rounded h-10 w-full"
              name="Buyer"
              value={inputData.Buyer}
              onChange={handleInputChange}
            />
          </div>

          <div className="capitalize">
            <label htmlFor="docdate">DC Date</label>
            <input
              type="date"
              className="px-2 border-2 h-10 rounded w-full"
              name="docdate"
              value={inputData.docdate}
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
              value={inputData.vehiclenumber}
              onChange={handleInputChange}
              className="h-10 w-full rounded border-2"
            />
          </div>
          <div>
            <label htmlFor="gstnumber">GST Number</label>
            <input
              type="text"
              name="gstnumber"
              value={inputData.gstnumber}
              onChange={handleInputChange}
              className="h-10 rounded w-full border-2"
            />
          </div>
          <div>
            <label htmlFor="dcnumber">DC Number</label>
            <input
              type="text"
              name="dcnumber"
              value={inputData.dcnumber}
              onChange={handleInputChange}
              className="h-10 rounded w-full border-2"
            />
          </div>
          <div>
            <label htmlFor="dcdate">DC Date</label>
            <input
              type="text"
              name="dcdate"
              value={inputData.dcdate}
              onChange={handleInputChange}
              className="h-10 rounded w-full border-2"
            />
          </div>
        </div>

        <div className="capitalize rounded-md border-2 mt-5">
          <table className="w-full">
            <thead>
              <tr className=" rounded-md border-b-2">
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
                      className="w-full border-2 rounded p-1"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="hsn"
                      value={item.hsn}
                      onChange={(e) => handleRowChange(index, e)}
                      placeholder="HSN"
                      className="w-full border-2 rounded p-1"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="qty"
                      value={item.qty}
                      onChange={(e) => handleRowChange(index, e)}
                      placeholder="Qty"
                      className="w-full border-2 rounded p-1"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="umoremarks"
                      value={item.umoremarks}
                      onChange={(e) => handleRowChange(index, e)}
                      placeholder="UMO "
                      className="w-full border-2 rounded p-1"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="remarks"
                      value={item.remarks}
                      onChange={(e) => handleRowChange(index, e)}
                      placeholder="Remarks"
                      className="w-full border-2 rounded p-1"
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleDeleteRow(index)}
                      className="text-red-500"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="">
                  <button
                    type="button"
                    onClick={handleAddRow}
                    className="text-green-500 ml-5"
                  >
                    Add
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <p className="font-bold mt-2 ml-32">
            Total Number of Qty:{" "}
            {formData.items.reduce(
              (acc, item) => acc + Number(item.qty || 0),
              0
            )}
          </p>
        </div>

        <div className="flex justify-center mt-4 gap-4">
          <button 
            type="submit"
            className="text-center cursor-pointer border-2 p-2 w-24 rounded-md bg-green-500 text-white"
            onClick={handlechange}
          >
            Save
          </button>
         
          <button
            type="button"
            onClick={handlefetch}
            oncl
            className="text-center cursor-pointer border-2 p-2 w-24 rounded-md bg-green-500 text-white"
          >
            view
          </button>
          <button
            type="button"
            onClick={handleClick}
            className="text-center cursor-pointer border-2 p-2 w-24 rounded-md bg-blue-500 text-white"
          >
            Go to Delivery
          </button>
        </div>
      </div>
    </form>
  );
}
