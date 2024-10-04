"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Dialog } from "@headlessui/react";

const SearchInput = () => {
  const [searchInput, setSearchInput] = useState("");
  const router = useRouter();
  const [fetchedData, setFetchedData] = useState(null);
  const [qty, setQty] = useState(null);
  const [isIdExists, setIsIdExists] = useState(null); // Updated state for ID existence
  const [open, setOpen] = useState(false); // State for modal visibility

  const qtycalculate = (items) => {
    return items.reduce((acc, item) => {
      if (!acc[item.quotation_id]) {
        acc[item.quotation_id] = 0;
      }
      acc[item.quotation_id] += parseInt(item.qty || 0);
      return acc;
    }, {});
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const exists = fetchedData?.data.some(val => val.id == searchInput);
    setIsIdExists(exists);
    
    if (exists) {
      router.push(`/DeliveryChallanPdf/${searchInput}`);
    } else {
      setOpen(true); // Open the modal if ID does not exist
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/Formdata");
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        const quantities = qtycalculate(result.data2);
        setQty(quantities);
        setFetchedData(result);
      } catch (error) {
        console.error("Fetch failed:", error);
      }
    };

    fetchData();
  }, []);

  const totalQuantity = Object.values(qty || {}).reduce((acc, qty) => acc + qty, 0);

  return (
    <div className="container mx-auto p-4 h-screen overflow-y-auto rounded-md">
      <form onSubmit={handleSearchSubmit} className="flex justify-center mb-4">
        <input
          type="text"
          value={searchInput}
          onChange={handleSearchChange}
          className="h-10 w-2/5 border-2 border-gray-300 rounded-md p-2 mr-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter ID"
        />
        <button type="submit" className="h-10 border-2 border-blue-500 rounded-md bg-blue-500 text-white p-2 transition duration-300 hover:bg-blue-600">
          Search
        </button>
      </form>

      <table className="min-w-full border-collapse border border-gray-300 mt-4 bg-white shadow-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-300 p-2">S.NO</th>
            <th className="border border-gray-300 p-2">DC NO</th>
            <th className="border border-gray-300 p-2">QTY</th>
            <th className="border border-gray-300 p-2">Buyer</th>
          </tr>
        </thead>
        <tbody>
          {fetchedData?.data.map((val, index) => {
            return (
              <tr key={val.id} className={`hover:bg-gray-100 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                <td className="border border-gray-300 p-2">{index + 1}</td>
                <td className="border border-gray-300 p-2">
                  <Link href={`/DeliveryChallanPdf/${val.id}`} className="hover:underline text-blue-600">
                    DC {val.id}
                  </Link>
                </td>
                <td className="border border-gray-300 p-2">{qty[val.id] || 0}</td>
                <td className="border border-gray-300 p-2">{val.buyer}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Modal for ID not existing */}
      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-10">
        <div className="fixed inset-0 bg-black bg-opacity-30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6">
            <Dialog.Title className="text-lg font-semibold"> DC ID Not Found</Dialog.Title>
            <div className="mt-2">
              <p className="text-sm text-gray-500">The DC ID you entered does not exist.</p>
            </div>
            <div className="mt-4">
              <button
                onClick={() => setOpen(false)}
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default SearchInput;

