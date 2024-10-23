import React from 'react';

const TotalsComponent = ({ grandTotalInWords, totals, fetcheddata }) => {
  return (
    <div className="border-b-2 border-black flex  px-5">
      <div className='  w-3/5' >
        <div>
          <p className="font-bold mt-2">Grand Totals</p>
          <p className="capitalize">{grandTotalInWords}</p>
        </div>
        <div>
          <p className="font-bold mt-2">Tax Amount</p>
          <div className="flex justify-evenly">
            <p className="grid grid-cols-2 ">
              CGST <span>: {totals.totalCGST}</span>
            </p>
            <p className="grid grid-cols-2">
              IGST <span>: {totals.totalIGST}</span>
            </p>
          </div>
          <div className="flex justify-evenly ml-2">
            <p className="grid grid-cols-2">
              SGST <span>: {(totals.totalSGST || 0).toFixed(2)}</span>
            </p>
            <p className="grid grid-cols-2 ml-2">
              UGST <span>: 0.00</span>
            </p>
          </div>
        </div>
      </div>
      <div className="border-l-2 border-black pl-5">
        <div className="grid grid-cols-2 mt-2  ">
          <p className="font-bold ">Sub-Total Amt</p>
          <p className="text-right">{(totals.subtotal || 0 ).toFixed(2)}</p>
        </div>
        <div className="grid grid-cols-2 mt-1">
          <p>
            Discount ({(fetcheddata?.data.discount || 0).toFixed(2)}%)
          </p>
          <p className="text-right">{totals.discountAmount}</p>
        </div>
        <div className="grid grid-cols-2 mt-1">
          <p>CGST</p>
          <p className="text-right">
            {(totals.totalCGST || 0).toFixed(2)}
          </p>
        </div>
        <div className="grid grid-cols-2 mt-1">
          <p>SGST</p>
          <p className="text-right">
            {(totals.totalSGST || 0).toFixed(2)}
          </p>
        </div>
        <div className="grid grid-cols-2 mt-1">
          <p>IGST</p>
          <p className="text-right">{(totals.totalIGST || 0).toFixed(2) }</p>
        </div>
        <div className="grid grid-cols-2 mt-1">
          <p>UGST</p>
          <p className="text-right">0.00</p>
        </div>
        <div className="grid grid-cols-2 mt-1">
          <p>Packages Charges</p>
          <p className="text-right">
            {(fetcheddata?.data.packageCharges || 0).toFixed(2)}
          </p>
        </div>
        <div className="grid grid-cols-2 mt-1">
          <p>Transportation Charges</p>
          <p className="text-right">
            {(fetcheddata?.data.transportCharges || 0).toFixed(2)}
          </p>
        </div>
        <div className="grid grid-cols-2 mt-1">
          <p>Other Costs</p>
          <p className="text-right">
            {(fetcheddata?.data.otherCosts || 0).toFixed(2)}
          </p>
        </div>
        <div className="grid grid-cols-2 mt-1 mb-3">
          <p className="font-bold">Grand Total (rs)</p>
          <p className="font-bold text-right">
            {(fetcheddata?.data.grandTotal || 0).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TotalsComponent;
