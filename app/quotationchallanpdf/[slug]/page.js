"use client";
import { ArrowDownTrayIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Link from "next/link";
import { toWords } from "number-to-words";

const Page = ({ params }) => {
  const [fetcheddata, setFetchedData] = useState(null);
  const router = useRouter();
  const pdfRef = useRef();

  const pdfDownload = async () => {
    const input = pdfRef.current;
    const inputWidth = input.clientWidth;
    const inputHeight = input.clientHeight;

    const margin = 0.02;
    const pdfWidth = 700.28;
    const pdfHeight = Math.min(inputHeight, 841.89);

    const pdf = new jsPDF("p", "pt", [pdfWidth, pdfHeight]);

    html2canvas(input, { scale: 1.5 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      const imgWidth = pdfWidth * (1 - margin * 2);
      const imgHeight = canvas.height * imgWidth;

      const topMargin = pdfHeight * margin;
      const leftMargin = pdfWidth * margin;
      const imgX = leftMargin;
      const imgY = topMargin;

      const adjustedHeight =
        imgHeight > pdfHeight - topMargin * 2
          ? pdfHeight - topMargin * 2
          : imgHeight;

      pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth, adjustedHeight);
      pdf.save("Quotation-challan.pdf");
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/quatation?id=${params.slug}`);
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        setFetchedData(result);
      } catch (error) {
        console.error("Fetch failed:", error);
      }
    };

    fetchData();
  }, [params.slug]);

  const calculateTotals = () => {
    if (!fetcheddata?.itemdata) return {};
  
    const subtotal = fetcheddata.itemdata.reduce((acc, item) => {
      return acc + (parseFloat(item.taxableValue) || 0);
    }, 0);
  
    const totalCGST = fetcheddata.itemdata.reduce((acc, item) => {
      return acc + (parseFloat(item.taxamt) || 0);
    }, 0);
  
    const totalSGST = fetcheddata.itemdata.reduce((acc, item) => {
      return acc + (parseFloat(item.taxamt2) || 0);
    }, 0);
  
    const totalIGST = fetcheddata.itemdata.reduce((acc, item) => {
      return acc + (parseFloat(item.igstamt) || 0);
    }, 0);
  
    const discount = parseFloat(fetcheddata?.data.discount) || 0;
    const discountAmount = (subtotal * discount) / 100;
  
    const grandTotal = subtotal - discountAmount + totalCGST + totalSGST + totalIGST;
  
    return {
      subtotal: isNaN(subtotal) ? 0 : subtotal,
      totalCGST: isNaN(totalCGST) ? 0 : totalCGST,
      totalSGST: isNaN(totalSGST) ? 0 : totalSGST,
      totalIGST: isNaN(totalIGST) ? 0 : totalIGST,
      discountAmount: isNaN(discountAmount) ? 0 : discountAmount,
      grandTotal: isNaN(grandTotal) ? 0 : grandTotal,
    };
  };
  

  const totals = calculateTotals();
  const fulltotals = {
    grandTotal: parseFloat((totals.grandTotal || 0).toFixed(2)), // Convert to a number
    // other totals...
  };
  let grandTotalInWords = toWords(fulltotals.grandTotal);

  console.log(fetcheddata, "dd");

  return (
    <div className="text-sm">
      <div className="h-screen p-4 mx-auto overflow-y-auto">
        <div
          className="w-full max-w-4xl mx-9 border-2 border-black"
          ref={pdfRef}
        >
          <div className="mt-10">
            {/* Header and Company Info */}
            <div className="flex ml-3 my-12">
              <img
                src={"../img/Company_logo.jpg"}
                className="w-28 h-28"
                alt="Company Logo"
              />
              <div className="ml-3 mt-4">
                <h2 className="text-yellow-500 font-bold text-xl uppercase">
                  Quantum Lasers
                </h2>
                <div className="text-blue-900 font-semibold text-xl">
                  <p className="capitalize text-center text-sm font-bold">
                    Address: no:36 pallipattu main road pallipatu
                  </p>
                  <p className="capitalize text-sm font-bold">
                    Phone No: 1234567890
                  </p>
                  <p className="text-sm font-bold">GST NO: 33AYXPP7084J1ZI</p>
                </div>
              </div>
            </div>
            <div className="min-w-full font-semibold text-xl capitalize text-center mt-5 border-y-2 pb-3 border-black">
              <h3 className="tracking-widest mt-1">Quotation</h3>
            </div>
            {/* Buyer Info */}
            <div className="flex w-full border-y-2 mt-10 border-black">
              <div className="border-r-2 px-2 py-3 w-3/5  border-black">
                <p className="font-bold uppercase">Buyer :</p>
                <pre className="uppercase mt-2">
                  {fetcheddata?.data.Address}
                </pre>

                <div className="grid grid-cols-2 mt-2">
                  <p className="font-bold mt-3">GST NO </p>
                  <p>: {fetcheddata?.data.gstnumber}</p>
                </div>
                <div className="grid grid-cols-2 mt-2">
                  <p className="uppercase font-bold ">Kind Attention </p>
                  <p className="font-normal">
                   : {fetcheddata?.data.kindattention}
                  </p>
                </div>
              </div>
              <div className="px-2  w-2/5 capitalize font-semibold">
                <div className="mt-2 grid pb-3 grid-cols-2">
                  <label>Quotation ID</label>
                  <p className="font-normal">: {fetcheddata?.data.id}</p>
                  <label className="mt-2">Date</label>
                  <p className="font-normal mt-2">: {fetcheddata?.data.Date}</p>
                  <label className="mt-2">Ref NO</label>
                  <p className="font-normal mt-2 uppercase">
                    : {fetcheddata?.data.reference}
                  </p>
                </div>
              </div>
            </div>
            <div className=" flex items-center border-b-2 my-7 pb-5 pl-5 border-black">
              <p className="font-bold mr-3">Subject</p>
              <p className="uppercase">: {fetcheddata?.data.subject}</p>
            </div>
            <div className="flex items-center pb-5">
              <p className="ml-5">
                We are pleased to submit the following quote as requested
              </p>
            </div>
            {/* Items Table */}
            <div className="">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs border-t-2 border-b-2 border-black h-12">
                    <th className="border-b-2 border-r-2 border-black p-2">
                      SL. No.
                    </th>
                    <th className="border-2 border-black p-2 ">
                      Item Name / Description
                    </th>
                    <th className="border-2 border-black p-2">HSN Code</th>
                    <th className="border-2 border-black p-2">Qty</th>
                    <th className="border-2 border-black p-2">Unit</th>
                    <th className="border-2 border-black p-2">Unit Cost</th>
                    <th className="border-2 border-black p-2">Taxable Value</th>
                    <th className="border-2 border-black p-0 w-32 h-4">
                      <div className="flex flex-col">
                        <p className="border-b-2 border-black p-2">
                          CGST/IGST Rate
                        </p>
                        <div className="flex flex-row">
                          <p className="border-r-2 border-black text-center p-2 w-[30%]">
                            %
                          </p>
                          <p className="text-center p-2 w-[70%]">Tax Amt</p>
                        </div>
                      </div>
                    </th>

                    <th className=" border-black p-0 w-32 h-4">
                      <div className="flex flex-col">
                        <p className="border-b-2 border-black p-2">
                          SGST/UGST Rate
                        </p>
                        <div className="flex flex-row">
                          <p className="border-r-2 border-black text-center p-2 w-[30%]">
                            %
                          </p>
                          <p className="text-center p-2 w-[70%]">Tax Amt</p>
                        </div>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {fetcheddata?.itemdata.map((item, index) => (
                    <tr className="text-xs text-right" key={item.id || index}>
                      <td className="border-r-2 capitalize border-black p-2 text-center">
                        {index + 1}
                      </td>
                      <td className="border-r-2 capitalize border-black p-2 text-left">
                        {item.description}
                      </td>
                      <td className="border-r-2 border-black p-2 text-center">
                        {item.hsncode}
                      </td>
                      <td className="border-r-2 border-black p-2">
                        {item.qty}
                      </td>
                      <td className="border-r-2 border-black p-2">
                        {item.unit}
                      </td>
                      <td className="border-r-2 border-black p-2">
                        {item.unitCost}
                      </td>
                      <td className="border-r-2 border-black p-2 text-right">
                        {item.taxableValue}
                      </td>
                      <td className="border-r-0 border-black p-0 w-32 h-16">
                        <div className="flex flex-row items-center justify-center h-full">
                          <p className="border-r-2 border-black text-right p-2 w-[30%] h-full flex items-center justify-center">
                            {item.percentage}
                          </p>
                          <p className="border-r-2 border-black text-right p-2 w-[70%] h-full flex items-center justify-center">
                            {item.taxamt}
                          </p>
                        </div>
                      </td>
                      <td className="border-r-0 border-black p-0 w-32 h-16">
                        <div className="flex flex-row items-center justify-center h-full">
                          <p className="border-r-2 border-black text-right p-2 w-[30%] h-full flex items-center justify-center">
                            {item.percentage2}
                          </p>
                          <p className="border-r-0 border-black text-right p-2 w-[70%] h-full flex items-center justify-center">
                            {item.taxamt2}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-b-2 h-14 border-black text-sm">
                    <td className="p-2 px-16 font-bold" colSpan="3">
                      Total No. of Qty
                    </td>
                    <td className="p-2 text-right font-bold" colSpan="1">
                      {fetcheddata?.itemdata.reduce(
                        (total, item) => total + parseInt(item.qty),
                        0
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* Summary Section */}

            <div className="border-b-2 border-black grid grid-cols-2 px-2">
              <div>
                <div>
                  <p className="font-bold mt-2">Grand Totals</p>
                  <p className="capitalize">{grandTotalInWords}</p>
                </div>
                <div>
                  <p className="font-bold mt-2">Tax Amount</p>
                  <div className="flex justify-evenly">
                    <p className="grid grid-cols-2 ">
                      CGST  <span>: {totals.totalCGST}</span>
                    </p>
                    <p className="grid grid-cols-2">
                      IGST  <span>: {totals.totalIGST}</span>
                    </p>
                  </div>
                  <div className="flex justify-evenly ml-2">
                    <p className="grid grid-cols-2">
                      SGST  <span>: {(totals.totalSGST || 0).toFixed(2)}</span>
                    </p>
                    <p className="grid grid-cols-2 ml-2">
                      UGST  <span>: 0.00</span>
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <div className="grid grid-cols-2 mt-2">
                  <p className="font-bold">Sub-Total Amt</p>
                  <p>{totals.subtotal}</p>
                </div>
                <div className="grid grid-cols-2 mt-2">
                  <p>
                    Discount ({(fetcheddata?.data.discount || 0).toFixed(2)}%)
                  </p>
                  <p>{totals.discountAmount}</p>
                </div>
                <div className="grid grid-cols-2 mt-2">
                  <p>CGST</p>
                  <p>{(totals.totalCGST || 0).toFixed(2) }</p>
                </div>
                <div className="grid grid-cols-2 mt-2">
                  <p>SGST</p>
                  <p>{(totals.totalSGST || 0).toFixed(2)})</p>
                </div>
                <div className="grid grid-cols-2 mt-2">
                  <p>IGST</p>
                  <p>{totals.totalIGST}</p>
                </div>
                <div className="grid grid-cols-2 mt-2">
                  <p>UGST</p>
                  <p>0</p>
                </div>
                <div className="grid grid-cols-2 mt-2">
                  <p>Packages Charges</p>
                  <p>{(fetcheddata?.data.packageCharges || 0).toFixed(2)}</p>
                </div>
                <div className="grid grid-cols-2 mt-2">
                  <p>Transportation Charges</p>
                  <p>{(fetcheddata?.data.transportCharges || 0).toFixed(2)}</p>
                </div>
                <div className="grid grid-cols-2 mt-2">
                  <p>Other Costs</p>
                  <p>{(fetcheddata?.data.otherCosts || 0).toFixed(2)}</p>
                </div>
                <div className="grid grid-cols-2 my-3">
                  <p className="font-bold">Grand Total (rs)</p>
                  <p className="font-bold">
                    {(fetcheddata?.data.grandTotal || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            <div className="px-2 mt-2">
              <p className="font-bold">Terms & Conditions :</p>
              <p className="mt-2">PAYMENT TERMS :</p>
              <p className="mt-2 uppercase">1. {fetcheddata?.data.term1}</p>
              <p className="mt-2 uppercase">2. {fetcheddata?.data.term2}</p>
              <p className="mt-2 uppercase">3. {fetcheddata?.data.term3}</p>
              <p className="mt-2 uppercase">4. {fetcheddata?.data.term4}</p>
              <p className="text-center mt-2">Thank you</p>
              <p className="mt-2">
                We are looking forward to receive your valuable orders and
                assure your best attention at all times
              </p>
              <div className="text-right">
                <p className="font-bold">For QUANTUM LASERS</p>
                <p className="font-bold my-9">Authorised Signatory</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between mx-5 mb-5">
        <div   className="rounded-md p-2 border-2 flex items-center bg-blue-500 text-white" >
        <ArrowLeftIcon className="w-4 h-4 mr-1" />
        <Link
          href={`/quotationedit?id=${params.slug}`}
        
        >
          <p>Return to edit</p>
        </Link>

        </div>
     
        <button
          onClick={pdfDownload}
          className="rounded-md p-2 border-2 flex items-center bg-green-500 text-white"
        >
          <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
          Download
        </button>
      </div>
    </div>
  );
};

export default Page;
