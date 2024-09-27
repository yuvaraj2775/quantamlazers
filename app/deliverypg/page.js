"use client";

import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

const Page = () => {
  const [fetchedData, setFetchedData] = useState(null);
  const pdfRef = useRef();
 
  const router = useRouter();
  
  const save =()=>{
    router.push("/delivery");
  }

  const pdfDownload = async () => {
    const input = pdfRef.current;
    const inputWidth = input.clientWidth;
    const inputHeight = input.clientHeight;

    const margin = 0.02; // Adjust margins as needed
    const pdfWidth = 700.28; // A4 width in points
    const pdfHeight = Math.min(inputHeight, 841.89); // Use A4 height or content height

    const pdf = new jsPDF("p", "pt", [pdfWidth, pdfHeight]);

    html2canvas(input, { scale: 1.5 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      // Maintain aspect ratio
      const imgWidth = pdfWidth * (1 - margin * 2);
      const imgHeight = canvas.height * imgWidth;

      const topMargin = pdfHeight * margin;
      const leftMargin = pdfWidth * margin;
      const imgX = leftMargin;
      const imgY = topMargin;

      // Adjust height based on content to avoid blank space
      const adjustedHeight =
        imgHeight > pdfHeight - topMargin * 2
          ? pdfHeight - topMargin * 2
          : imgHeight;

      // Add the image to the PDF
      pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth, adjustedHeight);

      // Save the PDF
      pdf.save("delivery-challan.pdf");
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
  const Header = () => (
    <div className="flex ml-3 my-12">
      <img
        src={"img/Company_logo.jpg"}
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
          <p className="capitalize text-sm font-bold">Phone No: 1234567890</p>
          <p className="text-sm font-bold">GST NO: 33AYXPP7084J1ZI</p>
        </div>
      </div>
    </div>
  );
  const ItemTable = ({ items }) => (
    <table className="min-w-full mt-10 overflow-x-auto">
      <thead className="border-y-2 border-black">
        <tr>
          <th className="border-r-2 border-black pb-4">SL.NO</th>
          <th className="border-r-2 border-black pb-4 w-72">
            Item Name / Description
          </th>
          <th className="border-r-2 border-black pb-4 w-28">HSN Code</th>
          <th className="border-r-2 border-black pb-4">Qty</th>
          <th className="border-r-2 border-black pb-4">UMO</th>
          <th className="pb-4 w-72 px-2">Remarks</th>
        </tr>
      </thead>
      <tbody className="border-b-2 border-black">
        {items.map((t, index) => (
          <tr className="text-center h-8 pb-3" key={index}>
            <td className="border-r-2 border-black text-sm pb-4">
              {index + 1}
            </td>
            <td className="border-r-2 border-black text-left px-2 text-sm capitalize pb-4">
              {t.name}
            </td>
            <td className="border-r-2 text-sm border-black capitalize pb-4">
              {t.hsn}
            </td>
            <td className="border-r-2 text-sm border-black capitalize text-right pr-2 pb-4">
              {t.qty}
            </td>
            <td className="border-r-2 text-sm border-black capitalize pb-4">
              {t.umoremarks}
            </td>
            <td className="pb-4 text-sm text-left px-2 capitalize">
              {t.remarks}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const DeliveryDetails = ({ item }) => (
    <div className="px-2 py-3 capitalize font-semibold">
      <h1 className="font-bold uppercase">DC details :</h1>
      <div className="mt-2 grid pb-3 grid-cols-2">
        <label>DC No</label>
        <p className="font-normal">: {item.dc_number}</p>
        <label>Date</label>
        <p className="font-normal">: {item.dc_date}</p>
        <label>Your Order Number</label>
        <p className="font-normal">: {item.ordernumber}</p>
        <label>Issue Date</label>
        <p className="font-normal">: {item.dc_issue_date}</p>
        <label>Your DC No</label>
        <p className="font-normal">: {item.dc_number}</p>
        <label>Date</label>
        <p className="font-normal">: {item.orderdate}</p>
      </div>
    </div>
  );
  const BuyerInfo = ({ item }) => (
    <div className="border-r-2 px-2 py-3 border-black">
      <p className="font-bold uppercase">Buyer :</p>
      <pre className="uppercase mt-2">{item.buyer}</pre>
      <p className="uppercase font-bold mb-4 mt-3">
        GST NO : <span className="font-normal">{item.gst_number}</span>
      </p>
    </div>
  );

  return (
    <div className="h-screen p-4 mx-auto overflow-y-auto">
      <div
        className="w-full max-w-4xl mx-auto border-2 border-black"
        ref={pdfRef}
      >
        {fetchedData?.data.map((item, index) => (
          <div className="mt-10" key={index}>
            <Header />
            <div className="min-w-full font-semibold text-xl capitalize text-center mt-5 border-y-2 pb-3 border-black">
              <h3 className="tracking-widest mt-1">Delivery Challan</h3>
            </div>
            <div className="min-w-full grid grid-cols-2 border-y-2 my-14   border-black">
              <BuyerInfo item={item} />

              <DeliveryDetails item={item} />
            </div>
            <div className="my-10 mb-5">
              <ItemTable items={fetchedData?.data2} />
            </div>

            {/* Other footer components go here */}
            <div className="font-bold mx-3 ">
              <div className="flex justify-end w-[59%]">
                <p className="font-bold  text-sm">
                  Total Number of Quantities :
                  <span className="font-normal ml-7 text-sm">
                    {fetchedData.data2.reduce(
                      (acc, item) => acc + Number(item.qty || 0),
                      0
                    )}
                  </span>
                </p>
              </div>
              <p className="mt-3 my-5 text-sm">
                Vehicle Number :{" "}
                <span className="uppercase font-normal text-sm">
                  {item.vehicle_number}
                </span>
              </p>

              <div className="flex justify-between my-16">
                <p className="text-sm">
                  Received the Above Goods In Good Condition
                </p>
                <p className="text-right text-sm">For QUANTUM LAZERS</p>
              </div>
              <div className="my-14 flex justify-between">
                <p className="text-sm">Receiver's Signature</p>
                <p className="text-sm">Authorized Signature</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex justify-between mx-9">
        <button onClick={save} className="p-2 border-2 flex rounded-md items-center  bg-green-600 text-white ">
        <PlusIcon className="w-4 h-4" />
        <span>Add items</span>
        </button>

       
        <button
          onClick={pdfDownload}
          className="rounded-md p-2 border-2  bg-red-500 text-white"
        >
          Print
        </button>
      </div>
    </div>
  );
};

export default Page;
