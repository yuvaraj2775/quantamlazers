// DiscountForm.js
import React from 'react';

const Discount = ({ input, handleInputChange }) => {
  return (
    <div className="grid grid-cols-4 gap-4  mt-5">
      <div className='' >
        <label className="text-sm font-semibold">Discount Amount (%)</label>
        <input
          type="number"
          name="discount"
          value={input.discount}
          onChange={handleInputChange}
          className="border border-gray-300 h-10 rounded-md w-full px-2"
        />
      </div>
      <div>
        <label className="text-sm font-semibold">Package Charges</label>
        <input
          type="number"
          name="packages"
          value={input.packages}
          onChange={handleInputChange}
          className="border border-gray-300 h-10 rounded-md w-full px-2"
        />
      </div>
      <div>
        <label className="text-sm font-semibold">Transportation Charges</label>
        <input
          type="number"
          name="transport"
          value={input.transport}
          onChange={handleInputChange}
          className="border border-gray-300 h-10 rounded-md w-full px-2"
        />
      </div>
      <div>
        <label className="text-sm font-semibold">Other Cost</label>
        <input
          type="number"
          name="othercost"
          value={input.othercost}
          onChange={handleInputChange}
          className="border border-gray-300 h-10 rounded-md w-full px-2"
        />
      </div>
    </div>
  );
};

export default Discount;
