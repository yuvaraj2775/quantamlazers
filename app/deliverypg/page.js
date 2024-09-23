"use client";

import { useState, useEffect } from "react";
import React from "react";
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';

const page = () => {
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
    <div>
      {fetchedData?.data.map((item, index) => (
       <div className="w-full overflow-y-auto h-screen m-4">
      <h1 className="font-bold text-3xl text-center p-5">Generated Quote</h1>
      <div className="min-w-full mx-2 mt-2 border-2 border-black space-y-5">
        <div className="flex space-x-5">
       
          <div>
            <h2 className="text-yellow-500 font-bold text-xl uppercase">
              Quantum Lasers
            </h2>
            
              <div key={index} className="text-blue-900 font-semibold text-xl">
                <p>ID: {item.id}</p>
                <p>Description: {item.id}</p>
              </div>
            
           
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
        <div className="flex justify-start  pb-3 border-r-2 border-black px-2 font-semibold">
          <div>
            <p>{item.buyer}</p>
            <p>GST NO: {item.gst_number}</p>
          </div>
        </div>

        <div className="space-y-5 px-2 capitalize">
           <div>
            <h1 className="font-semibold">dc details</h1>
           </div>
           <div>
            <div>
              <label htmlFor="">dc no {item.dcnumber}</label>
              <p>{}</p>
            </div>
            <div>
              <label htmlFor="">your order number{item.ordernumber}</label>
              <p></p>
            </div>
            <div>
              <label htmlFor="">date: {item.dc_date}</label>
              <p></p>
            </div>
            <div>
              <label htmlFor=""> your dc no:{item.dc_number} </label>
              <p></p>
            </div>
            <div>
              <label htmlFor="">date:{item.orderdate}</label>
              <p></p>
            </div>
            <div>
              <label htmlFor="">your dc number :{item.ordernumber}</label>
              <p></p>
            </div>
           </div>
        </div>
      </div>
       

      <div className="min-w-full mx-2 border-x-2 mt-5 border-b-2 border-black font-semibold">
        <p></p>
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
              <th className="border-2 border-t-0 border-black">umo</th>
              <th className="border-2 border-t-0 border-black">Remarks</th>
            </tr>
          </thead>
          <tbody>
          {fetchedData?.data2.map((t, index) => (
           
              <tr className="text-center h-8">
                <td className="border-2 border-t-0 border-black">{index + 1}</td>
                <td className="border-2 border-t-0 border-black">{t.name}</td>
                <td className="border-2 border-t-0 border-black">{t.hsn}</td>
                <td className="border-2 border-t-0 border-black">{t.qty}</td>
                <td className="border-2 border-t-0 border-black">{t.umoremarks}</td>
                <td className="border-2 border-t-0 border-black">{t.remarks}</td>
                </tr>         
               ))}
           
          </tbody>
         
        </table>
      </div>
      
    </div>
     ))}
    </div>
   
 
  );
};

export default page;
