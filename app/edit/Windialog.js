"use client"
import React from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";

const SuccessDialog = ({ open, onClose, dated }) => (
  <Dialog open={open} onClose={onClose} className="relative">
    <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <DialogPanel className="relative transform overflow-hidden rounded-lg w-1/3 h-1/3 bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all">
          <div>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="mt-3 text-center sm:mt-5">
              <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                DC Challan Number {dated}
              </DialogTitle>
              <div className="mt-2">
                <p className="text-sm text-gray-500">Saved Successfully!</p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-6">
            <button type="button" onClick={onClose} className="inline-flex w-full justify-center">
              <span className="bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 rounded-md">Done</span>
            </button>
          </div>
        </DialogPanel>
      </div>
    </div>
  </Dialog>
);

export default SuccessDialog;
