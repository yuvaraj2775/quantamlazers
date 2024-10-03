import Link from "next/link";
import React from "react";
import {
  MagnifyingGlassIcon,
  TableCellsIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/solid";

export default function  Dashboard() {
  return (
    <nav className="bg-gradient-to-r from-blue-100/60 to-slate-50 h-screen p-6 shadow-lg border-2 border-r-gray-600">
      <div className="text-gray-800 text-2xl font-bold mb-10">
        Quantum Lazers
      </div>
      <div className="space-y-6">
        <Link href="/DeliveryChallanPdf">
          <div className="flex items-center p-2 rounded-lg hover:bg-blue-200 transition-colors">
            <MagnifyingGlassIcon className="w-5 h-5 text-slate-600 mr-3" />
            <p className="text-slate-600 text-lg font-semibold">Search</p>
          </div>
        </Link>

        <Link href="/Quotation">
          <div className="flex items-center p-2 rounded-lg hover:bg-blue-200 transition-colors">
            <TableCellsIcon className="w-5 h-5 text-slate-600 mr-3" />
            <p className="text-slate-600 text-lg font-semibold">Quotation</p>
          </div>
        </Link>

        <Link href="/delivery">
          <div className="flex items-center p-2 rounded-lg hover:bg-blue-200 transition-colors">
            <DocumentDuplicateIcon className="w-5 h-5 text-slate-600 mr-3" />
            <p className="text-slate-600 text-lg font-semibold">DC Challan</p>
          </div>
        </Link>
      </div>
    </nav>
  );
}
