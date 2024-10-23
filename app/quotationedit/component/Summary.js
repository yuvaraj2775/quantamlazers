// Summary.js
import React from 'react';

const Summary = ({ grandTotalInWords, totals, formdata }) => {
  return (
    <div className="grid grid-cols-2 mt-2">
      <div>
        <div>
          <div>
            <span className="text-sm font-semibold">Grand Total (In Words)</span>
            <p className="text-sm capitalize">{grandTotalInWords}</p>
          </div>
          <div>
            <span className="text-sm font-semibold">Tax Amount</span>
            <div className="grid grid-cols-2">
              <div>
                <label className="text-sm">CGST:</label>
                <p className="text-sm">{totals.totalCGST.toFixed(2)}</p>
              </div>
              <div>
                <label className="text-sm">IGST:</label>
                <p className="text-sm">{totals.totalIGST.toFixed(2)}</p>
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div>
                <label className="text-sm">SGST:</label>
                <p className="text-sm">{totals.totalSGST.toFixed(2)}</p>
              </div>
              <div>
                <label className="text-sm">UGST:</label>
                <p className="text-sm">0.00</p>
              </div>
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
          <p className="text-sm">Discount ({formdata.items1.discount || 0}%)</p>
          <p className="text-sm  text-right ">{totals.discountAmount.toFixed(2)}</p>
        </div>
        <div className="grid grid-cols-2 mt-1">
          <p className="text-sm">Total CGST</p>
          <p className="text-sm text-right">
            {totals.totalCGST > 0 ? totals.totalCGST.toFixed(2) : "0.00"}
          </p>
        </div>
        <div className="grid grid-cols-2 mt-1">
          <p className="text-sm">Total SGST</p>
          <p className="text-sm text-right">{totals.totalSGST.toFixed(2)}</p>
        </div>
        <div className="grid grid-cols-2 mt-1">
          <p className="text-sm">Total IGST</p>
          <p className="text-sm text-right">
            {totals.totalIGST > 0 ? totals.totalIGST.toFixed(2) : "0.00"}
          </p>
        </div>
        <div className="grid grid-cols-2 mt-1">
          <p className="text-sm">Total UGST</p>
          <p className="text-sm text-right">
            {totals.totalUGST > 0 ? totals.totalUGST.toFixed(2) : "0.00"}
          </p>
        </div>
        <div className="grid grid-cols-2 mt-1">
          <p className="text-sm">Package Charges</p>
          <p className="text-sm text-right">{formdata.items1.packageCharges}</p>
        </div>
        <div className="grid grid-cols-2 mt-1">
          <p className="text-sm">Transportation Charges</p>
          <p className="text-sm text-right">{formdata.items1.transportCharges}</p>
        </div>
        <div className="grid grid-cols-2 mt-1">
          <p className="text-sm">Other Cost</p>
          <p className="text-sm text-right">{formdata.items1.otherCosts}</p>
        </div>
        <div className="grid grid-cols-2 mt-1">
          <p className="text-sm">Grand Total (RS)</p>
          <p className="text-sm text-right">{totals.grandTotal.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default Summary;
