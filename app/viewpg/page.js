"use client";
import React, { useState, useEffect } from "react";

export default function Page() {
    const [formData, setFormData] = useState({
        buyer: '',
        dc_date: '',
        vehicle_number: '',
        gst_number: '',
        dc_number: '',
        dc_issue_date: '',
        items: [],
    });

    const [fetchedData, setFetchedData] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
          try {
              const response = await fetch('/api/Formdata');
              if (!response.ok) {
                  throw new Error('Failed to fetch data');
              }
              const result = await response.json();
              setFetchedData(result);
              console.log('Fetched data:', result); // Log fetched data
  
              // Initialize formData with fetched data
              if (result.data && result.data.length > 0) {
                  setFormData({
                      ...formData,
                      ...result.data[0],
                      items: result.data2,
                  });
              }
          } catch (error) {
              console.error('Fetch failed:', error);
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
            items: [
                ...prev.items,
                { name: '', hsn: '', qty: '', umoremarks: '', remarks: '' },
            ],
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form Data Submitted:', formData);

        const formDataToSend = {
          ...formData,
          quotation_id: fetchedData?.data?.[0]?.id || null, // Adjust as needed based on the structure
      };
      

        try {
            const response = await fetch("/api/Formdata", {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formDataToSend),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Update successful:', result);
                // Optionally refresh data
              
            } else {
                const errorData = await response.json();
                console.error('Update failed:', errorData);
                throw new Error('Update failed');
            }
        } catch (error) {
            console.error('Error during submission:', error);
            // Handle errors appropriately
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="h-screen overflow-y-auto w-full p-4">
                <h1 className="text-center mt-5 font-bold text-xl">DC Form</h1>

                <div className="grid grid-cols-2 gap-4">
                    <div className="capitalize">
                        <label htmlFor="buyer">Buyer</label>
                        <input
                            type="text"
                            className="border-2 rounded h-10 w-full"
                            name="buyer"
                            value={formData.buyer || ""}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="capitalize">
                        <label htmlFor="dc_date">DC Date</label>
                        <input
                            type="date"
                            className="px-2 border-2 h-10 rounded w-full"
                            name="dc_date"
                            value={formData.dc_date || ""}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mt-4">
                    <div>
                        <label htmlFor="vehicle_number">Vehicle Number</label>
                        <input
                            type="text"
                            name="vehicle_number"
                            value={formData.vehicle_number || ""}
                            onChange={handleInputChange}
                            className="h-10 w-full border-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="gst_number">GST Number</label>
                        <input
                            type="text"
                            name="gst_number"
                            value={formData.gst_number || ""}
                            onChange={handleInputChange}
                            className="h-10 w-full border-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="dc_number">DC Number</label>
                        <input
                            type="text"
                            name="dc_number"
                            value={formData.dc_number || ""}
                            onChange={handleInputChange}
                            className="h-10 w-full border-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="dc_issue_date">DC Issue Date</label>
                        <input
                            type="text"
                            name="dc_issue_date"
                            value={formData.dc_issue_date || ""}
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
                            {formData.items.map((item, i) => (
                                <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>
                                        <input
                                            type="text"
                                            name="name"
                                            value={item.name}
                                            onChange={(e) => handleRowChange(i, e)}
                                            placeholder="Name"
                                            className="w-full border-2 rounded p-1"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            name="hsn"
                                            value={item.hsn}
                                            onChange={(e) => handleRowChange(i, e)}
                                            placeholder="HSN"
                                            className="w-full border-2 rounded p-1"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            name="qty"
                                            value={item.qty}
                                            onChange={(e) => handleRowChange(i, e)}
                                            placeholder="Qty"
                                            className="w-full border-2 rounded p-1"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            name="umoremarks"
                                            value={item.umoremarks}
                                            onChange={(e) => handleRowChange(i, e)}
                                            placeholder="UMO"
                                            className="w-full border-2 rounded p-1"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            name="remarks"
                                            value={item.remarks}
                                            onChange={(e) => handleRowChange(i, e)}
                                            placeholder="Remarks"
                                            className="w-full border-2 rounded p-1"
                                        />
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteRow(i)}
                                            className="text-red-500 ml-3"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p className="font-bold mt-2">
                        Total Number of Qty:{" "}
                        {formData.items.reduce((acc, item) => acc + Number(item.qty || 0), 0)}
                    </p>
                </div>
                <div className="flex justify-center mt-5">
                    <button
                        type="button"
                        onClick={handleAddRow}
                        className="items-center p-2 border-2 rounded-md bg-blue-400 text-white"
                    >
                        Add Item
                    </button>
                    <button type="submit" className="items-center p-2 border-2 rounded-md bg-green-400 text-white ml-3">
                        Save
                    </button>
                </div>
            </div>
        </form>
    );
}
