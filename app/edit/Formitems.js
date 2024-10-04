"use client"
import React from 'react';

const FormInput = ({ label, type, name, value, onChange, required }) => (
  <div className="capitalize">
    <label htmlFor={name} className="text-sm font-semibold">
      {label}
    </label>
    {type === "textarea" ? (
      <textarea
        className="border-2 rounded mt-1 uppercase w-full h-[175px] px-2 -pt-10 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      />
    ) : (
      <input
        type={type}
        className="border-2 mt-1 h-10 rounded w-full block px-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      />
    )}
  </div>
);

export default FormInput;