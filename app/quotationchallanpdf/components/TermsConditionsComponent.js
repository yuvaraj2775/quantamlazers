import React from 'react';

const TermsConditionsComponent = ({ fetcheddata }) => {
  return (
    <div className="px-2 mt-2">
      <p className="font-bold">Terms & Conditions :</p>
      <div className="flex">
        <div>
          <p className="mt-2">PAYMENT TERMS :</p>
        </div>
        <div className="ml-3">
          <p className="mt-2 uppercase">1. {fetcheddata?.data.term1}</p>
          <p className="mt-2 uppercase">2. {fetcheddata?.data.term2}</p>
          <p className="mt-2 uppercase">3. {fetcheddata?.data.term3}</p>
          <p className="mt-2 uppercase">4. {fetcheddata?.data.term4}</p>
        </div>
      </div>
   
      <div className="">
      <p className="text-center ">Thank you</p>
        <div className='w-full' >
         
       
        <p className="font-bold text-right">For QUANTUM LASERS</p>

        </div>
        <div className='flex justify-between my-9' >
            
      <p className=" ">
        We are looking forward to receive your valuable orders and assure your best attention at all times.
      </p>
        <p className="font-bold ">Authorised Signatory</p>
        </div>
    
       
      </div>
 
    </div>
  );
};

export default TermsConditionsComponent;
