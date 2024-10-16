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
  const [open, setOpen] = useState(false);
  const [quotation, setQuotation] = useState(null);
  const [totals, setTotals] = useState(null);
  console.log(totals,"abb")

  const qtyCalculate = (items) => {
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
    const  searchQuery = searchInput.trim().toUpperCase();

    if (searchQuery.startsWith("DC")) {
      const dcId = searchQuery.substring(2);
      const exists = fetchedData?.data.some(val => val.id == dcId);
      if (exists) {
        router.push(`/DeliveryChallanPdf/${dcId}`);
      } else {
        setOpen(true);
      }
    } else if (searchQuery.startsWith("QL")) {
      const qlId = searchQuery.substring(2);
      const exists = quotation?.data.some(val => val.id == qlId);
      if (exists) {
        router.push(`/quotationchallanpdf/${qlId}`);
      } else {
        setOpen(true);
      }
    } else {
      setOpen(true);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch("/api/Formdata");
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      const quantities = qtyCalculate(result.data2);
      setQty(quantities);
      setFetchedData(result);
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const calculateTotals = (
    items,
    discountAmount,
    Packagecharges,
    TransportationCharges,
    OtherCost
  ) => {
    const totals = items.reduce(
      (totals, item) => {
        const cgstAmt = parseFloat(item.cgstamt) || 0;
        const sgstAmt = parseFloat(item.sgstamt) || 0;
        const igstAmt = parseFloat(item.igstamt) || 0;
        const ugstAmt = parseFloat(item.ugstamt) || 0;
        const taxableValue = parseFloat(item.taxablevalue) || 0;
  
        return {
          totalCGST: totals.totalCGST + cgstAmt,
          totalSGST: totals.totalSGST + sgstAmt,
          totalIGST: totals.totalIGST + igstAmt,
          totalUGST: totals.totalUGST + ugstAmt,
          taxableValue: totals.taxableValue + taxableValue,
          grandTotal:
            totals.grandTotal +
            taxableValue +
            cgstAmt +
            sgstAmt +
            igstAmt +
            ugstAmt,
        };
      },
      {
        totalCGST: 0,
        totalSGST: 0,
        totalIGST: 0,
        totalUGST: 0,
        taxableValue: 0,
        grandTotal: 0,
      }
    );
  
    const parsedPackagecharges = parseFloat(Packagecharges) || 0;
    const parsedTransportationCharges = parseFloat(TransportationCharges) || 0;
    const parsedOtherCost = parseFloat(OtherCost) || 0;
    const parsedDiscountAmount = parseFloat(discountAmount) || 0;
  
    let discount = 0;
    if (parsedDiscountAmount) {
      discount = parseFloat((totals.taxableValue * parsedDiscountAmount) / 100);
    }
    const discountedGrandTotal = Math.max(totals.grandTotal - discount, 0);
    const totalCharges =
      parsedPackagecharges + parsedTransportationCharges + parsedOtherCost;
    const finalGrandTotal = Math.max(discountedGrandTotal + totalCharges, 0);
  
    return {
      ...totals,
      discount,
      grandTotal: finalGrandTotal,
      totalCharges,
      parsedPackagecharges,
      parsedTransportationCharges,
      parsedOtherCost,
    };
  };
  
    




  
  useEffect(() => {
    const fetchQuotationData = async () => {
      try {
        const response = await fetch("/api/quatation");
        if (!response.ok) {
          const errorDetails = await response.text(); // Get error details
          throw new Error(`Failed to fetch data: ${response.status} ${errorDetails}`);
        }
        const result = await response.json();
        console.log("result-->",result)
        setQuotation(result);
        const updatedQuodata = quotation?.map((quotation) => {
          console.log("dd",quotation.itemdata)
          const { grandTotal } = calculateTotals(
            quotation.itemdata,
            quotation.discount,
            quotation.packagechargs,
            quotation.trnschargs,
            quotation.othercost
          );
          return { ...quotation, grandTotal };
        });

        setTotals(updatedQuodata);
      } catch (error) {
        console.error("Fetch failed:", error.message);
      }
    };
  
    fetchQuotationData();
  }, []);
  

  console.log(totals,"totals")

  return (
    <div className="container mx-auto p-4 h-screen overflow-y-auto rounded-md">
      <form onSubmit={handleSearchSubmit} className="flex justify-center mb-4">
        <input
          type="text"
          value={searchInput}
          onChange={handleSearchChange}
          className="h-10 w-2/5 border-2 uppercase  border-gray-300 rounded-md p-2 mr-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter ID"
        />
        <button type="submit" className="h-10 border-2 border-blue-500 rounded-md bg-blue-500 text-white p-2 transition duration-300 hover:bg-blue-600">
          Search
        </button>
      </form>

      <div className="grid grid-cols-2">
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
            {fetchedData?.data.map((val, index) => (
              <tr key={val.id} className={`hover:bg-gray-100 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                <td className="border border-gray-300 p-2">{index + 1}</td>
                <td className="border border-gray-300 p-2">
                  <Link href={`/DeliveryChallanPdf/${val.id}`} className="hover:underline text-blue-600">
                    DC{val.id}
                  </Link>
                </td>
                <td className="border border-gray-300 p-2">{qty[val.id] || 0}</td>
                <td className="border border-gray-300 p-2 uppercase text-sm">{val.buyer}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <table className="min-w-full border-collapse border border-gray-300 mt-4 ml-2 bg-white shadow-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 p-2">S.NO</th>
              <th className="border border-gray-300 p-2 w-20">QL NO</th>
              <th className="border border-gray-300 p-2">BUYER</th>
              <th className="border border-gray-300 p-2">Grand Total</th>
            </tr>
          </thead>
          <tbody>
            {quotation?.data.map((val, index) => (
              <tr key={val.id} className={`hover:bg-gray-100 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                <td className="border border-gray-300 p-2">{index + 1}</td>
                <td className="border w-20 border-gray-300 p-2">
                  <Link href={`/quotationchallanpdf/${val.id}`} className="hover:underline text-blue-600">
                    QL{val.id}
                  </Link>
                </td>
                <td className="border border-gray-300 p-2 uppercase text-sm">{val.Address}</td>
               
                <td className="border border-gray-300 p-2">{(val.grandTotal || 0).toFixed(2)}</td>
               
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Modal for ID not existing */}
      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-10">
        <div className="fixed inset-0 bg-black bg-opacity-30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6">
            <Dialog.Title className="text-lg font-semibold">ID Not Found</Dialog.Title>
            <div className="mt-2">
              <p className="text-sm text-gray-500">The ID you entered does not exist.</p>
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
