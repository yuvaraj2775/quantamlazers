"use client";

import { useState, useEffect, useRef } from "react";
import React from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Page = () => {
  const [fetchedData, setFetchedData] = useState(null);
  const pdfRef = useRef();

  const pdfDownload = async () => {
    const input = pdfRef.current;

    // Capture the content as a canvas
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    // Calculate the scaling factor
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const scaledWidth = imgWidth * ratio;
    const scaledHeight = imgHeight * ratio;

    // Add the image to the PDF
    let yOffset = 0;
    while (yOffset < imgHeight) {
      pdf.addImage(imgData, 'PNG', 0, -yOffset * ratio, scaledWidth, scaledHeight);
      yOffset += pdfHeight / ratio;
      if (yOffset < imgHeight) {
        pdf.addPage(); // Add a new page if there's more content
      }
    }

    pdf.save("download.pdf");
  };

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
    <div className="w-full h-screen overflow-y-auto">
      {fetchedData?.data.map((item, index) => (
        <div className="w-11/12 border-2 border-black mx-auto mt-5" ref={pdfRef} key={index}>
          <h1 className="font-bold text-3xl text-center p-5"></h1>
          <div className="">
            <div className=" space-x-5 ">
              <div>
                <h2 className="text-yellow-500 font-bold text-xl uppercase text-center">
                  Quantum Lasers
                </h2>
                <div className="text-blue-900 font-semibold text-xl ">
                  <p className="capitalize text-center">Address: no:36 pallipattu main road pallipatu</p>
                  <p className="text-center">phone no: 1234567890</p>
                </div>
              </div>
            </div>
            <div className="text-blue-700 italic font-semibold flex justify-center ">
              <p>GST.NO:33AYXPP7084J1ZI</p>
            </div>
          </div>

          <div className="min-w-full font-semibold text-xl uppercase text-center mt-5 border-y-2 pb-4 border-black">
            <h3 >Delivery Challan</h3>
          </div>

          <div className="min-w-full h-12 max-w-full border-b-2 border-black"></div>

          <div className="min-w-full grid grid-cols-2 border-b-2 border-black ">
            <div className="flex justify-start  border-r-2 px-2 border-black font-semibold">
              <div>
                <p>{item.buyer}</p>
                <div className="flex h-full items-center">
                  <p className="">GST NO: {item.gst_number}</p>
                </div>
              </div>
            </div>

            <div className="space-y-5 px-2 capitalize font-semibold">
              <div>
                <h1 className="font-semibold">dC details</h1>
              </div>
              <div>
                <div className="grid grid-cols-2">
                  <label>dC no:</label>
                  <p className="font-bold">{item.dcnumber}</p>
                </div>
                <div className="grid grid-cols-2">
                  <label>your order number:</label>
                  <p>{item.ordernumber}</p>
                </div>
                <div className="grid grid-cols-2">
                  <label>date:</label>
                  <p>{item.dc_date}</p>
                </div>
                <div className="grid grid-cols-2">
                  <label>your dC no:</label>
                  <p>{item.dc_number}</p>
                </div>
                <div className="grid grid-cols-2">
                  <label>date:</label>
                  <p>{item.orderdate}</p>
                </div>
                <div className="grid grid-cols-2 mb-3">
                  <label>your dC number:</label>
                  <p>{item.ordernumber}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <table className="min-w-full mt-5">
              <thead className="border-y-2 border-black">
                <tr>
                  <th className="border-r-2 border-black pb-2">SL.NO</th>
                  <th className="border-r-2 border-black pb-2">Item Name / Description</th>
                  <th className="border-r-2 border-black pb-2">HSN code</th>
                  <th className="border-r-2 border-black pb-2">Qty</th>
                  <th className="border-r-2 border-black pb-2">UMO</th>
                  <th className="pb-2">Remarks</th>
                </tr>
              </thead>
              <tbody className="border-b-2 border-black">
                {fetchedData?.data2.map((t, index) => (
                  <tr className="text-center h-8 pb-1" key={index}>
                    <td className="border-r-2 border-black  pb-1">{index + 1}</td>
                    <td className="border-r-2 border-black uppercase  pb-1">{t.name}</td>
                    <td className="border-r-2 border-black uppercase  pb-1">{t.hsn}</td>
                    <td className="border-r-2 border-black uppercase  pb-1">{t.qty}</td>
                    <td className="border-r-2 border-black uppercase  pb-1">{t.umoremarks}</td>
                    <td>{t.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mx-3 font-bold">
              <p className="text-center font-bold mt-3">
                Total number of Quantity: {fetchedData.data2.reduce((acc, item) => acc + Number(item.qty || 0), 0)}
              </p>
              <p>Vehicle Number:</p>
              <p className="text-right">For QUANTUM LAZERS</p>
              <p className="capitalize">Received the above goods in good condition</p>
              <div className="mt-10 mb-10 flex justify-between">
                <p>Receiver's Signature</p>
                <p>Authorized Signature</p>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="text-right mt-5 mr-5">
        <button onClick={pdfDownload} className="rounded-md p-2 bg-red-500 text-white">
          Print
        </button>
      </div>
    </div>
  );
};

export default Page;
