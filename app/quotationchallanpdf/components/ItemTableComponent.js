import React, { useEffect, useState } from "react";

const ItemTableComponent = ({ fetcheddata }) => {
  const [itemdata, setitemdata] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [hsndata, sethsndata] = useState([]);
  const [hsnsuggestions, sethsnSuggestions] = useState([]);

  console.log(fetcheddata?.itemdata.description,"fetched")

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/itemmaster");
        if (!response.ok) throw new Error("failed to fetch data");
        const result = await response.json();
        setitemdata(result.data || []);
      } catch (error) {
        console.log("fetch failed:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="mt-5">
      <table className="w-full text-left ">
        <thead>
          <tr>
            <th className="px-4 border-t-2 border-r-2 border-black py-2">
              SL. No.
            </th>
            <th className="px-4 border-t-2 border-r-2 border-black py-2">
              Item Name / Description
            </th>
            <th className="px-4 border-t-2 border-r-2 border-black py-2">
              HSN Code
            </th>
            <th className="px-4 border-t-2 border-r-2 border-black py-2">Qty</th>
            <th className="px-4 border-t-2 border-r-2 border-black py-2">Unit</th>
            <th className="px-4 border-t-2 border-r-2 border-black py-2">
              Unit Cost
            </th>
            <th className="px-4 border-t-2 border-r-2 border-black py-2">
              Taxable Value
            </th>
            <th
              colSpan="2"
              className="px-4 py-2 border-t-2 border-r-2 border-black"
            >
              CGST/IGST Rate
            </th>
            <th colSpan="2" className="px-4 py-2 border-t-2 border-black">
              SGST/UGST Rate
            </th>
          </tr>
          <tr>
            <th className="border-t-2 border-r-2 border-black px-4 py-2"></th>
            <th className="border-t-2 border-r-2 border-black px-4 py-2"></th>
            <th className="border-t-2 border-r-2 border-black px-4 py-2"></th>
            <th className="border-t-2 border-r-2 border-black px-4 py-2"></th>
            <th className="border-t-2 border-r-2 border-black px-4 py-2"></th>
            <th className="border-t-2 border-r-2 border-black px-4 py-2"></th>
            <th className="border-t-2 border-r-2 border-black px-4 py-2"></th>
            <th className="border-t-2 border-r-2 border-black px-4 py-2">%</th>
            <th className="border-t-2 border-r-2 border-black px-4 py-2">
              Tax Amt
            </th>
            <th className="border-t-2 border-r-2 border-black px-4 py-2">%</th>
            <th className="border-t-2 border-black px-4 py-2">Tax Amt</th>
          </tr>
        </thead>

        <tbody>
  {fetcheddata?.itemdata.map((item, index) => {
    // Check if there's a matching suggestion for the description
    const suggestion = suggestions.find(
      (s) => item.description === s.name
    );
    const isDisabledDescription = suggestion?.enabled === 0; // Check if the matched suggestion is disabled

    // Check if there's a matching suggestion for the HSN code
    const hsnSuggestion = hsnsuggestions.find(
      (s) => item.hsncode === s.name
    );
    const isDisabledHsn = hsnSuggestion?.enabled === 0; // Check if the matched suggestion is disabled

    return (
      <tr key={item.id || index}>
        <td className="border-t-2 border-r-2 border-black px-4 py-2">
          {index + 1}
        </td>
        <td className="border-t-2 border-r-2 border-black px-4 py-2" style={{ color: isDisabledDescription ? 'red' : 'inherit' }}>
          {item.description}
        </td>
        <td className="border-t-2 border-r-2 border-black px-4 py-2" style={{ color: isDisabledHsn ? 'red' : 'inherit' }}>
          {item.hsncode}
        </td>
        <td className="border-t-2 border-r-2 text-right border-black px-4 py-2">
          {item.qty}
        </td>
        <td className="border-t-2 border-r-2 border-black px-4 py-2">
          {item.unit}
        </td>
        <td className="border-t-2 border-r-2 text-right border-black px-4 py-2">
          {item.unitCost}
        </td>
        <td className="border-t-2 border-r-2 text-right border-black px-4 py-2">
          {item.taxableValue}
        </td>
        <td className="border-t-2 border-r-2 text-right border-black px-4 py-2">
          {item.percentage}
        </td>
        <td className="border-t-2 border-r-2 text-right border-black px-4 py-2">
          {item.taxamt}
        </td>
        <td className="border-t-2 border-r-2 text-right border-black px-4 py-2">
          {item.percentage2}
        </td>
        <td className="border-t-2 border-black text-right px-4 py-2">
          {item.taxamt2}
        </td>
      </tr>
    );
  })}
</tbody>


        <tfoot>
          <tr className="border-2 border-y-black">
            <td
              colSpan="2"
              className="border-black px-4 pb-2 text-right font-bold"
            >
              Total Taxable Value
            </td>
            <td></td>
            <td colSpan="" className="px-4 pb-2 text-right font-bold">
              {fetcheddata?.itemdata
                .reduce((total, item) => total + parseFloat(item.qty), 0)
                .toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ItemTableComponent;
