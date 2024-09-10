import Link from "next/link";
import React from "react";
import {
  MagnifyingGlassIcon,
  TableCellsIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/solid";


export default function Dashboard() {
  return (
    <>
      <nav className="bg-gray-200  h-screen p-4">
        <div className="">
          <div className="text-gray-800  text-xl font-bold">
            <Link href="/">
              <p>Quantum Lazers</p>
            </Link>
          </div>
          <div className="space-x-4  mt-10">
            <Link href="/Search">
              <div className="flex items-center">
                <MagnifyingGlassIcon className="w-4 h-4 mr-1" />
                <p className="text-gray-800 hover:text-blue-500">Search</p>
              </div>
            </Link>

            <Link href="/Quatation">
              <div className="flex items-center">
                <TableCellsIcon className="w-4 h-4 mr-1" />
                <p className="text-gray-800 hover:text-blue-500">Quotation</p>
              </div>
            </Link>

            <Link href="/delivery">
              <div className="flex items-center">
                <DocumentDuplicateIcon className="w-4 h-4 mr-1" />
                <p className="text-gray-800 hover:text-blue-500">DC Challan</p>
              </div>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
