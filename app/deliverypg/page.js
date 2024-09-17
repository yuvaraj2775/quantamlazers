"use client";

import { useState, useEffect } from "react";
import React from "react";

const Page = () => {
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

  return (
    <div className="w-full overflow-y-auto h-screen m-4">
      <h1 className="font-bold text-3xl text-center p-5">Generated Quote</h1>
      <div className="min-w-full mx-2 mt-2 border-2 border-black space-y-5">
        <div className="flex space-x-5">
          <div>
            <img src={fetchedData?.imageURL} alt="Product" />
          </div>
          <div>
            <h2 className="text-yellow-500 font-bold text-xl uppercase">
              Quantum Lasers
            </h2>
            {fetchedData?.data.map((item, index) => (
              <div key={index} className="text-blue-900 font-semibold text-xl">
                <p>ID: {item.id}</p>
                <p>Description: {item.name}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="text-blue-700 italic font-semibold">
          <p>GST.NO:33AYXPP7084J1ZI</p>
        </div>
      </div>

      <div className="min-w-full mx-2 font-semibold text-xl uppercase text-center border-x-2 border-b-2 border-black">
        <h3>Quotation</h3>
      </div>

      <div className="min-w-full h-12 max-w-full mx-2 border-x-2 border-b-2 border-black"></div>

      <div className="min-w-full grid grid-cols-2 mx-2 border-x-2 border-b-2 border-black">
        <div className="flex justify-start items-end pb-3 border-r-2 border-black px-2 font-semibold">
          <div>
            <p>{fetchedData?.clientName}</p>
            <p>GST NO: {fetchedData?.clientGST}</p>
            <p>Kind Attn: {fetchedData?.clientAttention}</p>
          </div>
        </div>

        <div className="space-y-5 px-2">
          <div className="font-semibold">
            <p>Quotation ID: {fetchedData?.quoteId}</p>
            <p>Date: {fetchedData?.date}</p>
          </div>

          <div className="flex space-x-20 pb-9">
            <p>Ref NO: {fetchedData?.refNo}</p>
            <p className="font-semibold">EMAIL</p>
          </div>
        </div>
      </div>

      <div className="min-w-full mx-2 border-x-2 border-b-2 border-black font-semibold">
        <p>Subject: {fetchedData?.subject}</p>
      </div>

      <div className="min-w-full mx-2 border-x-2 border-b-2 border-black pt-3">
        <p>We are pleased to submit the following quote as requested</p>
      </div>

      <div>
        <table className="mx-2 min-w-full mb-10">
          <thead className="border-collapse">
            <tr>
              <th className="border-2 border-t-0 border-black">SL.NO</th>
              <th className="border-2 border-t-0 border-black">
                Item Name / Description
              </th>
              <th className="border-2 border-t-0 border-black">HSN code</th>
              <th className="border-2 border-t-0 border-black">Qty</th>
              <th className="border-2 border-t-0 border-black">Unit</th>
              <th className="border-2 border-t-0 border-black">Unit Cost</th>
              <th className="border-2 border-t-0 border-black">Taxable value</th>
              <th className="border-2 border-t-0 border-black w-32">
                CGST/IGST
                <div className="flex">
                  <th className="border-t-2 border-r-2 border-black w-1/2">%</th>
                  <th className="border-t-2 border-black w-1/2">Tax Amt</th>
                </div>
              </th>
              <th className="border-2 border-t-0 border-black w-32">
                SGST/UGST
                <div className="flex">
                  <th className="border-t-2 border-r-2 border-black w-1/2">%</th>
                  <th className="border-t-2 border-black w-1/2">Tax Amt</th>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {fetchedData?.data.map((item, index) => (
              <tr key={index} className="text-center h-8">
                <td className="border-2 border-t-0 border-black">{index + 1}</td>
                <td className="border-2 border-t-0 border-black">{item.name}</td>
                <td className="border-2 border-t-0 border-black">{item.hsnCode}</td>
                <td className="border-2 border-t-0 border-black">{item.qty}</td>
                <td className="border-2 border-t-0 border-black">{item.unit}</td>
                <td className="border-2 border-t-0 border-black">{item.unitCost}</td>
                <td className="border-2 border-t-0 border-black">{item.taxableValue}</td>
                <td className="border-2 border-t-0 border-black">
                  <div className="flex">
                    <div className="w-1/2">{item.cgstPercent}</div>
                    <div className="w-1/2">{item.cgstTaxAmt}</div>
                  </div>
                </td>
                <td className="border-2 border-t-0 border-black">
                  <div className="flex">
                    <div className="w-1/2">{item.sgstPercent}</div>
                    <div className="w-1/2">{item.sgstTaxAmt}</div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="text-right font-bold">Total Items:</td>
              <td>{fetchedData?.length}</td>
              <td className="text-right font-bold">Total Unit Cost:</td>
              <td>{fetchedData?.totalUnitCost}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default Page;
