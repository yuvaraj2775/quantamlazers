import React from "react";

const ItemTableComponent = ({ fetcheddata }) => {
  return (
    <div className="mt-5">
      <table className="w-full text-left ">
        <thead>
          <tr>
            <th class=" px-4 border-t-2 border-r-2 border-black py-2">
              SL. No.
            </th>
            <th class=" px-4 border-t-2 border-r-2 border-black py-2">
              Item Name / Description
            </th>
            <th class=" px-4 border-t-2 border-r-2 border-black py-2">
              HSN Code
            </th>
            <th class=" px-4 border-t-2 border-r-2 border-black py-2">Qty</th>
            <th class=" px-4 border-t-2 border-r-2 border-black py-2">Unit</th>
            <th class=" px-4 border-t-2 border-r-2 border-black py-2">
              Unit Cost
            </th>
            <th class=" px-4 border-t-2 border-r-2 border-black py-2">
              Taxable Value
            </th>
            <th
              colspan="2"
              class=" px-4 py-2 border-t-2 border-r-2 border-black"
            >
              CGST/IGST Rate
            </th>
            <th colspan="2" class=" px-4 py-2 border-t-2 border-black">
              SGST/UGST Rate
            </th>
          </tr>
          <tr class="">
            <th class=" border-t-2 border-r-2 border-black px-4 py-2"></th>
            <th class=" border-t-2 border-r-2 border-black px-4 py-2"></th>
            <th class=" border-t-2 border-r-2 border-black px-4 py-2"></th>
            <th class=" border-t-2 border-r-2 border-black px-4 py-2"></th>
            <th class="  border-t-2 border-r-2 border-black px-4 py-2"></th>
            <th class=" border-t-2 border-r-2 border-black px-4 py-2"></th>
            <th class="border-t-2 border-r-2 border-black px-4 py-2"></th>
            <th class=" border-t-2 border-r-2 border-black px-4 py-2">%</th>
            <th class=" border-t-2 border-r-2 border-black px-4 py-2">
              Tax Amt
            </th>
            <th class=" border-t-2 border-r-2 border-black px-4 py-2">%</th>
            <th class=" border-t-2  border-black px-4 py-2">Tax Amt</th>
          </tr>
        </thead>

        <tbody>
          {fetcheddata?.itemdata.map((item, index) => (
            <tr key={item.id || index}>
              {" "}
              {/* Assuming each item has a unique id, otherwise use index */}
              <td className=" border-t-2 border-r-2 border-black px-4 py-2">
                {index + 1}
              </td>
              <td className=" border-t-2 border-r-2 border-black px-4 py-2">
                {item.description}
              </td>
              <td className=" border-t-2 border-r-2 border-black px-4 py-2">
                {item.hsncode}
              </td>
              <td className=" border-t-2 border-r-2 text-right border-black px-4 py-2">
                {item.qty}
              </td>
              <td className=" border-t-2 border-r-2 border-black px-4 py-2">
                {item.unit}
              </td>
              <td className="border-t-2 border-r-2 text-right border-black  px-4 py-2">
                {item.unitCost}
              </td>
              <td className=" border-t-2 border-r-2 text-right border-black px-4 py-2">
                {item.taxableValue}
              </td>
              <td className=" border-t-2 border-r-2 text-right border-black px-4 py-2">
                {item.percentage}
              </td>
              <td className=" border-t-2 border-r-2 text-right border-black px-4 py-2">
                {item.taxamt}
              </td>
              <td className=" border-t-2 border-r-2 text-right border-black px-4 py-2">
                {item.percentage2}
              </td>
              <td className=" border-t-2 border-black text-right px-4 py-2">
                {item.taxamt2}
              </td>
            </tr>
          ))}
        </tbody>

        <tfoot>
          <tr class="border-2 border-y-black">
            <td
              colspan="2"
              class=" border-black px-4 pb-2  text-right font-bold"
            >
              Total Taxable Value
            </td>
            <td></td>
            <td colspan="" class="  px-4 pb-2 text-right font-bold">
              {fetcheddata?.itemdata
                .reduce(
                  (total, item) => total + parseFloat(item.qty),
                  0
                )
                .toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ItemTableComponent;
