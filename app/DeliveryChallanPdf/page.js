"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const SearchInput = () => {
  const [searchInput, setSearchInput] = useState('');
  const router = useRouter();

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Navigate to the quotation page with the new search input
    router.push(`/DeliveryChallanPdf/${searchInput}`); // Adjust the route as necessary
  };

  return (
    <form onSubmit={handleSearchSubmit} className='flex items-center'>
      <input
        type="text"
        value={searchInput}
        onChange={handleSearchChange}
        className='h-10 w-2/5 border-2 rounded-md'
        placeholder="Enter quotation ID"
      />
      <button type="submit" className='h-10 border-2 rounded-md ml-2'>Search</button>
    </form>
  );
};

export default SearchInput;
