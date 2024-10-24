"use client";
import {
  TrashIcon,
  PencilSquareIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/solid";
import { useState, useEffect, useRef } from "react";
import { IoSaveOutline } from "react-icons/io5";
import { Switch } from "@headlessui/react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
// import "jspdf-autotable";

export default function Home() {
  const [editingItem, setEditingItem] = useState(null);
  const [enabledItems, setEnabledItems] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    qty: "",
    description: "",
    comments: "",
  });
  const [fetched, setFetched] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [displayedItems, setDisplayedItems] = useState([]);

  const formRef = useRef(null); // Ref for the form
  const tableRef = useRef(null); // Ref for the table

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const pdfRef = useRef();

  const pdfDownload = async () => {
    const input = pdfRef.current;

    // Use html2canvas to capture the table as an image
    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true, // Use this to resolve issues with cross-origin resources
      logging: true, // Enable logging to see issues in the console
    });

    const imgData = canvas.toDataURL("image/png");

    // Create a new jsPDF instance
    const pdf = new jsPDF("p", "pt", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Calculate image dimensions
    const imgWidth = pdfWidth - 40; // Leave some margin
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 20, 20, imgWidth, imgHeight);

    // Save the PDF
    pdf.save("Item-Master.pdf");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/itemmaster");
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        setFetched(result.data || []);
        const initialEnabledState = {};
        result.data.forEach((item) => {
          initialEnabledState[item.id] = item.enabled === 1;
        });
        setEnabledItems(initialEnabledState);
      } catch (error) {
        console.error("Fetch failed:", error);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      qty: item.quantity,
      description: item.description,
      comments: item.comments || "",
    });
    setEditingItem(item.id);

    // Scroll to the form when editing
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingItem ? "PUT" : "POST";
    const endpoint = "/api/itemmaster";

    try {
      const response = await fetch(endpoint, {
        method,
        body: JSON.stringify({
          ...formData,
          quantity: Number(formData.qty),
          id: editingItem || undefined,
          enabled: editingItem ? enabledItems[editingItem] : 0,
        }),
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Something went wrong");

      if (editingItem) {
        setFetched((prev) =>
          prev.map((item) =>
            item.id === editingItem
              ? { ...item, ...formData, quantity: Number(formData.qty) }
              : item
          )
        );
      } else {
        setFetched((prev) => [
          ...prev,
          {
            ...formData,
            id: result.id,
            quantity: Number(formData.qty),
            enabled: 0,
          },
        ]);
        setEnabledItems((prev) => ({ ...prev, [result.id]: true }));
      }

      setFormData({ name: "", qty: "", description: "", comments: "" });
      setEditingItem(null);

      // Scroll back to the table after saving
      if (tableRef.current) {
        tableRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } catch (error) {
      console.error("Error while submitting:", error);
    }
  };

 const handleCheckboxChange = (id) => {
  setSelectedItems((prev) => {
    const newSelected = {
      ...prev,
      [id]: !prev[id],
    };

    const selectedIds = Object.keys(newSelected).filter((key) => newSelected[key]);
    const newDisplayedItems = selectedIds.length > 0
      ? fetched.filter((item) => newSelected[item.id])
      : fetched; // Show all fetched items if none are selected

    setDisplayedItems(newDisplayedItems);
    return newSelected;
  });
};
  

  const handleToggleChange = async (item, id) => {
    const currentState = enabledItems[id];
    const newEnabledState = !currentState;
    setEnabledItems((prev) => ({ ...prev, [id]: newEnabledState }));

    try {
      const response = await fetch(`/api/itemmaster`, {
        method: "PUT",
        body: JSON.stringify({
          id,
          enabled: newEnabledState ? 1 : 0,
          name: item.name || "",
          qty: item.quantity || "",
          description: item.description || "",
          comments: item.comments || "",
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to update item status");
    } catch (error) {
      console.error("Error while updating item status:", error);
      setEnabledItems((prev) => ({ ...prev, [id]: currentState }));
    }
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    const newSelection = {};
    fetched.forEach((item) => {
      newSelection[item.id] = isChecked;
    });
    setSelectedItems(newSelection);
  };

  return (
    <div className="max-w-4xl mx-auto p-5 h-screen overflow-y-auto">
      <form onSubmit={handleSubmit} ref={formRef}>
        <h1 className="text-center text-3xl mt-5 font-bold">Item Master</h1>

        <div className="mt-6 space-y-4">
          <div className="flex space-x-4">
            <div className="w-[90%]">
              <label htmlFor="name" className="block font-medium">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="border-2 border-gray-300 block rounded-md w-full p-2"
                name="name"
                id="name"
              />
            </div>
            <div className="w-[10%]">
              <label htmlFor="minquantity" className="block font-medium">
                Min Qty
              </label>
              <input
                type="number"
                onChange={handleChange}
                value={formData.qty}
                className="border-2 block border-gray-300 rounded-md w-full p-2"
                name="qty"
                id="minquantity"
              />
            </div>
          </div>
          <div>
            <label htmlFor="description" className="block font-medium">
              Description
            </label>
            <textarea
              className="border-2 border-gray-300 rounded-md resize-none w-full p-2"
              name="description"
              onChange={handleChange}
              value={formData.description}
              id="description"
              cols="30"
              rows="3"
            />
          </div>
          <div>
            <label htmlFor="comments" className="block font-medium">
              Comments
            </label>
            <textarea
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              placeholder="Enter your comments here"
              className="border-2 border-gray-300 rounded-md resize-none w-full p-2"
              rows="3"
            />
          </div>
          <div className="flex justify-center">
            <button
              className="border-2 p-2 rounded-md flex items-center text-white bg-violet-600"
              type="submit"
            >
              <IoSaveOutline className="w-5 h-5 mr-1" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </form>

      <div className="mt-8" ref={tableRef}>
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-2 text-left py-2">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={fetched.every((item) => selectedItems[item.id])}
                />
              </th>
              <th className="border border-gray-300 px-2 py-2">NO</th>
              <th className="border border-gray-300 px-2 py-2">Name</th>
              <th className="border border-gray-300 px-2 py-2">Description</th>
              <th className="border border-gray-300 px-2 py-2">
                Min <br /> Qty
              </th>
              <th className="border border-gray-300 px-2 py-2">Actions</th>
              <th className="border border-gray-300 px-2 py-2">Is Enabled</th>
            </tr>
          </thead>
          <tbody>
            {fetched.map((item, i) => (
              <tr
                key={item.id}
                className={editingItem === item.id ? "text-green-700" : ""}
              >
                <td className="border border-gray-300 px-2 py-2">
                  <input
                    type="checkbox"
                    checked={!!selectedItems[item.id]}
                    onChange={() => handleCheckboxChange(item.id)}
                  />
                </td>
                <td className="border border-gray-300 px-2 py-2">
                  {`IT${String(i + 1).padStart(3, "0")}`}
                </td>
                <td className="border border-gray-300 px-2 py-2">
                  {item.name}
                </td>
                <td className="border border-gray-300 px-2 py-2">
                  {item.description}
                </td>
                <td className="border border-gray-300 px-2 py-2 text-right">
                  {item.quantity}
                </td>
                <td className="border border-gray-300 px-2 text-center py-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-blue-500 text-white p-1 rounded-md"
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                  </button>
                </td>
                <td className="border border-gray-300 px-2 text-center py-2">
                  <Switch
                    checked={enabledItems[item.id] || true}
                    onChange={() => handleToggleChange(item, item.id)}
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

      <div className="my-5 flex justify-end">
        <button
          className="rounded-md p-2 border-2 flex items-center bg-green-500 text-white"
          onClick={pdfDownload}
        >
          <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
          <span>GO to download</span>
        </button>
      </div>

      <div className="">
        <h2 className="text-xl font-bold">Selected Items</h2>
        <table className="min-w-full border  border-gray-300" ref={pdfRef}>
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-2 py-2">NO</th>
              <th className="border border-gray-300 px-2 py-2">Name</th>
              <th className="border border-gray-300 px-2 py-2">Description</th>
              <th className="border border-gray-300 px-2 py-2">
                Min <br /> Qty
              </th>
            </tr>
          </thead>
          <tbody>
            {displayedItems.map((item) => {
              const originalIndex = fetched.findIndex((f) => f.id === item.id); // Get the original index
              const displayNumber = `IT${String(originalIndex + 1).padStart(
                3,
                "0"
              )}`; // Format as needed

              return (
                <tr key={item.id}>
                  <td className="border border-gray-300 px-2 py-2">
                    {displayNumber}
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    {item.name}
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    {item.description}
                  </td>
                  <td className="border border-gray-300 px-2 py-2 text-right">
                    {item.quantity}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
