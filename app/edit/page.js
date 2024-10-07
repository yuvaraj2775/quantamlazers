"use client"
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import {
  PlusIcon,
  XMarkIcon,
  PlusCircleIcon,
  BookmarkIcon,
  ViewfinderCircleIcon,
  EyeIcon,
  FolderArrowDownIcon
} from "@heroicons/react/24/solid";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckIcon } from "@heroicons/react/24/outline";
import Formitems from "./Formitems";
import ItemRows from "./ItemRows";
import Windialog from "./Windialog";
import Losedialog from "./Losedialog";

export default function Page({ params }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [formData, setFormData] = useState({ items: [] ,items1:[] });
  const [fetchedData, setFetchedData] = useState(null);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const searchid = useSearchParams().get("id");
  console.log(formData,"data")

  useEffect(() => {
    const fetchData = async () => {
      if (searchid) {
        try {
          const response = await fetch(`/api/Formdata?id=${searchid}`);
          if (!response.ok) throw new Error("Failed to fetch data");
          const result = await response.json();
          setFormData({
            // ...result.data[0], // Update formData with the fetched data
            items1: result.data ||[],
            items: result.data2 || [],
          });
          setFetchedData(result);
        } catch (error) {
          console.error("Fetch failed:", error);
        }
      }
    };

    fetchData();
  }, [searchid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    // Check if the input is part of items1
    if (name in formData.items1) {
      setFormData((prev) => ({
        ...prev,
        items1: {
          ...prev.items1,
          [name]: value,
        },
      }));
    } else {
      // Otherwise handle items (this is for your table rows)
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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
  const handleAddRow = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { name: "", hsn: "", qty: "", umoremarks: "NOS", remarks: "" },
      ],
    }));
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = {
      ...formData.items1,
      items: formData.items,
      quotation_id: fetchedData?.data?.id || null,
    };
  
    try {
      const response = await fetch(`/api/Formdata?id=${searchid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formDataToSend),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log("Update successful:", result);
        setOpen(true); // Open the success dialog
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };
  
    const dated = formData.items1?.id
  return (
    <form
      onSubmit={handleSubmit}
      className="h-screen capitalize p-6 overflow-y-auto bg-gray-50"
    >
      <div className="grid grid-cols-3">
        <h1></h1>
        <h1 className="text-center mt-5 font-bold text-xl text-gray-800">
          Edit page
        </h1>
        <h1 className="text-right mt-5 font-bold text-lg text-blue-600 mr-1">
          DC NO:{" "}
          <span className="text-red-900 text-2xl">{formData.items1?.id}</span>{" "}
        </h1>
      </div>
      <div className="grid grid-cols-2 mt-4 gap-4">
        <div>
          <Formitems
            label="Buyer"
            type="textarea"
            name="buyer"
            value={formData.items1?.buyer}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <div className="capitalize gap-1 grid grid-cols-3">
            <Formitems
              label="DC Date"
              type="date"
              name="dc_date"
              value={formData.items1?.dc_date}
              onChange={handleInputChange}
              required
            />
            <Formitems
              label="Your Order Number"
              type="text"
              name="ordernumber"
              value={formData.items1?.ordernumber}
              onChange={handleInputChange}
              required
            />
            <Formitems
              label="  Your Order Date"
              type="text"
              name="orderdate"
              value={formData.items1?.orderdate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-1 mt">
            <Formitems
              label="   Vehicle Number"
              type="text"
              name="vehicle_number"
              value={formData.items1?.vehicle_number}
              onChange={handleInputChange}
              required
            />
            <Formitems
              label="   GST Number"
              type="text"
              name="gst_number"
              value={formData.items1?.gst_number}
              onChange={handleInputChange}
            />
            <Formitems
              label=" Your DC Number"
              type="text"
              name="dc_number"
              value={formData.items1?.dc_number}
              onChange={handleInputChange}
            />
            <Formitems
              label=" Your  DC Date"
              type="date"
              name="dc_issue_date"
              value={formData.items1?.dc_issue_date}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      <div className="border-2 border-gray-300  mt-5 rounded-lg overflow-x-auto shadow-sm">
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
              {formData.items?.map((item, i) => (
              
                <ItemRows key={i} index={i} item={item} 
                
                handleRowChange={handleRowChange} handleAddRow={handleAddRow} openDeleteDialog={openDeleteDialog} />
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

        <div className="flex justify-center gap-3 mt-5">
        <button
          type="button"
          onClick={() => {
            router.push("/delivery"); // Navigate to another page
          }}
          
          className="text-center cursor-pointer border-2 p-2 w-24 flex items-center justify-center rounded-md bg-green-500 text-white"
        >
          <PlusIcon className="w-5 h-5 mr-1 text-white" />
          New
        </button>
        <button
          type="submit"
          className="text-center cursor-pointer border-2 p-2 w-24 flex items-center justify-center rounded-md bg-blue-500 text-white"
        >
          {/* <FolderArrowDownIcon className="w-5 h-5 mr-1 " /> */}
          <img src={"./img/save.png"} alt="" className="w-5 mr-1 h-5 text-white" />
          Save
        </button>
        <button
          type="button"
          className="text-center cursor-pointer border-2 p-2 w-24  flex items-center justify-center rounded-md bg-gray-500 text-white"
          onClick={() => {
            router.push(`/DeliveryChallanPdf/${searchid}`); // Navigate to another page
          }}
        >
          <EyeIcon    className="w-4 h-4 mr-1 " />

          View
        </button>
      </div>


      

        {/* <Windialog open={open} onClose={() => setOpen(false)} dataId={dated} /> */}
        <Windialog 
  open={open} 
  onClose={() => setOpen(false)} 
  dataId={dated} 
  onRedirect={() => router.push(`/DeliveryChallanPdf/${searchid}`)} 
/>

       

        <Losedialog open={deleteDialogOpen} onClose={cancelDelete} onDelete={handleDeleteRow} />

    </form>
  );
}
