// InvoiceSummary.js
import React from 'react';

const Invoicesummary = ({ grandTotalInWords, totals, items, input }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mt-5">
      <div>
        <div>
          <span className="text-sm font-semibold">Grand Total (In Words)</span>
          <p className="capitalize">{grandTotalInWords}</p>
        </div>
        <div>
          <span className="text-sm font-semibold">Tax Amount</span>
          <div className="grid grid-cols-2">
            <div>
              <label className="text-sm">CGST:</label>
              <p className="text-sm">
                {totals.totalTax > 0 && items.some((item) => item.taxtype === "CGST")
                  ? (totals.totalTax / 2).toFixed(2)
                  : "0.00"}
              </p>
            </div>
            <div>
              <label className="text-sm">IGST:</label>
              <p className="text-sm">
                {totals.totalTax > 0 && items.every((item) => item.taxtype === "IGST")
                  ? totals.totalTax.toFixed(2)
                  : "0.00"}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 mt-2">
            <div>
              <label className="text-sm">SGST:</label>
              <p className="text-sm">
                {totals.totalTax > 0 && items.some((item) => item.taxtype === "CGST")
                  ? (totals.totalTax / 2).toFixed(2)
                  : "0.00"}
              </p>
            </div>
            <div>
              <label className="text-sm">UGST:</label>
              <p className="text-sm">
                {totals.totalTax > 0 && items.every((item) => item.taxtype === "UGST")
                  ? totals.totalTax.toFixed(2)
                  : "0.00"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[70%]">
        <div className="grid grid-cols-2">
          <p className="text-sm">Sub-Total Amt</p>
          <p className="text-sm text-right">{totals.subTotal.toFixed(2)}</p>
        </div>
        <div className="grid grid-cols-2 mt-1">
          <p className="text-sm">Discount ({input.discount || 0}%)</p>
          <p className="text-sm text-right">{totals.discountAmount.toFixed(2)}</p>
        </div>
        <div className="grid grid-cols-2 mt-1">
          <p className="text-sm">CGST</p>
          <p className="text-sm text-right">
            {totals.totalTax > 0 && items.some((item) => item.taxtype === "CGST")
              ? (totals.totalTax / 2).toFixed(2)
              : "0.00"}
          </p>
        </div>
        <div className="grid grid-cols-2 mt-1">
          <p className="text-sm">SGST</p>
          <p className="text-sm text-right">
            {totals.totalTax > 0 && items.some((item) => item.taxtype === "CGST")
              ? (totals.totalTax / 2).toFixed(2)
              : "0.00"}
          </p>
        </div>
        <div className="grid grid-cols-2 mt-1">
          <p className="text-sm">IGST</p>
          <p className="text-sm text-right">
            {totals.totalTax > 0 && items.every((item) => item.taxtype === "IGST")
              ? totals.totalTax.toFixed(2)
              : "0.00"}
          </p>
        </div>
        <div className="grid grid-cols-2 mt-1">
          <p className="text-sm">UGST</p>
          <p className="text-sm text-right">
            {totals.totalTax > 0 && items.every((item) => item.taxtype === "UGST")
              ? totals.totalTax.toFixed(2)
              : "0.00"}
          </p>
        </div>
        <div className="grid grid-cols-2 mt-1">
          <p className="text-sm">Package Charges</p>
          <p className="text-sm text-right">{input.packages || 0}</p>
        </div>
        <div className="grid grid-cols-2 mt-1">
          <p className="text-sm">Transportation Charges</p>
          <p className="text-sm text-right">{input.transport || 0.0}</p>
        </div>
        <div className="grid grid-cols-2 mt-1">
          <p className="text-sm">Other Cost</p>
          <p className="text-sm text-right">{input.othercost || 0}</p>
        </div>
        <div className="grid grid-cols-2 mt-1">
          <p className="text-sm">Grand Total (RS)</p>
          <p className="text-sm text-right">{totals.grandTotal.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default Invoicesummary;
