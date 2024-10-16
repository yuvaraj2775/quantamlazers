// DeleteConfirmationDialog.js
import React from 'react';
import { Dialog } from '@headlessui/react'; // Adjust based on your library

const Quotationdelete = ({ deleteDialogOpen, cancelDelete, onDelete }) => {
  return (
    <Dialog
      open={deleteDialogOpen}
      onClose={cancelDelete}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75 transition-opacity overflow-y-auto"
    >
      <div className="fixed inset-0" onClick={cancelDelete} />
      <Dialog.Panel className="bg-white p-3 rounded-md shadow-xl transition-all">
        <Dialog.Title className="text-lg font-bold">Confirm Deletion</Dialog.Title>
        <p>Are you sure you want to delete this item?</p>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={cancelDelete}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Delete
          </button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};

export default Quotationdelete;
