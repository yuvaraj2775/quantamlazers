"use client";
import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  ArrowLeftIcon,
  PrinterIcon,
  PlusCircleIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ItemTable from "./ItemTable";

const QuotationPage = ({ params }) => {
  const [itemdata, setItemData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [hsndata, sethsndata] = useState([]);
  const [hsnsuggestions, sethsnSuggestions] = useState([]);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Fetching item data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/itemmaster");
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        setItemData(result.data || []);
      } catch (error) {
        console.error("Fetch failed:", error);
      }
    };
    fetchData();
  }, []);

  // Creating suggestions based on fetched item data
  useEffect(() => {
    const suggestions = itemdata.map((item, index) => ({
      name: `${item.name} (IT${String(index + 1).padStart(3, "0")})`,
      enabled: item.enabled,
    }));
    setSuggestions(suggestions);
  }, [itemdata]);

  useEffect(() => {
    const hsnsuggestions = hsndata.map((item, index) => ({
      name: `${item.name} (IT${String(index + 1).padStart(3, "0")})`,
      enabled: item.enabled,
    }));

    sethsnSuggestions(hsnsuggestions);
  }, [hsndata]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/hsnmaster");
        if (!response.ok) throw new Error("failed to fetch data");
        const result = await response.json();
        sethsndata(result.data || []);
      } catch (error) {
        console.log("fetch failed:", error);
      }
    };
    fetchData();
  }, []);

  const pdfDownload = async () => {
    setIsGeneratingPdf(true); // Set loading state
    const input = pdfRef.current;

    // Temporarily store original colors
    const originalTextElements = input.querySelectorAll("*");
    const originalColors = Array.from(originalTextElements).map(
      (el) => el.style.color
    );

    // Set all text colors to black
    originalTextElements.forEach((el) => {
      el.style.color = "black";
    });

    const itemElements = input.querySelectorAll("td");

    const originalTexts = Array.from(itemElements).map((el) => el.innerHTML);
    itemElements.forEach((el) => {
      el.innerHTML = el.innerHTML.replace(/\(IT\d{3}\)/g, "");
    });

    try {
      const inputWidth = input.clientWidth;
      const inputHeight = input.clientHeight;

      const margin = 0.02; // Adjust margins as needed
      const pdfWidth = 700.28; // A4 width in points
      const pdfHeight = Math.min(inputHeight, 841.89); // Use A4 height or content height

      const pdf = new jsPDF("p", "pt", [pdfWidth, pdfHeight]);

      const canvas = await html2canvas(input, { scale: 1.5 });
      const imgData = canvas.toDataURL("image/png");

      const imgWidth = pdfWidth * (1 - margin * 2);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const topMargin = pdfHeight * margin;
      const leftMargin = pdfWidth * margin;

      const adjustedHeight = Math.min(imgHeight, pdfHeight - topMargin * 2);

      pdf.addImage(
        imgData,
        "PNG",
        leftMargin,
        topMargin,
        imgWidth,
        adjustedHeight
      );

      pdf.save("delivery-challan.pdf");
    } finally {
      // Restore original colors
      originalTextElements.forEach((el, index) => {
        el.style.color = originalColors[index];
      });
      itemElements.forEach((el, index) => {
        el.innerHTML = originalTexts[index];
      });

      setIsGeneratingPdf(false); // Reset loading state
    }
  };

  const router = useRouter();

  const save = () => {
    router.push("/edit");
  };

  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pdfRef = useRef();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/Formdata?id=${params.slug}`);
        if (!response.ok) {
          throw new Error("DC not found");
        }
        const result = await response.json();

        setQuotation(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.slug]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {quotation && (
        <div>
          <div className="h-screen p-4 mx-auto overflow-y-auto">
            <div
              className="w-full max-w-4xl mx-9 border-2 border-black"
              ref={pdfRef}
            >
              <div className="mt-10">
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
                      <p className="text-sm font-bold">
                        GST NO: 33AYXPP7084J1ZI
                      </p>
                    </div>
                  </div>
                </div>
                <div className="min-w-full font-semibold text-xl capitalize text-center mt-5 border-y-2 pb-3 border-black">
                  <h3 className="tracking-widest mt-1">Delivery Challan</h3>
                </div>
                <div className="min-w-full grid grid-cols-2 border-y-2 my-14   border-black">
                  <div className="border-r-2 px-2 py-3 border-black">
                    <p className="font-bold uppercase">Buyer :</p>
                    <pre className="uppercase mt-2">{quotation.data.buyer}</pre>
                    <p className="uppercase font-bold mb-4 mt-3">
                      GST NO :{" "}
                      <span className="font-normal">
                        {quotation.data.gst_number}
                      </span>
                    </p>
                  </div>

                  <div className="px-2 py-3 capitalize font-semibold">
                    <h1 className="font-bold uppercase">DC details :</h1>
                    <div className="mt-2 grid pb-3 grid-cols-2">
                      <label>DC NO</label>
                      <p className="font-normal">: {quotation.data.id}</p>
                      <label className="mt-2">Date</label>
                      <p className="font-normal mt-2">
                        : {quotation.data.dc_date}
                      </p>
                      <label className="mt-2">Your Order Number</label>
                      <p className="font-normal mt-2">
                        : {quotation.data.ordernumber}
                      </p>
                      <label className="mt-2">Issued Date</label>
                      <p className="font-normal mt-2">
                        : {quotation.data.dc_issue_date}
                      </p>
                      <label className="mt-2">Your DC NO</label>
                      <p className="font-normal mt-2">
                        : {quotation.data.dc_number}
                      </p>
                      <label className="mt-2">Date</label>
                      <p className="font-normal mt-2">
                        : {quotation.data.orderdate}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="my-10 mb-5">
                  <table className="min-w-full mt-10 overflow-x-auto">
                    <thead className="border-y-2 border-black">
                      <tr>
                        <th className="border-r-2 border-black pb-4">
                          SL. <br /> NO
                        </th>
                        <th className="border-r-2 border-black pb-4 w-72">
                          Item Name / <br /> Description
                        </th>
                        <th className="border-r-2 border-black pb-4 w-28">
                          HSN <br /> Code
                        </th>
                        <th className="border-r-2 border-black pb-4">Qty</th>
                        <th className="border-r-2 border-black pb-4">UMO</th>
                        <th className="pb-4 w-72 px-2">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="border-b-2 border-black">
                      {quotation.data2.map((t, index) => {
                        const suggestion = suggestions.find(
                          (s) => t.name === s.name
                        );
                        const isDisabledDescription = suggestion?.enabled === 0;

                        const hsnSuggestion = hsnsuggestions.find(
                          (s) => t.hsn === s.name
                        );
                        const isDisabledHsn = hsnSuggestion?.enabled === 0;

                        return (
                          <tr className="text-center h-8 pb-3" key={index}>
                            <td className="border-r-2 capitalize border-black text-sm pb-4">
                              {index + 1}
                            </td>
                            <td
                              className="border-r-2  border-black text-left px-2 text-sm pb-4"
                              style={{
                                color: isDisabledDescription
                                  ? "red"
                                  : "inherit",
                              }}
                            >
                              {t.name}
                            </td>
                            <td
                              className="border-r-2  text-sm text-left px-2 border-black pb-4"
                              style={{
                                color: isDisabledHsn ? "red" : "inherit",
                              }}
                            >
                              {t.hsn}
                            </td>
                            <td className="border-r-2 text-sm border-black text-right pr-2 pb-4">
                              {t.qty}
                            </td>
                            <td className="border-r-2 text-sm border-black pb-4">
                              {t.umoremarks}
                            </td>
                            <td className="pb-4 text-sm text-left px-2">
                              {t.remarks}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Other footer components go here */}
                <div className="font-bold mx-3 ">
                  <div className="flex justify-end w-[57%]">
                    <p className="font-bold  text-sm">
                      Total Number of Quantities :
                      <span className="font-normal inline-block ml-7 text-sm">
                        {quotation.data2.reduce(
                          (acc, item) => acc + Number(item.qty || 0),
                          0
                        )}
                      </span>
                    </p>
                  </div>
                  <p className="mt-3 my-5 text-sm">
                    Vehicle Number :{" "}
                    <span className="uppercase font-normal text-sm">
                      {quotation.data.vehicle_number}
                    </span>
                  </p>

                  <div className="flex justify-between my-8">
                    <p className="text-sm">
                      Received the Above Goods In Good Condition
                    </p>
                    <p className="text-right text-sm">For QUANTUM LAZERS</p>
                  </div>
                  <div className="mt-20  mb-10 flex justify-between">
                    <p className="text-sm">Receiver's Signature</p>
                    <p className="text-sm">Authorized Signature</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5  mx-9  flex justify-between ">
              <Link href={`/edit?id=${params.slug}`}>
                <button className="p-2 border-2 flex rounded-md items-center  bg-violet-600 text-white ">
                  <ArrowLeftIcon className="w-4 h-4 mr-1" />
                  <span>Return to Delivery Challan</span>
                </button>
              </Link>

              <button
                onClick={pdfDownload}
                className="rounded-md p-2 border-2  flex items-center bg-green-500 text-white"
              >
                <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
                Download
              </button>
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
      )}
    </div>
  );
};

export default QuotationPage;
