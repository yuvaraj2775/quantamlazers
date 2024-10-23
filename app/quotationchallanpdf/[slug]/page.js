"use client";
import { ArrowDownTrayIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Link from "next/link";
import { toWords } from "number-to-words";
import QuotationFooter from "../components/QuotationFooter";
import ItemTableComponent from "../components/ItemTableComponent";
import TotalsComponent from "../components/TotalsComponent";
import TermsConditionsComponent from "../components/TermsConditionsComponent";

const Page = ({ params }) => {
  const [fetcheddata, setFetchedData] = useState(null);
  const router = useRouter();
  const pdfRef = useRef();

  // Function to download the PDF
  const pdfDownload = async () => {
    const input = pdfRef.current;

    // Capture the current width and height of the HTML content
    const inputWidth = input.scrollWidth;
    const inputHeight = input.scrollHeight;

    // Set the PDF dimensions (A4 size in points: 595.28 x 841.89)
    const pdfWidth = 595.28;
    const pdfHeight = 841.89;
    const margin = 10; // Margin from the edges

    // Calculate the ratio of the input dimensions to PDF size
    const ratio = Math.min(
      (pdfWidth - margin * 2) / inputWidth,
      (pdfHeight - margin * 2) / inputHeight
    );

    // Use html2canvas to capture the content as an image
    html2canvas(input, { scale: 1 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      // Create jsPDF instance
      const pdf = new jsPDF("p", "pt", "a4");

      // Calculate the image dimensions based on the scaling ratio
      const imgWidth = inputWidth * ratio;
      const imgHeight = inputHeight * ratio;

      // Center the content on the page
      const x = (pdfWidth - imgWidth) / 2;
      const y = margin;

      // Add the image to the PDF
      pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
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

    const grandTotal =
      subtotal - discountAmount + totalCGST + totalSGST + totalIGST;

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

            <QuotationFooter fetcheddata={fetcheddata} />

            {/* Items Table */}

            <ItemTableComponent fetcheddata={fetcheddata} />

            {/* Summary Section */}

            <TotalsComponent
              grandTotalInWords={grandTotalInWords}
              totals={totals}
              fetcheddata={fetcheddata}
            />

            <TermsConditionsComponent fetcheddata={fetcheddata} />
          </div>
        </div>
      </div>
      <div className="flex justify-between mx-5 mb-5">
        <div className="rounded-md p-2 border-2 flex items-center bg-blue-500 text-white">
          <ArrowLeftIcon className="w-4 h-4 mr-1" />
          <Link href={`/quotationedit?id=${params.slug}`}>
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
