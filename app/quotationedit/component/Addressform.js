// AddressForm.js
import React from 'react';

const Addressform = ({ formdata, handleInputChange }) => {
  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="Address" className="block mb-1 text-sm font-semibold">
            Address
          </label>
          <textarea
            name="Address"
            value={formdata?.items1.Address}
            onChange={handleInputChange}
            className="border uppercase text-sm border-gray-300 rounded-md w-full h-32 px-2 py-1 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="Date" className="block mb-1 text-sm font-semibold">
                Date
              </label>
              <input
                type="date"
                className="border border-gray-300 rounded-md w-full h-10 px-2"
                name="Date"
                value={formdata?.items1.Date}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="reference" className="block mb-1 text-sm font-semibold">
                Reference Number
              </label>
              <input
                type="text"
                className="border text-sm uppercase border-gray-300 rounded-md w-full h-10 px-2"
                name="reference"
                value={formdata?.items1.reference}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="gstnumber" className="block mb-1 text-sm font-semibold">
                GST Number
              </label>
              <input
                type="text"
                className="border text-sm uppercase border-gray-300 rounded-md w-full h-10 px-2"
                name="gstnumber"
                value={formdata?.items1.gstnumber}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="kindattention" className="block mb-1 text-sm font-semibold">
                Kind Attention
              </label>
              <input
                type="text"
                className="border text-sm uppercase border-gray-300 rounded-md w-full h-10 px-2"
                name="kindattention"
                value={formdata?.items1.kindattention}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <label htmlFor="subject" className="block mb-1 text-sm font-semibold">
          Subject
        </label>
        <input
          type="text"
          className="border uppercase text-sm border-gray-300 rounded-md w-full h-10 px-2"
          name="subject"
          value={formdata?.items1.subject}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default Addressform;
