"use client";
import React, { useState } from "react";


const Billing = ({
  input,
  handleInputChange,
  checkboxchange,
  id, // Assume `id` is a unique identifier for this checkbox
  checkboxState // Pass checkboxState to determine whether this checkbox is checked or not
}) => {
  
  return (
    <div className="border-2 rounded p-2 mt-2">
      {console.log(checkboxState[id],"checkbox")}
      {/* Checkbox Section */}
      <div className="flex justify-end">
        <input
          type="checkbox"
          checked={checkboxState[id] || false} // Use the state from parent to determine if checked
          onChange={(e) => checkboxchange(e, id)} // Pass `id` to handle the checkbox change
          className="h-4 w-4"
        />
        <label htmlFor="" className="text-sm ml-1">
          Delivery Address
        </label>
      </div>

      {/* Address Inputs */}
      <div className="">
        <div></div>
      </div>

      <div className="flex mt-3">
        <label htmlFor="" className="mt-2 w-[10%] text-sm">
          Street 1
        </label>
        <input
          type="text"
          value={input.street1}
          name="street1"
          onChange={handleInputChange}
          className="w-full h-10 rounded text-sm border-2"
        />
      </div>

      <div className="flex mt-2">
        <label htmlFor="" className="mt-2 w-[10%] text-sm">
          Street 2
        </label>
        <input
          type="text"
          className="w-full h-10 rounded text-sm border-2"
          name="street2"
          value={input.street2}
          onChange={handleInputChange}
        />
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        {/* City Selection */}
        <div>
          <label className="text-sm">City</label>
          <select
            name="city"
            value={input.city}
            onChange={handleInputChange}
            className="w-full h-10 px-2 rounded border-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
            id="city"
          >
            <option value="chennai">Chennai</option>
            <option value="Madurai">Madurai</option>
            <option value="Coimbature">Coimbature</option>
            <option value="Thirunelveli">Thirunelveli</option>
          </select>
        </div>

        {/* State Selection */}
        <div>
          <label className="text-sm">State</label>
          <select
            name="state"
            value={input.state}
            onChange={handleInputChange}
            className="w-full h-10 px-2 rounded border-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
            id="state"
          >
            <option value="Tamilnadu">Tamilnadu</option>
            <option value="Kerala">Kerala</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Mumbai">Mumbai</option>
          </select>
        </div>

        {/* Country Selection */}
        <div>
          <label className="text-sm">Country</label>
          <select
            name="country"
            value={input.country}
            onChange={handleInputChange}
            className="w-full h-10 px-2 rounded border-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
            id="country"
          >
            <option value="India">India</option>
            <option value="Pakistan">Pakistan</option>
            <option value="China">China</option>
            <option value="Japan">Japan</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-3">
        <div>
          <label htmlFor="" className="mt-2 text-sm">
            Email
          </label>
          <input
            type="text"
            name="email"
            value={input.email}
            onChange={handleInputChange}
            className="w-full border-2 h-10 rounded text-sm"
          />
        </div>
        <div>
          <label htmlFor="" className="mt-2 text-sm">
            Pin
          </label>
          <input
            type="text"
            name="pin"
            value={input.pin}
            onChange={handleInputChange}
            className="border-2 w-full h-10 rounded text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default Billing;
