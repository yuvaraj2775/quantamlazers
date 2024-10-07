"use client";
import React, { useState } from "react";

const Page = () => {
  const [input, setInput] = useState({
    Address: "",
    Date: "",
    gstnumber: "",
    kindattention: "",
    reference: '',
    subject: ""
  });

  const [items, setItems] = useState([
    {
      description: "",
      hsncode: "",
      qty: "",
      unit: "",
      unitCost: "",
      taxableValue: "",
      taxtype: "",
      percentage: "",
      taxamt: "",
      percentage2: "",
      taxamt2: ""
    }
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...items];
    newItems[index][name] = value;
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(input, "hello");

    const response = await fetch("/api/quatation", {
      method: "POST",
      body: JSON.stringify({ ...input, items }), // Include items
      headers: {
        "Content-Type": "application/json",
      }
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
        reference: '',
        subject: ""
      });
      setItems([{ description: "", hsncode: "", qty: "", unit: "", unitCost: "", taxableValue: "", taxtype: "", percentage: "", taxamt: "", percentage2: "", taxamt2: "" }]); // Reset items
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="border-2 h-screen overflow-y-auto w-full p-4">
        <div className="flex justify-between">
          <div></div>
          <div>
            <h1>Quotation Form</h1>
          </div>
          <div>
            <h1>Quotation NO: Draft</h1>
          </div>
        </div>

        <div className="grid grid-cols-2">
          <div>
            <label htmlFor="Address">Address</label>
            <textarea
              name="Address"
              value={input.Address}
              onChange={handleInputChange}
              className="border-2 rounded mt-1 uppercase w-full h-[175px] px-2 -pt-10 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div className="ml-1">
            <div className="grid grid-cols-2 gap-1">
              <div>
                <label htmlFor="Date">Date</label>
                <input
                  type="text"
                  className="border-2 h-10 w-full rounded"
                  name="Date"
                  value={input.Date}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="reference">Reference Number</label>
                <input
                  type="text"
                  className="w-full h-10 border-2 rounded"
                  name="reference"
                  value={input.reference}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <div>
                <label htmlFor="gstnumber">GST Number</label>
                <input
                  type="text"
                  className="border-2 w-full h-10 rounded"
                  name="gstnumber"
                  value={input.gstnumber}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="kindattention">Kind Attention</label>
                <input
                  type="text"
                  className="border-2 w-full h-10 rounded"
                  name="kindattention"
                  value={input.kindattention}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div>
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                className="border-2 h-10 rounded w-full"
                name="subject"
                value={input.subject}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="border-2 w-full mt-5">
            <thead>
              <tr>
                <th>SL.NO</th>
                <th>Item Name/Description</th>
                <th>HSN Code</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Unit Cost</th>
                <th>Taxable Value</th>
                <th>Type of Tax</th>
                <th>%</th>
                <th>Tax Amt</th>
                <th>Type of Tax</th>
                <th>%</th>
                <th>Tax Amt</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <input
                      type="text"
                      className="border-2"
                      name="description"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, e)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="border-2"
                      name="hsncode"
                      value={item.hsncode}
                      onChange={(e) => handleItemChange(index, e)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="border-2"
                      name="qty"
                      value={item.qty}
                      onChange={(e) => handleItemChange(index, e)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="border-2"
                      name="unit"
                      value={item.unit}
                      onChange={(e) => handleItemChange(index, e)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="border-2"
                      name="unitCost"
                      value={item.unitCost}
                      onChange={(e) => handleItemChange(index, e)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="border-2"
                      name="taxableValue"
                      value={item.taxableValue}
                      onChange={(e) => handleItemChange(index, e)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="border-2"
                      name="taxtype"
                      value={item.taxtype}
                      onChange={(e) => handleItemChange(index, e)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="border-2"
                      name="percentage"
                      value={item.percentage}
                      onChange={(e) => handleItemChange(index, e)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="border-2"
                      name="taxamt"
                      value={item.taxamt}
                      onChange={(e) => handleItemChange(index, e)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="border-2"
                      name="taxtype2"
                      value={item.taxtype2}
                      onChange={(e) => handleItemChange(index, e)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="border-2"
                      name="percentage2"
                      value={item.percentage2}
                      onChange={(e) => handleItemChange(index, e)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="border-2"
                      name="taxamt2"
                      value={item.taxamt2}
                      onChange={(e) => handleItemChange(index, e)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div>
            <label>Total Number of Quantities :</label>
            <p>{items.reduce((sum, item) => sum + (parseInt(item.qty) || 0), 0)}</p>
          </div>

          {/* Additional Costs Section */}
          <div className="grid-cols-4 grid">
            <div>
              <label>Discount Amount (%)</label>
              <input type="text" className="border-2 h-10 rounded" />
            </div>
            <div>
              <label>Package Charges</label>
              <input type="text" className="border-2 h-10 rounded" />
            </div>
            <div>
              <label>Transportation Charges</label>
              <input type="text" className="border-2 h-10 rounded" />
            </div>
            <div>
              <label>Other Cost</label>
              <input type="text" className="border-2 h-10 rounded" />
            </div>
          </div>

          {/* Summary Section */}
          <div className="grid grid-cols-2">
            <div>
              <div>
                <span>Grand Total (In Words)</span>
                <p></p>
              </div>
              <div>
                <span>Tax Amount</span>
                <div className="grid grid-cols-2">
                  <div>
                    <label>CGST :</label>
                    <p></p>
                  </div>
                  <div>
                    <label>IGST :</label>
                    <p></p>
                  </div>
                </div>
                <div className="grid grid-cols-2">
                  <div>
                    <label>SGST :</label>
                    <p></p>
                  </div>
                  <div>
                    <label>UGST :</label>
                    <p></p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="grid grid-cols-2">
                <p>Sub-Total Amt</p>
                <p>0.00</p>
              </div>
              <div className="grid grid-cols-2">
                <p>Discount (0 %)</p>
                <p>0.00</p>
              </div>
              <div className="grid grid-cols-2">
                <p>CGST</p>
                <p>0.00</p>
              </div>
              <div className="grid grid-cols-2">
                <p>SGST</p>
                <p>0.00</p>
              </div>
              <div className="grid grid-cols-2">
                <p>IGST</p>
                <p>0.00</p>
              </div>
              <div className="grid grid-cols-2">
                <p>UGST</p>
                <p>0.00</p>
              </div>
              <div className="grid grid-cols-2">
                <p>Package Charges</p>
                <p>0.00</p>
              </div>
              <div className="grid grid-cols-2">
                <p>Transportation Charges</p>
                <p>0.00</p>
              </div>
              <div className="grid grid-cols-2">
                <p>Other Cost</p>
                <p>0.00</p>
              </div>
              <div className="grid grid-cols-2">
                <p>Grand Total (RS)</p>
                <p>0.00</p>
              </div>
            </div>
          </div>

          {/* Payment Terms Section */}
          <div>
            <h1>Payment Terms</h1>
            <div className="border-2">
              <input type="text" placeholder="Enter Payment Term 1" className="w-full border-none" />
              <input type="text" placeholder="Enter Payment Term 2" className="w-full" />
              <input type="text" placeholder="Enter Payment Term 3" className="w-full" />
              <input type="text" placeholder="Enter Payment Term 4" className="w-full" />
            </div>
          </div>
          <div>
            <button type="submit" className="text-center">
              Submit
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Page;
