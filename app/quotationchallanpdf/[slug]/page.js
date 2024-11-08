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
  const [itemdata, setitemdata] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const router = useRouter();
  const pdfRef = useRef();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);


  console.log(itemdata,"itemdata")

  useEffect(() => {
    const suggestions = itemdata.map((item, index) => ({
      // name: `${item.name} (IT${String(index + 1).padStart(3, "0")})`, // Formatted name
      enabled: item.enabled, // Include the enabled property
    }));

    setSuggestions(suggestions);
  }, [itemdata]);

  // Function to download the PDF
// Function to download the PDF
const pdfDownload = async () => {
  setIsGeneratingPdf(true); // Set loading state to true at the beginning
  const input = pdfRef.current;
  const originalTextElements = input.querySelectorAll("*");
  const originalColors = Array.from(originalTextElements).map(
    (el) => el.style.color
  );

  // Set all text colors to black
  originalTextElements.forEach((el) => {
    el.style.color = "black";
  });

  const itemElements = input.querySelectorAll("td"); // Select all cells that may contain item names

  // Store original text and remove auto-generated codes
  const originalTexts = Array.from(itemElements).map((el) => el.innerHTML);
  itemElements.forEach((el) => {
      el.innerHTML = el.innerHTML.replace(/\(IT\d{3}\)/g, ""); // Regex to remove (ITxxx) pattern
  });

  try {
    const inputWidth = input.scrollWidth;
    const inputHeight = input.scrollHeight;
  
    const pdfWidth = 595.28; // A4 width in points
    const pdfHeight = 841.89; // A4 height in points
    const margin = 10; // Margin in points
  
    // Calculate the scale ratio to fit the content within A4 dimensions with margin
    const ratio = Math.min(
      (pdfWidth - margin * 2) / inputWidth,
      (pdfHeight - margin * 2) / inputHeight
    );
  
    await html2canvas(input, {
      scale: 1,
      onclone: (documentClone) => {
        // Set text color to black for the cloned version to ensure no red styling in the PDF
        documentClone.querySelectorAll('*').forEach((el) => {
          el.style.color = 'black';
        });
      },
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
  
      const imgWidth = inputWidth * ratio;
      const imgHeight = inputHeight * ratio;
      const x = (pdfWidth - imgWidth) / 2; // Center the image horizontally
      const y = margin; // Start the image after the top margin
  
      // Add the image to the PDF and save
      pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
      pdf.save("Quotation-challan.pdf");
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
  } finally {
    // Restore original colors
    originalTextElements.forEach((el, index) => {
      el.style.color = originalColors[index];
    });
    itemElements.forEach((el, index) => {
      el.innerHTML = originalTexts[index];
    });
    setIsGeneratingPdf(false); // Always reset loading state
  }
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/itemmaster");
        if (!response.ok) throw new Error("failed to fetch data");
        const result = await response.json();
        setitemdata(result.data || []);
      } catch (error) {
        console.log("fetch failes:", error);
      }
    };
    fetchData();
  }, []);

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

            <ItemTableComponent fetcheddata={fetcheddata}  />
           

            {/* Summary Section */}

            <TotalsComponent
              grandTotalInWords={grandTotalInWords}
              totals={totals}
              fetcheddata={fetcheddata}
            />

            <TermsConditionsComponent fetcheddata={fetcheddata} />
          </div>
          {isGeneratingPdf && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800 bg-opacity-70 z-50">
                <div role="status" className="flex flex-col items-center">
                  <svg
                    aria-hidden="true"
                    className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            )}
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
