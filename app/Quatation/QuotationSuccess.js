// SuccessDialog.js
import React from 'react';
import { Dialog } from '@headlessui/react'; // Adjust based on your library
import { CheckIcon } from '@heroicons/react/outline'; // Adjust based on your icon library

const QuotationSuccess = ({ open, setOpen, dataed, router }) => {
  return (
    <Dialog open={open} onClose={() => setOpen(false)} className="relative z-10">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
            <div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="mt-3 text-center sm:mt-5">
                <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                  Quotation Number {dataed}
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Saved successfully!</p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-6">
              <button
                type="button"
                onClick={() => router.push(`/quotationchallanpdf/${dataed}`)}
                className="inline-flex w-full justify-center"
              >
                <span className="bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 rounded-md">
                  Done
                </span>
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

export default QuotationSuccess;
