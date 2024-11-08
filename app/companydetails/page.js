"use client"
import React, { useState } from 'react'
import  Company  from "./Company";

const tabs = [
  { name: 'Company Details', href: '#' },
//   { name: 'Other Details', href: '#' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const page = () => {
    const [activeTab, setActiveTab] = useState("Company Details");


  const handleTab = (tabValue) => {
    setActiveTab(tabValue);
  };
  return (
    <div className='mt-5 h-screen overflow-y-auto px-3'>
      <div className="sm:hidden  ">
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
              aria-current={activeTab === tab.name ? 'page' : undefined}
              className={classNames(
                activeTab === tab.name ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700',
                'rounded-md px-3 py-2 text-sm font-medium'
              )}
            >
              {tab.name}
            </a>
          ))}
        </nav>
      </div>

      <div>
        {activeTab === "Company Details" && (
          <div>
            <Company />
          </div>
        )}

        
      </div>
    </div>
  )
}

export default page