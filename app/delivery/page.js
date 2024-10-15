"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Forminput from "./Forminput"; // Adjust the import path as necessary
import Itemrows from "./Itemrows"; // Adjust the import path as necessary
import Deletedialog from "./Deletedialog"; // Adjust the import path as necessary
import Successdialog from "./Successdialog"; // Adjust the import path as necessary
import{FolderArrowDownIcon, PlusIcon, XMarkIcon} from "@heroicons/react/24/solid";
import { useForm } from "react-hook-form";


export default function Page() {
  // All your state and handlers remain here
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  // ...
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [formData, setFormData] = useState({
    items: [
      {
        id: "",
        name: "",
        hsn: "",
        qty: "",
        umoremarks: "NOS",
        remarks: "",
      },
    ],
  });
  const [open, setOpen] = useState(false); 

  const [inputData, setInputData] = useState({
    Buyer: "",
    docdate: "",
    vehiclenumber: "",
    gstnumber: "",
    dcnumber: "",
    dcdate: "",
    ordernumber: "",
    orderdate: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddRow = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: "",
          name: "",
          hsn: "",
          qty: "",
          umoremarks: "NOS",
          remarks: "",
        },
      ],
    }));
  };

  const handleRowChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.items];
  
    // Check if the first character is a number or not
    if (isNaN(value.charAt(0))) {
      // Capitalize the first letter if it's a text
      updatedItems[index] = {
        ...updatedItems[index],
        [name]: value.charAt(0).toUpperCase() + value.slice(1),
      };
    } else {
      // Keep the value unchanged if it's a number
      updatedItems[index] = { ...updatedItems[index], [name]: value };
    }
  
    // Update the formData with the modified items
    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  const openDeleteDialog = (index) => {
    setRowToDelete(index);
    setDeleteDialogOpen(true);
  };
  
  

  const handleDeleteRow = () => {
    const newItems = formData.items.filter((_, i) => i !== rowToDelete);
    setFormData({ items: newItems });
    setDeleteDialogOpen(false);
    setRowToDelete(null);
  };
  
  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setRowToDelete(null);
  };

  const [fetchedData, setFetchedData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/Formdata");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        console.log("Fetched Data:", result);
        setFetchedData(result);
      } catch (error) {
        console.error("Fetch failed:", error);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (e) => {
 
    try {
      if (fetchedData?.data.length) {
        setOpen(true); 
        router.push(`/DeliveryChallanPdf/${dataed}`)
        
      }
      
      const response = await fetch("/api/Formdata", {
        method: "POST",
        body: JSON.stringify({ ...inputData, items: formData.items }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (!response.ok) {
        console.error(
          "Error while submitting:",
          result.error || "Unknown error"
        );
      } else {
        console.log("Data added successfully:", result.message || "Success");
        setInputData({
          Buyer: "",
          docdate: "",
          vehiclenumber: "",
          gstnumber: "",
          dcnumber: "",
          dcdate: "",
          ordernumber: "",
          orderdate: "",
        });
        setFormData({ items: [] });


        // Show alert for quotation ID
     setOpen(true);
       

      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  };
   const dataed = fetchedData?.data.length ? fetchedData.data[0].id + 1 : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="h-screen overflow-y-auto w-full p-6 bg-gray-50">
      <div className="grid grid-cols-3 mt-5">
          <h1></h1>
        <h1 className="text-center font-bold text-xl">DC Form</h1>
        <h1 className="text-right text-lg font-bold text-blue-700 mr-1">
          DC NO : <span className="text-red-900 text-2xl">Draft</span>
        </h1>
        </div>

        <div className="grid grid-cols-2 mt-4 gap-4">
          <div>
          <Forminput label="Buyer" type="textarea" name="Buyer" value={inputData.Buyer} onChange={handleInputChange} required
           {...register("Buyer", { required: "Buyer is required" })}
          />
            {errors.Buyer && (
            <p className="text-red-500">{errors.Buyer.message}</p>
          )}
          </div>

          <div>
            <div className="capitalize gap-1 grid grid-cols-3">
              <div>
              <Forminput label="DC Date" type="date" name="docdate" className=""   {...register("docdate", { required: "Date is required" })} value={ inputData.docdate} onChange={handleInputChange} required />
               {errors.docdate && (
            <p className="text-red-500">{errors.docdate.message}</p>
          )}

              </div>
              <div>
              <Forminput label="     Your Order Number" type="text" className=""  name="ordernumber"  value={inputData.ordernumber} onChange={handleInputChange} required 
               {...register("ordernumber", { required: "OrderNumber is required" })}
              />
                 {errors.ordernumber && (
            <p className="text-red-500">{errors.ordernumber.message}</p>
          )}

              </div>

              <div>
              <Forminput label="  Your Order Date" type="text" name="orderdate" value={ inputData.orderdate} onChange={handleInputChange} required
                {...register("orderdate", { required: "Date is required" })}
               />
                 {errors.orderdate && (
            <p className="text-red-500">{errors.orderdate.message}</p>
          )}
              </div>
              
               
               
            </div>

            <div className="grid gap-1 grid-cols-2 mt" >
               
               <div>
               <Forminput label="   Vehicle Number" type="text" name="vehiclenumber" value={inputData.vehiclenumber}  onChange={handleInputChange} required
               {...register("vehiclenumber", { required: "VehicleNumber is required" })}
               />
                {errors.vehiclenumber && (
            <p className="text-red-500">{errors.vehiclenumber.message}</p>
          )}
               </div>
               <div>
               <Forminput label="   GST Number" type="text" name="gstnumber"  value={inputData.gstnumber}  onChange={handleInputChange} 
                {...register("gstnumber", { required: "GstNumber is required" })}
               />
                  {errors.gstnumber && (
            <p className="text-red-500">{errors.gstnumber.message}</p>
          )}

               </div>
                
                <Forminput label=" Your DC Number" type="text" name="dcnumber"  value={inputData.dcnumber}  onChange={handleInputChange}/>
                <Forminput label=" Your  DC Date" type="date" name="dcdate"  value={inputData.dcdate}   onChange={handleInputChange}/>



            </div>
       
          </div>

        </div>
       
       

        <div className="border-2 border-gray-300 mt-5 rounded-lg overflow-x-auto shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-200 font-semibold">
              <tr>
                <th>Sl. No</th>
                <th>Item Name</th>
                <th>HSN Code</th>
                <th>Qty</th>
                <th>UMO</th>
                <th>Remarks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item, i) => (
                
                
                <tr className="border-b">
                <td className="p-2 w-10 border-r-gray-300">{i + 1}</td>
                <td className="border-r-gray-300 px-2">
                  <input
                    type="text"
                    name="name"
                    value={item.name}
                    onChange={(e) => handleRowChange(index, e)}
                    placeholder="Name"
                    className="w-full border h-10 border-r-gray-300 rounded p-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                    {...register("name", { required: "Item name is required" })}
                  />
                    {errors.name && (
                      <p className="text-red-500">{errors.name.message}</p>
                    )}
                </td>
                <td className="px-1">
                  <input
                    type="text"
                    name="hsn"
                    value={item.hsn}
                    onChange={(e) => handleRowChange(index, e)}
                    placeholder="HSN"
                    className="w-full border rounded p-1 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                  />
                  
                </td>
                <td className="px-2">
                  <input
                    type="number"
                    name="qty"
                    value={item.qty}
                    onChange={(e) => handleRowChange(index, e)}
                    {...register("qty", { required: "QTY is required" })}
                    placeholder="Qty"
                    className="w-full text-right border rounded p-1 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                    
                  />
                   {errors.qty && (
                      <p className="text-red-500">{errors.qty.message}</p>
                    )}
                </td>
                <td className="px-2">
                  <select 
                    name="umoremarks" 
                    value={item.umoremarks} 
                    onChange={(e) => handleRowChange(index, e)}
                    className="border rounded p-1 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                  >
                    <option value="NOS">NOS</option>
                    <option value="EACH">EACH</option>
                    <option value="SET">SET</option>
                  </select>
                </td>
                <td className="px-2">
                  <textarea
                    name="remarks"
                    value={item.remarks}
                    onChange={(e) => handleRowChange(index, e)}
                    placeholder="Remarks"
                    className="w-full border h-14 rounded p-1 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                  />
                </td>
                <td className="flex justify-center items-center mt-3 border-gray-300 space-x-2 px-2">
                  <button
                    type="button"
                    onClick={handleAddRow}
                    className="flex items-center justify-center w-8 h-8 text-green-700 bg-green-100 rounded-full hover:bg-green-200 transition"
                    title="Add Row"
                  >
                    <PlusIcon className="w-5 h-5" />
                  </button>
                  {i === 0 ? ( // Dummy button for the first row
                    <button
                      type="button"
                      className="flex items-center justify-center w-8 h-8 text-gray-400 bg-gray-200 rounded-full"
                      title="First row cannot be deleted"
                      disabled
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openDeleteDialog(i)}
                      className="flex items-center justify-center w-8 h-8 text-red-900 bg-red-100 rounded-full hover:bg-red-200 transition"
                      title="Delete Row"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  )}
                </td>
              </tr>
                
               
              ))}
            </tbody>
          </table>
          <div className="flex justify-evenly  w-[87%]">
            <p className="font-bold mt-2">Total Number of Qty : </p>
            <span className="  text-right mt-2 inline-block">
              {formData.items.reduce(
                (acc, item) => acc + Number(item.qty || 0),
                0
              )}
            </span>
          </div>
        </div>

        <div className="flex justify-center mt-4 gap-4">
      
          <button type="submit" className="text-center justify-center cursor-pointer border-2 flex items-center  p-2 w-24 rounded-md bg-blue-500 text-white">
          <img src={"./img/save.png"} alt="" className="w-5 mr-1 h-5 text-white" />Save</button>
        </div>

     


        <Successdialog open={open} onClose={() => setOpen(false)} dataId={dataed} />
       

        <Deletedialog open={deleteDialogOpen} onClose={cancelDelete} onDelete={handleDeleteRow} />
      </div>
    </form>
  );
}
