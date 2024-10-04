"use client"
import React from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";

const DeleteDialog = ({ open, onClose, onDelete }) => (
  <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75 transition-opacity overflow-y-auto">
    <DialogBackdrop onClick={onClose} />
    <DialogPanel className="bg-white p-3 rounded-md shadow-xl transition-all">
      <DialogTitle className="text-lg font-bold">Confirm Deletion</DialogTitle>
      <p>Are you sure you want to delete this item?</p>
      <div className="mt-4 flex justify-end space-x-2">
        <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
        <button onClick={onDelete} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
      </div>
    </DialogPanel>
  </Dialog>
);

export default DeleteDialog;
