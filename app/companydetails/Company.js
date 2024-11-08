"use client";
import React, { useState, useEffect } from "react";
import Billing from "./Billing";
import Address from "./Address";
import { Switch } from "@headlessui/react";
import {
  TrashIcon,
  PencilSquareIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/solid";

const tabs = [
  { name: "Billing", href: "#" },
  { name: "Delivery Address", href: "#" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Company = () => {
  const [activeTab, setActiveTab] = useState("Billing");

  const [fetchdata, setfetchedata] = useState([]);
  console.log(fetchdata,"fetchdata")
  
  const [editingItem, setEditingItem] = useState(null);
  const [enabledItems, setEnabledItems] = useState({});
  const [checkboxState, setCheckboxState] = useState({});
  const[deliveryinput, setdeliveryinput]=useState({
    Street1:"",
    Street2:"",
    City:"",
    State:"",
    Country:"",
    Email:"",
    Pin:"",
  })

  const [input, setinput] = useState({
    companyname: "",
    gstno: "",
    street1: "",
    street2: "",
    city: "",
    state: "",
    country: "",
    email: "",
    pin: "",
    name1: "",
    designation1: "",
    phoneno1: "",
    name2: "",
    designation2: "",
    phoneno2: "",
    name3: "",
    designation3: "",
    phoneno3: "",
    name4: "",
    designation4: "",
    phoneno4: "",
  });

  const handleEdit = (item) => {
    setinput({
      companyId: item.id, // Set the company ID so it can be used in the PUT request
      companyname: item.companyname,
      gstno: item.gstno,
      street1: item.street1,
      street2: item.street2,
      city: item.city,
      state: item.state,
      country: item.country,
      email: item.email,
      pin: item.pin,
      name1: item.name1,
      designation1: item.designation1,
      phoneno1: item.phoneno1,
      name2: item.name2,
      designation2: item.designation2,
      phoneno2: item.phoneno2,
      name3: item.name3,
      designation3: item.designation3,
      phoneno3: item.phoneno3,
      name4: item.name4,
      designation4: item.designation4,
      phoneno4: item.phoneno4,
    });
   
    setEditingItem(item.id); // Set the ID to mark that we're editing this item
  };

  const checkboxchange = (e, id) => {
    setCheckboxState({
      ...checkboxState,
      [id]: e.target.checked
    });
  };
  
  

  const handleTab = (tabValue) => {
    setActiveTab(tabValue);
  };

  useEffect(() => {
    const fetchDataFromAPI = async () => {
      try {
        const response = await fetch("/api/company");
        if (!response.ok) throw new Error("Failed to fetch data");
  
        const result1 = await response.json();
        const result = result1.companiesWithDeliveryAddress || []


  
        // Set the fetched data
        setfetchedata(result);
  
        // Initialize enabledItems based on fetched data (ensure proper handling of 1/0 or true/false)
        const initialEnabledState = result.reduce((acc, item) => {
          acc[item.id] = item.
          is_Delivery_add_enabled === 1;  // Convert 1 to true, 0 to false
          return acc;
        }, {});
        setEnabledItems(initialEnabledState);
      } catch (error) {
        console.error("Fetch failed:", error);
      }
    };
  
    fetchDataFromAPI();
  }, []);
  
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setinput((prev) => ({ ...prev, [name]: value }));
  };

  const handleaddresschange = (e) => {
    const { name, value } = e.target;
  
    // Only update state if the value has changed
    setdeliveryinput((prev) => {
      if (prev[name] !== value) {
        return { ...prev, [name]: value };
      }
      return prev; // No state update if the value hasn't changed
    });
  };
  

  const handleToggleChange = async (item, id) => {
    // Toggle the current state in local state
    const currentState = enabledItems[id];
    const newEnabledState = !currentState;  // Switch state from true to false, or false to true
  
    // Optimistically update the state (change the state locally)
    setEnabledItems((prev) => ({
      ...prev,
      [id]: newEnabledState,
    }));
  
    try {
      // Send PUT request to update the state on the server
      const response = await fetch(`/api/company`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          isEnabled: newEnabledState ? 1 : 0,  // Convert boolean true/false to 1/0 for the backend
        }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || "Failed to update toggle state");
      }
  
      console.log("Toggle state updated successfully", result);
    } catch (error) {
      console.error("Error updating toggle state:", error);
  
      // If error occurs, revert the state back to the original one
      setEnabledItems((prev) => ({
        ...prev,
        [id]: currentState, // Revert to previous state if update fails
      }));
    }
  };
  
  




  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingItem ? "PUT" : "POST";
  
    try {
      const response = await fetch(`/api/company`, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...input,
          is_Delivery_add_enabled: enabledItems,
           // Pass the updated enabledItems state here
           deliveryinput: deliveryinput,
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert(result.message);
  
        if (editingItem) {
          // Update existing item in state
          setfetchedata((prev) =>
            prev.map((item) =>
              item.id === editingItem ? { ...item, ...input,...deliveryinput } : item
            )
          );
        } else {
          // Add new item to state with initial enabledItems value (false for new items)
          setfetchedata((prev) => [
            ...prev,
            {
              ...input,
              deliveryinput,
              id: result.id, // Assuming result.id is the new ID returned by the server
              enabled: false, // Default the "enabled" state to false for new items
            },
          ]);
          setEnabledItems((prev) => ({ ...prev, [result.id]: false })); // Set the new item state to false
        }
  
        // Reset form fields only on successful save
        setinput({
          companyname: "",
          gstno: "",
          street1: "",
          street2: "",
          city: "",
          state: "",
          country: "",
          email: "",
          pin: "",
          name1: "",
          designation1: "",
          phoneno1: "",
          name2: "",
          designation2: "",
          phoneno2: "",
          name3: "",
          designation3: "",
          phoneno3: "",
          name4: "",
          designation4: "",
          phoneno4: "",
          companyId: "",
        });
        console.log(deliveryinput,"deliveryinput")
  
        setEditingItem(null);
      } else {
        alert(result.message || "Failed to save company details");
      }
    } catch (error) {
      console.error("Error saving company details:", error);
    }
  };
  

  return (
    <>
      <form action="" onSubmit={handleSubmit}>
        <div className="">
          <div className="rounded p-2">
            <div className=""></div>
            <div className="mt-2 flex ">
              <div className="w-[80%] mr-3">
                <label htmlFor="" className="mt-2 text-sm">
                  Company Name
                </label>
                <input
                  type="text"
                  className="w-full h-10 rounded mt-1 text-sm border-2"
                  name="companyname"
                  value={input.companyname}
                  onChange={handleInputChange}
                  id=""
                />
              </div>
              <div className="  mt-1 ">
                <label htmlFor="" className=" text-sm">
                  GST NO
                </label>
                <input
                  type="text"
                  value={input.gstno}
                  name="gstno"
                  onChange={handleInputChange}
                  className="border-2  w-full text-sm h-10 rounded "
                  id=""
                />
              </div>
            </div>

            <div className="mt-5">
              <div className="sm:hidden">
                <label htmlFor="tabs" className="sr-only">
                  Select a tab
                </label>
                <select
                  id="tabs"
                  name="tabs"
                  value={activeTab}
                  onChange={(e) => handleTab(e.target.value)}
                  className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                >
                  {tabs.map((tab) => (
                    <option key={tab.name} value={tab.name}>
                      {tab.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="hidden sm:block">
                <nav aria-label="Tabs" className="flex space-x-4">
                  {tabs.map((tab) => (
                    <a
                      key={tab.name}
                      onClick={() => handleTab(tab.name)}
                      href={tab.href}
                      aria-current={activeTab === tab.name ? "page" : undefined}
                      className={classNames(
                        activeTab === tab.name
                          ? "bg-indigo-100 text-indigo-700"
                          : "text-gray-500 hover:text-gray-700",
                        "rounded-md px-3 py-2 text-sm font-medium"
                      )}
                    >
                      {tab.name}
                    </a>
                  ))}
                </nav>
              </div>

              <div>
                {activeTab === "Billing" && (
                  <div>
                    <Billing
                      input={input}
                      handleInputChange={handleInputChange}
                     
                      checkboxchange={checkboxchange}
                      id="billing" // unique id for this checkbox (can be dynamic)
                      checkboxState={checkboxState}
                    />
                  </div>
                )}

                {activeTab === "Delivery Address" && (
                  <div>
                    <Address
                     input={input}
                     checkboxchange={checkboxchange}
                     id="billing" // unique id for this checkbox (can be dynamic)
                     checkboxState={checkboxState}
                     handleInputChange={handleInputChange}
                 
                     
                      deliveryinput={deliveryinput}
                      handleaddresschange={handleaddresschange}
                    
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-3">
              {" "}
              {/* Add gap for even spacing */}
              {/* Name Fields */}
              <div className="mb-3">
                <label htmlFor="" className="text-sm">
                  Name
                </label>
                {[...Array(4)].map((_, index) => (
                  <input
                    key={`name${index + 1}`}
                    type="text"
                    name={`name${index + 1}`}
                    value={input[`name${index + 1}`]}
                    onChange={handleInputChange}
                    className="block border-2 text-sm h-10 rounded mt-1 w-full" // Full width for name fields
                  />
                ))}
              </div>
              {/* Designation Fields */}
              <div className="mb-3">
                <label htmlFor="" className="text-sm">
                  Designation
                </label>
                {[...Array(4)].map((_, index) => (
                  <input
                    key={`designation${index + 1}`}
                    type="text"
                    name={`designation${index + 1}`}
                    value={input[`designation${index + 1}`]}
                    onChange={handleInputChange}
                    className="block border-2 text-sm h-10 rounded mt-1 w-full" // Full width for designation fields
                  />
                ))}
              </div>
              {/* Phone Fields */}
              <div className="mb-3 ">
                <label htmlFor="" className="text-sm">
                  Phone
                </label>
                {[...Array(4)].map((_, index) => (
                  <input
                    key={`phoneno${index + 1}`}
                    type="text"
                    name={`phoneno${index + 1}`}
                    value={input[`phoneno${index + 1}`]}
                    onChange={handleInputChange}
                    className="block border-2 text-sm h-10 rounded mt-1" // Keep phone width unchanged
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5 flex justify-center">
          <button
            type="submit"
            className="bg-blue-600 flex items-center text-white rounded-md px-4 py-2"
          >
            <img
              src={"./img/save.png"}
              alt=""
              className="w-5 mr-1 h-5 text-white"
            />
            Save
          </button>
        </div>
      </form>

      <div className="mt-8">
        <table className="min-w-full border border-black">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-black px-2 py-2">SL NO</th>
              <th className="border border-black px-2 py-2">Company Name</th>
              <th className="border border-black px-2 py-2">GST NO</th>
              <th className="border border-black px-2 py-2">Name</th>

              <th className="border border-black px-2 py-2">Actions</th>
              <th className="border border-black px-2 py-2">Is Enabled</th>
            </tr>
          </thead>
          <tbody>
            {fetchdata.map((item, i) => (
              <tr
                key={item.id || `new-item-${i}`}
                className={editingItem === item.id ? "bg-green-200" : ""}
              >
                <td className="border border-black px-2 py-2">{i + 1}</td>
                <td className="border border-black px-2 py-2">
                  {item.companyname}
                </td>
                <td className="border border-black px-2 py-2">{item.gstno}</td>
                <td className="border border-black px-2 py-2">{item.name1}</td>
                <td className="border border-black px-2 py-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-blue-500 text-white p-1 rounded-md"
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                  </button>
                </td>
                <td className="border border-black px-2 py-2">
                  <Switch
                    checked={enabledItems[item.id] || true} // Use the enabledItems state
                    onChange={() => handleToggleChange(item,item.id)} // Call the toggle handler
                    className={`group relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                      ${enabledItems[item.id] ? "bg-green-600" : "bg-red-600"} 
                      transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2`}
                  >
                    <span className="sr-only">Use setting</span>
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                        transition duration-200 ease-in-out ${
                          enabledItems[item.id] ? "translate-x-5" : ""
                        }`}
                    />
                  </Switch>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Company;
