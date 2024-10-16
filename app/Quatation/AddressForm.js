// AddressForm.js
import React from 'react';

const AddressForm = ({ input, handleInputChange, register, errors }) => {
  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="Address" className="block mb-1 text-sm font-semibold">
            Address
          </label>
          <textarea
            name="Address"
            value={input.Address}
            {...register("Address", { required: "Address is required" })}
            onChange={handleInputChange}
            className="border border-gray-300 uppercase text-sm rounded-md w-full h-32 px-2 py-1 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
          />
          {errors.Address && (
            <p className="text-red-500">{errors.Address.message}</p>
          )}
        </div>
        <div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="Date" className="block mb-1 text-sm font-semibold">
                Date
              </label>
              <input
                type="date"
                className="border border-gray-300 uppercase rounded-md w-full h-10 px-2"
                name="Date"
                {...register("Date", { required: "Date is required" })}
                value={input.Date}
                onChange={handleInputChange}
              />
              {errors.Date && (
                <p className="text-red-500 text-sm min-h-[1.5rem]">
                  {errors.Date.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="reference" className="block mb-1 text-sm font-semibold">
                Reference Number
              </label>
              <input
                type="text"
                className="border border-gray-300 text-sm uppercase rounded-md w-full h-10 px-2"
                name="reference"
                {...register("reference", {
                  required: "Reference number is required",
                })}
                value={input.reference}
                onChange={handleInputChange}
              />
              {errors.reference && (
                <p className="text-red-500 text-sm min-h-[1.5rem]">
                  {errors.reference.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="gstnumber" className="block mb-1 uppercase text-sm font-semibold">
                GST Number
              </label>
              <input
                type="text"
                className="border border-gray-300 text-sm uppercase rounded-md w-full h-10 px-2"
                {...register("gstnumber", {
                  required: "GST number is required",
                })}
                name="gstnumber"
                value={input.gstnumber}
                onChange={handleInputChange}
              />
              {errors.gstnumber && (
                <p className="text-red-500 text-sm min-h-[1.5rem]">
                  {errors.gstnumber.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="kindattention" className="block mb-1 text-sm font-semibold">
                Kind Attention
              </label>
              <input
                type="text"
                className="border border-gray-300 text-sm uppercase rounded-md w-full h-10 px-2"
                name="kindattention"
                {...register("kindattention", {
                  required: "Kind Attention is required",
                })}
                value={input.kindattention}
                onChange={handleInputChange}
              />
              {errors.kindattention && (
                <p className="text-red-500 text-sm min-h-[1.5rem]">
                  {errors.kindattention.message}
                </p>
              )}
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
          className="border border-gray-300 text-sm uppercase rounded-md w-full h-10 px-2"
          name="subject"
          value={input.subject}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default AddressForm;
