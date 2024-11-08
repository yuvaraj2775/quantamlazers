// "use client";
// // components/ItemTable.js
// import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';
// import React, { useState, useEffect, useRef } from 'react';

// const ItemTablevalues = ({
//   items,
//   handleItemChange,
//   handleAddRow,
//   openDeleteDialog,
//   errors,
//   register,
//   handleFocus,
//   suggestions,
//   handleSuggestionClick,
// }) => {
//   const [focusedItemIndex, setFocusedItemIndex] = useState(null);
//   const inputRefs = useRef([]);
//   const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

//   useEffect(() => {
//     if (items.length > 0) {
//       setFocusedItemIndex(items.length - 1); // Focus on the last item
//     }
//   }, [items]);

//   const handleInputFocus = (e, index) => {
//     setFocusedItemIndex(index);
//     handleFocus(e, index);
    
//     // Get the position of the focused row
//     const row = e.target.closest('tr');
//     const rect = row.getBoundingClientRect();
    
//     // Set dropdown position below the current row
//     setDropdownPosition({
//       top: rect.bottom + window.scrollY, // Add scroll position for fixed elements
//       left: rect.left + window.scrollX, // Add scroll position for fixed elements
//     });
//   };

//   const handleAddRowClick = () => {
//     handleAddRow();
//     setFocusedItemIndex(items.length); // Set focus to the new row
//   };

//   return (
//     <div className="mt-5 relative ">
//       <div className=" overflow-x-auto">
//         <table className="border border-gray-300 custom-table">
//           <thead className="bg-gray-200">
//             <tr>
//               <th className="border border-gray-300 p-2">SL.NO</th>
//               <th className="border border-gray-300 p-2">Item Name/Description</th>
//               <th className="border border-gray-300 p-2">HSN Code</th>
//               <th className="border border-gray-300 p-2">Qty</th>
//               <th className="border border-gray-300 p-2">Unit</th>
//               <th className="border border-gray-300 p-2">Unit Cost</th>
//               <th className="border border-gray-300 p-2">Taxable Value</th>
//               <th className="border border-gray-300 p-2">Type of Tax</th>
//               <th className="border border-gray-300 p-2">%</th>
//               <th className="border border-gray-300 p-2">Tax Amt</th>
//               <th className="border border-gray-300 p-2">Type of Tax</th>
//               <th className="border border-gray-300 p-2">%</th>
//               <th className="border border-gray-300 p-2">Tax Amt</th>
//               <th className="border border-gray-300 p-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {items.map((item, index) => (
//               <React.Fragment key={index}>
//                 <tr className="border-b hover:bg-gray-50">
//                   <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
//                   <td className="border border-gray-300 p-2">
//                     <input
//                       ref={(el) => (inputRefs.current[index] = el)}
//                       type="text"
//                       className="border w-52 capitalize border-gray-300 rounded-md h-10 px-2"
//                       name="description"
//                       value={item.description}
//                       required
//                       onFocus={(e) => handleInputFocus(e, index)}
//                       onChange={(e) => handleItemChange(index, e)}
//                     />
//                     {errors.description && (
//                       <p className="text-red-500">{errors.description.message}</p>
//                     )}
//                   </td>
//                   <td className="border border-gray-300 p-2">
//                     <input
//                       type="text"
//                       className="border w-20 border-gray-300 rounded-md h-10 px-2"
//                       name="hsncode"
//                       value={item.hsncode}
//                       onChange={(e) => handleItemChange(index, e)}
//                     />
//                   </td>
//                   <td className="border border-gray-300 p-2">
//                     <input
//                       type="number"
//                       className="border border-gray-300 text-right rounded-md w-24 h-10 px-2"
//                       name="qty"
//                       value={item.qty}
//                       required
//                       {...register("qty", { required: "QTY is required" })}
//                       onChange={(e) => handleItemChange(index, e)}
//                     />
//                     {errors.qty && (
//                       <p className="text-red-500 text-sm min-h-[1.5rem]">
//                         {errors.qty.message}
//                       </p>
//                     )}
//                   </td>
//                   <td className="border border-gray-300 p-2 w-16">
//                     <select
//                       name="unit"
//                       onChange={(e) => handleItemChange(index, e)}
//                       value={item.unit}
//                       className="border border-gray-300 rounded-md h-10 w-16"
//                     >
//                       <option value="NOS">NOS</option>
//                       <option value="EACH">EACH</option>
//                       <option value="SET">SET</option>
//                     </select>
//                   </td>
//                   <td className="border border-gray-300 p-2">
//                     <input
//                       type="number"
//                       className="border border-gray-300 rounded-md text-right w-24 h-10 px-2"
//                       name="unitCost"
//                       value={item.unitCost}
//                       onChange={(e) => handleItemChange(index, e)}
//                     />
//                     {errors.unitCost && (
//                       <p className="text-red-500 text-sm min-h-[1.5rem]">
//                         {errors.unitCost.message}
//                       </p>
//                     )}
//                   </td>
//                   <td className="border border-gray-300 p-2">
//                     <input
//                       type="text"
//                       className="border text-right border-gray-300 rounded-md w-full h-10 px-2"
//                       name="taxableValue"
//                       value={item.taxableValue}
//                       readOnly
//                     />
//                   </td>
//                   <td className="border border-gray-300 p-2 w-16">
//                     <select
//                       name="taxtype"
//                       className="border border-gray-300 rounded-md w-16 h-10"
//                       onChange={(e) => handleItemChange(index, e)}
//                       value={item.taxtype}
//                     >
//                       <option value="CGST">CGST</option>
//                       <option value="IGST">IGST</option>
//                     </select>
//                   </td>
//                   <td className="border border-gray-300 p-2 w-10">
//                     <input
//                       type="text"
//                       className="border border-gray-300 rounded-md w-10 text-right h-10 px-2"
//                       name="percentage"
//                       value={item.percentage}
//                       onChange={(e) => handleItemChange(index, e)}
//                     />
//                   </td>
//                   <td className="border border-gray-300 p-2 w-16">
//                     <input
//                       type="text"
//                       className="border border-gray-300 rounded-md w-16 text-right h-10 px-2"
//                       name="taxamt"
//                       value={item.taxamt}
//                       readOnly
//                     />
//                   </td>
//                   <td className="border border-gray-300 p-2 w-16">
//                     <select
//                       name="typeoftax"
//                       onChange={(e) => handleItemChange(index, e)}
//                       value={item.typeoftax}
//                       className="border border-gray-300 rounded-md h-10 w-16"
//                     >
//                       {item.taxtype === "CGST" ? (
//                         <option value="SGST">SGST</option>
//                       ) : (
//                         <option value="UGST">UGST</option>
//                       )}
//                     </select>
//                   </td>
//                   <td className="border border-gray-300 p-2 w-14">
//                     <input
//                       type="text"
//                       className="border border-gray-300 rounded-md w-14 text-right h-10 px-2"
//                       name="percentage2"
//                       value={item.percentage2}
//                       onChange={(e) => handleItemChange(index, e)}
//                     />
//                   </td>
//                   <td className="border border-gray-300 p-2 w-14">
//                     <input
//                       type="text"
//                       className="border border-gray-300 rounded-md w-14 text-right h-10 px-2"
//                       name="taxamt2"
//                       value={item.taxamt2}
//                       readOnly
//                     />
//                   </td>
//                   <td className="flex justify-center items-center mt-3 border-gray-300 space-x-2 px-2">
//                     <button
//                       type="button"
//                       onClick={handleAddRowClick}
//                       className="flex items-center justify-center w-8 h-8 text-green-700 bg-green-100 rounded-full hover:bg-green-200 transition"
//                       title="Add Row"
//                     >
//                       <PlusIcon className="w-5 h-5" />
//                     </button>
//                     {index === 0 ? (
//                       <button
//                         type="button"
//                         className="flex items-center justify-center w-8 h-8 text-gray-400 bg-gray-200 rounded-full"
//                         title="First row cannot be deleted"
//                         disabled
//                       >
//                         <XMarkIcon className="w-5 h-5" />
//                       </button>
//                     ) : (
//                       <button
//                         type="button"
//                         onClick={() => openDeleteDialog(index)}
//                         className="flex items-center justify-center w-8 h-8 text-red-900 bg-red-100 rounded-full hover:bg-red-200 transition"
//                         title="Delete Row"
//                       >
//                         <XMarkIcon className="w-5 h-5" />
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               </React.Fragment>
//             ))}
//           </tbody>
//         </table>
//         {/* Suggestions dropdown */}
//         {suggestions.length > 0 && focusedItemIndex !== null && (
//           <ul
//             className="border absolute border-gray-300 w-52 h-32 overflow-y-auto bg-white rounded shadow-lg"
//             style={{
//               top: dropdownPosition.top,
//               left: dropdownPosition.left,
//               zIndex: 1000,
//             }}
//           >
//             {suggestions.map((suggestion, suggestionIndex) => (
//               <li
//                 key={suggestionIndex}
//                 onClick={() => handleSuggestionClick(suggestion, focusedItemIndex)}
//                 className="p-2 cursor-pointer hover:bg-gray-200"
//               >
//                 {suggestion}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ItemTablevalues;
