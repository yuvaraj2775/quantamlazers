import React from 'react';

const QuotationFooter = ({ fetcheddata }) => {
  return (
    <div>
      <div className="flex w-full border-y-2 mt-10 border-black">
        <div className="border-r-2 px-2 py-3 w-3/5 border-black">
          <p className="font-bold uppercase">Buyer :</p>
          <pre className="uppercase mt-2">{fetcheddata?.data.Address}</pre>

          <div className="grid grid-cols-2 mt-3">
            <p className="font-bold ">GST NO</p>
            <p className='uppercase' >: {fetcheddata?.data.gstnumber}</p>
          </div>
          <div className="grid grid-cols-2 mt-2">
            <p className="uppercase font-bold">Kind Attention</p>
            <p className="font-normal uppercase">: {fetcheddata?.data.kindattention}</p>
          </div>
        </div>
        <div className="px-2 w-2/5 capitalize font-semibold">
          <div className="mt-2 grid pb-3 grid-cols-2">
            <label>Quotation ID</label>
            <p className="font-normal">: {fetcheddata?.data.id}</p>
            <label className="mt-2">Date</label>
            <p className="font-normal mt-2">: {fetcheddata?.data.Date}</p>
            <label className="mt-2">Ref NO</label>
            <p className="font-normal mt-2 uppercase">: {fetcheddata?.data.reference}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center border-b-2   pl-5  border-black">
       <div className='flex   mb-3' >
       <p className="font-bold mr-3  ">Subject</p>
       <p className="uppercase">: {fetcheddata?.data.subject}</p>
       </div>
      </div>
      <div className="  pb-2">
        <p className="ml-5 mt-1 mb-2 ">We are pleased to submit the following quote as requested</p>
      </div>
    </div>
  );
};

export default QuotationFooter;
