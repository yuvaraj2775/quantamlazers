import React, { useEffect, useState } from 'react';

const ItemTable = ({ quotation }) => {
  const [itemdata, setItemData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [hsndata, sethsndata] = useState([]);
  const [hsnsuggestions, sethsnSuggestions] = useState([]);

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

  return (
    <div className="my-10 mb-5">
      <table className="min-w-full mt-10 overflow-x-auto">
        <thead className="border-y-2 border-black">

          <tr>
            <th className="border-r-2 border-black pb-4">SL. <br /> NO</th>
            <th className="border-r-2 border-black pb-4 w-72">Item Name / <br /> Description</th>
            <th className="border-r-2 border-black pb-4 w-28">HSN <br /> Code</th>
            <th className="border-r-2 border-black pb-4">Qty</th>
            <th className="border-r-2 border-black pb-4">UMO</th>
            <th className="pb-4 w-72 px-2">Remarks</th>
          </tr>
        </thead>
        <tbody className="border-b-2 border-black">
          {quotation.data2.map((t, index) => {
            const suggestion = suggestions.find(s => t.name === s.name);
            const isDisabledDescription = suggestion?.enabled === 0;

            const hsnSuggestion = hsnsuggestions.find(
                (s) => t.hsn === s.name
              );
              const isDisabledHsn = hsnSuggestion?.enabled === 0;

            return (
              <tr className="text-center h-8 pb-3" key={index}>
                <td className="border-r-2 border-black text-sm pb-4">{index + 1}</td>
                <td
                  className="border-r-2 border-black text-left px-2 text-sm pb-4"
                  style={{ color: isDisabledDescription ? 'red' : 'inherit' }}
                >
                  {t.name}
                </td>
                <td className="border-r-2 text-sm text-left px-2 border-black pb-4"style={{ color: isDisabledHsn ? 'red' : 'inherit' }}>{t.hsn}</td>
                <td className="border-r-2 text-sm border-black text-right pr-2 pb-4">{t.qty}</td>
                <td className="border-r-2 text-sm border-black pb-4">{t.umoremarks}</td>
                <td className="pb-4 text-sm text-left px-2">{t.remarks}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ItemTable;
