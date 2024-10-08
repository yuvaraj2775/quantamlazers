"use client";
import React, { useState } from "react";

const Page = () => {
  const [input, setInput] = useState({
    Address: "",
    Date: "",
    gstnumber: "",
    kindattention: "",
    reference: "",
    subject: "",
  });

  const [items, setItems] = useState([
    {
      description: "",
      hsncode: "",
      qty: "",
      unit: "NOS",
      unitCost: "",
      taxableValue: "",
      taxtype: "CGST",
      percentage: "9",
      taxamt: "",
      typeoftax: "SGST",
      percentage2: "9",
      taxamt2: "",
    },
  ]);

  const [discount, setDiscount] = useState(0);
  const [packageCharges, setPackageCharges] = useState(0);
  const [transportCharges, setTransportCharges] = useState(0);
  const [otherCosts, setOtherCosts] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...items];
    newItems[index][name] = value;

    if (name === "taxtype") {
      if (value === "CGST") {
        newItems[index].percentage = "9";
        newItems[index].percentage2 = "9";
      } else if (value === "IGST") {
        newItems[index].percentage = "18";
        newItems[index].percentage2 = "0"; // IGST does not have SGST
      }
    }

    if (name === "qty" || name === "unitCost") {
      const qty = parseFloat(newItems[index].qty) || 0;
      const unitCost = parseFloat(newItems[index].unitCost) || 0;
      newItems[index].taxableValue = (qty * unitCost).toFixed(2);
    }

    const taxableValue = parseFloat(newItems[index].taxableValue) || 0;
    const cgstPercentage = parseFloat(newItems[index].percentage) || 0;
    const sgstPercentage = parseFloat(newItems[index].percentage2) || 0;

    // Calculate CGST and SGST or IGST
    if (newItems[index].taxtype === "CGST") {
      newItems[index].taxamt = ((taxableValue * cgstPercentage) / 100).toFixed(2);
      newItems[index].taxamt2 = ((taxableValue * sgstPercentage) / 100).toFixed(2); // SGST
    } else if (newItems[index].taxtype === "IGST") {
      newItems[index].taxamt = ((taxableValue * (cgstPercentage + sgstPercentage)) / 100).toFixed(2);
      newItems[index].taxamt2 = "0.00"; // IGST does not have a second tax
    }

    setItems(newItems);
  };

  const calculateTotals = () => {
    const subTotal = items.reduce((sum, item) => sum + parseFloat(item.taxableValue || 0), 0);
    const totalTax = items.reduce((sum, item) => sum + parseFloat(item.taxamt || 0) + parseFloat(item.taxamt2 || 0), 0);

    const discountAmount = (subTotal * (discount / 100));
    const grandTotal = subTotal + totalTax - discountAmount + parseFloat(packageCharges) + parseFloat(transportCharges) + parseFloat(otherCosts);

    return {
      subTotal,
      totalTax,
      discountAmount,
      grandTotal,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const totals = calculateTotals();
    console.log(input, "hello");
    console.log(items, "hello2");
    console.log(totals, "totals");

    const response = await fetch("/api/quatation", {
      method: "POST",
      body: JSON.stringify({ ...input, items, totals }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    if (!response.ok) {
      console.error("Error while submitting:", result.error);
    } else {
      console.log("Data added", result);
      setInput({
        Address: "",
        Date: "",
        gstnumber: "",
        kindattention: "",
        reference: "",
        subject: "",
      });
      setItems([{
        description: "",
        hsncode: "",
        qty: "",
        unit: "NOS",
        unitCost: "",
        taxableValue: "",
        taxtype: "CGST",
        percentage: "9",
        taxamt: "",
        typeoftax: "SGST",
        percentage2: "9",
        taxamt2: "",
      }]); // Reset items
      setDiscount(0);
      setPackageCharges(0);
      setTransportCharges(0);
      setOtherCosts(0);
    }
  };

  const totals = calculateTotals();

  return (
    <form onSubmit={handleSubmit} className=" overflow-y-auto h-screen p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Quotation Form</h1>
        <h2 className="text-lg">Quotation NO: Draft</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="Address" className="block mb-1 text-sm font-semibold ">Address</label>
          <textarea
            name="Address"
            value={input.Address}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md w-full h-32 px-2 py-1 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="Date" className="block mb-1 text-sm  font-semibold ">Date</label>
              <input
                type="text"
                className="border border-gray-300 rounded-md w-full h-10 px-2"
                name="Date"
                value={input.Date}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="reference" className="block mb-1 text-sm  font-semibold">Reference Number</label>
              <input
                type="text"
                className="border border-gray-300 rounded-md w-full h-10 px-2"
                name="reference"
                value={input.reference}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="gstnumber" className="block mb-1 text-sm  font-semibold">GST Number</label>
              <input
                type="text"
                className="border border-gray-300 rounded-md w-full h-10 px-2"
                name="gstnumber"
                value={input.gstnumber}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="kindattention" className="block mb-1 text-sm  font-semibold">Kind Attention</label>
              <input
                type="text"
                className="border border-gray-300 rounded-md w-full h-10 px-2"
                name="kindattention"
                value={input.kindattention}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div>
            <label htmlFor="subject" className="block mb-1 text-sm  font-semibold">Subject</label>
            <input
              type="text"
              className="border border-gray-300 rounded-md w-full h-10 px-2"
              name="subject"
              value={input.subject}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto mt-5">
        <table className="border border-gray-300 w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 p-2">SL.NO</th>
              <th className="border border-gray-300 p-2">Item Name/Description</th>
              <th className="border border-gray-300 p-2">HSN Code</th>
              <th className="border border-gray-300 p-2">Qty</th>
              <th className="border border-gray-300 p-2">Unit</th>
              <th className="border border-gray-300 p-2">Unit Cost</th>
              <th className="border border-gray-300 p-2">Taxable Value</th>
              <th className="border border-gray-300 p-2">Type of Tax</th>
              <th className="border border-gray-300 p-2">%</th>
              <th className="border border-gray-300 p-2">Tax Amt</th>
              <th className="border border-gray-300 p-2">Type of Tax</th>
              <th className="border border-gray-300 p-2">%</th>
              <th className="border border-gray-300 p-2">Tax Amt</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md w-full h-10 px-2"
                    name="description"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, e)}
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md w-full h-10 px-2"
                    name="hsncode"
                    value={item.hsncode}
                    onChange={(e) => handleItemChange(index, e)}
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="number"
                    className="border border-gray-300 rounded-md w-full h-10 px-2"
                    name="qty"
                    value={item.qty}
                    onChange={(e) => handleItemChange(index, e)}
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <select
                    name="unit"
                    onChange={(e) => handleItemChange(index, e)}
                    value={item.unit}
                    className="border border-gray-300 rounded-md h-10 w-full"
                  >
                    <option value="NOS">NOS</option>
                    <option value="EACH">EACH</option>
                    <option value="SET">SET</option>
                  </select>
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md w-full h-10 px-2"
                    name="unitCost"
                    value={item.unitCost}
                    onChange={(e) => handleItemChange(index, e)}
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md w-full h-10 px-2"
                    name="taxableValue"
                    value={item.taxableValue}
                    readOnly
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <select
                    name="taxtype"
                    className="border border-gray-300 rounded-md h-10 w-full"
                    onChange={(e) => handleItemChange(index, e)}
                    value={item.taxtype}
                  >
                    <option value="CGST">CGST</option>
                    <option value="IGST">IGST</option>
                  </select>
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md w-full h-10 px-2"
                    name="percentage"
                    value={item.percentage}
                    onChange={(e) => handleItemChange(index, e)}
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md w-full h-10 px-2"
                    name="taxamt"
                    value={item.taxamt}
                    readOnly
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <select
                    name="typeoftax"
                    onChange={(e) => handleItemChange(index, e)}
                    value={item.typeoftax}
                    className="border border-gray-300 rounded-md h-10 w-full"
                  >
                    <option value="SGST">SGST</option>
                    <option value="UGST">UGST</option>
                  </select>
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md w-full h-10 px-2"
                    name="percentage2"
                    value={item.percentage2}
                    onChange={(e) => handleItemChange(index, e)}
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md w-full h-10 px-2"
                    name="taxamt2"
                    value={item.taxamt2}
                    readOnly
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4">
          <label className="text-sm  font-semibold">Total Number of Quantities:</label>
          <p>{items.reduce((sum, item) => sum + (parseInt(item.qty) || 0), 0)}</p>
        </div>
      </div>

      {/* Additional Costs Section */}
      <div className="grid grid-cols-4 gap-4 mt-5">
        <div>
          <label className="text-sm  font-semibold">Discount Amount (%)</label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="border border-gray-300 h-10 rounded-md w-full px-2"
          />
        </div>
        <div>
          <label className="text-sm  font-semibold">Package Charges</label>
          <input
            type="number"
            value={packageCharges}
            onChange={(e) => setPackageCharges(e.target.value)}
            className="border border-gray-300 h-10 rounded-md w-full px-2"
          />
        </div>
        <div>
          <label className="text-sm  font-semibold">Transportation Charges</label>
          <input
            type="number"
            value={transportCharges}
            onChange={(e) => setTransportCharges(e.target.value)}
            className="border border-gray-300 h-10 rounded-md w-full px-2"
          />
        </div>
        <div>
          <label className="text-sm  font-semibold">Other Cost</label>
          <input
            type="number"
            value={otherCosts}
            onChange={(e) => setOtherCosts(e.target.value)}
            className="border border-gray-300 h-10 rounded-md w-full px-2"
          />
        </div>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-2 gap-4 mt-5">
        <div>
          <div>
            <span className="text-sm  font-semibold">Grand Total (In Words)</span>
            <p>{/* Placeholder for grand total in words */}</p>
          </div>
          <div>
            <span className="text-sm  font-semibold">Tax Amount</span>
            <div className="grid grid-cols-2">
              <div>
                <label>CGST:</label>
                <p>{(totals.totalTax / 2).toFixed(2)}</p>
              </div>
              <div>
                <label>IGST:</label>
                <p>{totals.totalTax.toFixed(2)}</p>
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div>
                <label>SGST:</label>
                <p>{(totals.totalTax / 2).toFixed(2)}</p>
              </div>
              <div>
                <label>UGST:</label>
                <p>{totals.totalTax.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-2">
            <p>Sub-Total Amt</p>
            <p>{totals.subTotal.toFixed(2)}</p>
          </div>
          <div className="grid grid-cols-2">
            <p>Discount ({discount} %)</p>
            <p>{totals.discountAmount.toFixed(2)}</p>
          </div>
          <div className="grid grid-cols-2">
            <p>CGST</p>
            <p>{(totals.totalTax / 2).toFixed(2)}</p>
          </div>
          <div className="grid grid-cols-2">
            <p>SGST</p>
            <p>{(totals.totalTax / 2).toFixed(2)}</p>
          </div>
          <div className="grid grid-cols-2">
            <p>IGST</p>
            <p>{totals.totalTax.toFixed(2)}</p>
          </div>
          <div className="grid grid-cols-2">
            <p>UGST</p>
            <p>{totals.totalTax.toFixed(2)}</p>
          </div>
          <div className="grid grid-cols-2">
            <p>Package Charges</p>
            <p>{packageCharges}</p>
          </div>
          <div className="grid grid-cols-2">
            <p>Transportation Charges</p>
            <p>{transportCharges}</p>
          </div>
          <div className="grid grid-cols-2">
            <p>Other Cost</p>
            <p>{otherCosts}</p>
          </div>
          <div className="grid grid-cols-2">
            <p>Grand Total (RS)</p>
            <p>{totals.grandTotal.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Payment Terms Section */}
      <div className="mt-5">
        <h1 className="text-sm  font-semibold">Payment Terms</h1>
        <div className="border border-gray-300 p-4">
          <input
            type="text"
            placeholder="Enter Payment Term 1"
            className="border border-gray-300 rounded-md w-full mb-2 h-10 px-2"
          />
          <input
            type="text"
            placeholder="Enter Payment Term 2"
            className="border border-gray-300 rounded-md w-full mb-2 h-10 px-2"
          />
          <input
            type="text"
            placeholder="Enter Payment Term 3"
            className="border border-gray-300 rounded-md w-full mb-2 h-10 px-2"
          />
          <input
            type="text"
            placeholder="Enter Payment Term 4"
            className="border border-gray-300 rounded-md w-full mb-2 h-10 px-2"
          />
        </div>
      </div>
      <div className="mt-5">
        <button type="submit" className="bg-blue-600 text-white rounded-md px-4 py-2">
          Submit
        </button>
      </div>
    </form>
  );
};

export default Page;
