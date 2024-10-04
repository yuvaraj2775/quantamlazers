"use client"
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  MagnifyingGlassIcon,
  TableCellsIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/solid";
import { usePathname } from 'next/navigation';

export default function  Dashboard() {

  const navigation = [
    { name: "Search", href: "/DeliveryChallanPdf", icon: MagnifyingGlassIcon },
    { name: "Quotations", href: "/Quotation", icon: TableCellsIcon },
    {
      name: "Delivery Challan",
      href: "/delivery",
      icon: DocumentDuplicateIcon,
    },
  ];
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const currentRoute = usePathname();
  const [selectedNavbar, setSelectedNavbar] = useState(currentRoute);
  useEffect(()=>{
    setSelectedNavbar(currentRoute)
  },[currentRoute])

  return (
    <nav className="bg-gradient-to-r from-blue-100/60 to-slate-50 h-screen p-6 shadow-lg border-2 border-r-gray-600">
      <div className="text-gray-800 text-2xl font-bold mb-10">
        Quantum Lazers
      </div>
      <ul role="list" className="flex flex-col flex-1 gap-y-4">
            {navigation.map((item) => (
              <li key={item.name} className="font-medium " >
                <a
                  href={item.href}
                  className={classNames(
                    selectedNavbar === item.href
                      ? "bg-blue-400 text-gray-800 font-medium"
                      : "hover:bg-gray-200",
                    "group flex items-center gap-x-2 rounded-md p-2 text-sm"
                  )}
                >
                  <item.icon
                    className="w-5 h-5 text-gray-400 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="pt-0.5">{item.name}</span>
                </a>
              </li>
            ))}
          </ul>
    </nav>
  );
}
