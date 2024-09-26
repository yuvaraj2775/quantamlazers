"use client";

import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Page = () => {
  const [fetchedData, setFetchedData] = useState(null);
  const pdfRef = useRef();

  
  const pdfDownload = async () => {
    const input = pdfRef.current;
    const inputWidth = input.clientWidth;
    const inputHeight = input.clientHeight;
  
    const margin = 0.02; // Adjust margins as needed
    const pdfWidth = 764.28; // A4 width in points
    const pdfHeight = Math.min(inputHeight, 841.89); // Use A4 height or content height
  
    const pdf = new jsPDF("p", "pt", [pdfWidth, pdfHeight]);
  
    html2canvas(input, { scale: 2}).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
  
      // Maintain aspect ratio
      const imgWidth = pdfWidth * (1 - margin * 2);
      const imgHeight = (canvas.height * imgWidth);
  
      const topMargin = pdfHeight * margin;
      const leftMargin = pdfWidth * margin;
      const imgX = leftMargin;
      const imgY = topMargin;
  
      // Adjust height based on content to avoid blank space
      const adjustedHeight = imgHeight > (pdfHeight - topMargin * 2) ? (pdfHeight - topMargin * 2) : imgHeight;
  
      // Add the image to the PDF
      pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth, adjustedHeight);
  
      // Save the PDF
      pdf.save("Diet-plan.pdf");
    });
  };
  
  
  
  
  
  
  
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/Formdata");
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        setFetchedData(result);
      } catch (error) {
        console.error("Fetch failed:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="h-screen w-full overflow-y-auto">
      <div ref={pdfRef} className="max-w-4xl mx-auto h-auto">
        <>
          {fetchedData?.data.map((item, index) => (
            <div className="m-5 border-2 border-black mt-10" key={index}>
              <div className="flex ml-3">
                <img src={"img/Company_logo.jpg"} className="w-28 h-28" alt="Company Logo" />
                <div className="ml-3 mt-4">
                  <h2 className="text-yellow-500 font-bold text-xl uppercase">Quantum Lasers</h2>
                  <div className="text-blue-900 font-semibold text-xl">
                    <p className="capitalize text-center text-sm font-bold">
                      Address: no:36 pallipattu main road pallipatu
                    </p>
                    <p className="capitalize text-sm font-bold">Phone No: 1234567890</p>
                    <p className="text-sm font-bold">GST NO: 33AYXPP7084J1ZI</p>
                  </div>
                </div>
              </div>

              <div className="min-w-full font-semibold text-xl capitalize text-center mt-5 border-y-2 pb-3 border-black">
                <h3 className="tracking-widest mt-1">Delivery Challan</h3>
              </div>

              <div className="min-w-full grid grid-cols-2 border-b-2 border-black">
                <div className="border-r-2 px-2 border-black">
                  <p className="font-bold uppercase">Buyer :</p>
                  <pre className="uppercase mt-2">{item.buyer}</pre>
                  <p className="uppercase font-bold mb-4">
                    GST NO: <span className="font-semibold">{item.gst_number}</span>
                  </p>
                </div>
                <div className="px-2 capitalize font-semibold">
                  <h1 className="font-bold uppercase">DC details :</h1>
                  <div className="mt-2 grid pb-3 grid-cols-2">
                    <label>DC No</label>
                    <p>: {item.dc_number}</p>
                    <label>Date</label>
                    <p>: {item.dc_date}</p>
                    <label>Your Order Number</label>
                    <p>: {item.ordernumber}</p>
                    <label>Issue Date</label>
                    <p>: {item.dc_issue_date}</p>
                    <label>Your DC No</label>
                    <p>: {item.dc_number}</p>
                    <label>Date</label>
                    <p>: {item.orderdate}</p>
                  </div>
                </div>
              </div>

              <table className="min-w-full mt-10 overflow-x-auto">
                <thead className="border-y-2 border-black">
                  <tr>
                    <th className="border-r-2 border-black pb-4">SL.NO</th>
                    <th className="border-r-2 border-black pb-4 w-72">Item Name / Description</th>
                    <th className="border-r-2 border-black pb-4 w-28">HSN Code</th>
                    <th className="border-r-2 border-black pb-4">Qty</th>
                    <th className="border-r-2 border-black pb-4">UMO</th>
                    <th className="pb-4 w-72 px-2">Remarks</th>
                  </tr>
                </thead>
                <tbody className="border-b-2 border-black">
                  {fetchedData?.data2.map((t, index) => (
                    <tr className="text-center h-8 pb-3" key={index}>
                      <td className="border-r-2 border-black pb-4">{index + 1}</td>
                      <td className="border-r-2 border-black capitalize pb-4">{t.name}</td>
                      <td className="border-r-2 border-black capitalize pb-4">{t.hsn}</td>
                      <td className="border-r-2 border-black capitalize text-right pr-2 pb-4">{t.qty}</td>
                      <td className="border-r-2 border-black capitalize pb-4">{t.umoremarks}</td>
                      <td className="pb-4 capitalize">{t.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mx-3 font-bold">
                <div className="flex justify-end w-[60.5%]">
                  <p className="font-bold mt-3">
                    Total Number of Quantities:
                    <span className="font-semibold ml-7">
                      {fetchedData.data2.reduce((acc, item) => acc + Number(item.qty || 0), 0)}
                    </span>
                  </p>
                </div>
                <p className="mt-3">
                  Vehicle Number:{" "}
                  <span className="uppercase font-semibold">{item.vehicle_number}</span>
                </p>
                <div className="flex justify-between mt-8">
                  <p>Received the Above Goods In Good Condition</p>
                  <p className="text-right">For QUANTUM LAZERS</p>
                </div>
                <div className="mt-14 mb-10 flex justify-between">
                  <p>Receiver's Signature</p>
                  <p className="text-right">Authorized Signature</p>
                  <pre></pre>
                </div>
              </div>
            </div>
          ))}
        </>
      </div>

      <div className="text-right mt-10 mr-5">
        <button onClick={pdfDownload} className="rounded-md p-2 bg-red-500 text-white">
          Print
        </button>
      </div>
    </div>
  );
};

export default Page;