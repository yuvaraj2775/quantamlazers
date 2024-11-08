"use client";
import React, { useEffect, useState } from "react";

const Address = ({
  input,
 
  enabledItems,
  handleaddresschange,
  deliveryinput,

  id, // Assume `id` is a unique identifier for this checkbox
  checkboxState 
  
}) => {
  // Optional: This state will hold the fetched data, if you want to use it
  const [fetchData, setFetchData] = useState([]);

  useEffect(() => {
    const fetchDataFromAPI = async () => {
      try {
        const response = await fetch("/api/company");
        if (!response.ok) throw new Error("Failed to fetch data");

        const result1 = await response.json();
        const result = result1.companyAltAddresses || []; // Fetched alternate addresses

        // Set the fetched data (if needed in the future)
        setFetchData(result);
      } catch (error) {
        console.error("Fetch failed:", error);
      }
    };

    fetchDataFromAPI();
  }, []);

 

  const isEnabled = checkboxState[id] || false ;

  console.log(fetchData,"fetchedata")

  return (
    <>
      {isEnabled ? (
        <div className="mt-3">
          <div className="flex mt-3">
            <label className="w-[10%] text-sm">Street 1</label>
            <input
              type="text"
              value={input.street1}
              name="street1"
              // onChange={handleInputChange}
              className="w-full h-10 rounded text-sm border-2"
              // Disable input if not enabled
            />
          </div>

          <div className="flex mt-2">
            <label className="w-[10%] text-sm">Street 2</label>
            <input
              type="text"
              className="w-full h-10 rounded text-sm border-2"
              name="street2"
              value={input.street2}
             
            />
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="">
              <label className="text-sm">City</label>
              <select
                name="city"
                value={input.city}
                // onChange={handleInputChange}
                className="w-full h-10 px-2 rounded border-2 text-sm"
                // Disable select if not enabled
              >
                <option value="Chennai">Chennai</option>
                <option value="Madurai">Madurai</option>
                <option value="Coimbatore">Coimbatore</option>
                <option value="Thirunelveli">Thirunelveli</option>
              </select>
            </div>

            <div className="">
              <label className="text-sm">State</label>
              <select
                name="state"
                value={input.state}
                // onChange={handleInputChange}
                className="w-full h-10 px-2 rounded border-2 text-sm"
                // Disable select if not enabled
              >
                <option value="Tamilnadu">Tamilnadu</option>
                <option value="Kerala">Kerala</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Mumbai">Mumbai</option>
              </select>
            </div>

            <div className="">
              <label className="text-sm">Country</label>
              <select
                name="country"
                value={input.country}
                // onChange={handleInputChange}
                className="w-full h-10 px-2 rounded border-2 text-sm"
                // Disable select if not enabled
              >
                <option value="India">India</option>
                <option value="Pakistan">Pakistan</option>
                <option value="China">China</option>
                <option value="Japan">Japan</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-3">
            <div className="flex flex-col">
              <label className="text-sm">Email</label>
              <input
                type="email"
                name="email"
                value={input.email}
                // onChange={handleInputChange}
                className="w-full h-10 rounded text-sm border-2"
                // Disable input if not enabled
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm">Pin</label>
              <input
                type="text"
                name="pin"
                value={input.pin}
                // onChange={handleInputChange}
                className="w-full h-10 rounded text-sm border-2"
                // Disable input if not enabled
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-3">
        <div className="flex mt-3">
          <label className="w-[10%] text-sm">Street 1</label>
          <input
            type="text"
            name="Street1"
            value={fetchData.street1}
            onChange={handleaddresschange}
            className="w-full h-10 rounded text-sm border-2"
          />
        </div>
      
        <div className="flex mt-2">
          <label className="w-[10%] text-sm">Street 2</label>
          <input
            type="text"
            name="Street2"
            value={fetchData.street2}
            onChange={handleaddresschange}
            className="w-full h-10 rounded text-sm border-2"
          />
        </div>
      
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="">
            <label className="text-sm">City</label>
            <select
              name="City"
              value={fetchData.city}
              onChange={handleaddresschange}
              className="w-full h-10 px-2 rounded border-2 text-sm"
            >
              <option value="Chennai">Chennai</option>
              <option value="Madurai">Madurai</option>
              <option value="Coimbatore">Coimbatore</option>
              <option value="Thirunelveli">Thirunelveli</option>
            </select>
          </div>
      
          <div className="">
            <label className="text-sm">State</label>
            <select
              name="State"
              value={fetchData.State}
              onChange={handleaddresschange}
              className="w-full h-10 px-2 rounded border-2 text-sm"
            >
              <option value="Tamilnadu">Tamilnadu</option>
              <option value="Kerala">Kerala</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Mumbai">Mumbai</option>
            </select>
          </div>
      
          <div className="">
            <label className="text-sm">Country</label>
            <select
              name="Country"
              value={fetchData.Country}
              onChange={handleaddresschange}
              className="w-full h-10 px-2 rounded border-2 text-sm"
            >
              <option value="India">India</option>
              <option value="Pakistan">Pakistan</option>
              <option value="China">China</option>
              <option value="Japan">Japan</option>
            </select>
          </div>
        </div>
      
        <div className="grid grid-cols-3 gap-4 mt-3">
          <div className="flex flex-col">
            <label className="text-sm">Email</label>
            <input
              type="email"
              name="Email"
              value={fetchData.Email}
              onChange={handleaddresschange}
              className="w-full h-10 rounded text-sm border-2"
            />
          </div>
      
          <div className="flex flex-col">
            <label className="text-sm">Pin</label>
            <input
              type="text"
              name="Pin"
              value={fetchData.Pin}
              onChange={handleaddresschange}
              className="w-full h-10 rounded text-sm border-2"
            />
          </div>
        </div>
      </div>
      
      )}
    </>
  );
};

export default Address;
