"use client"
import { useRouter } from 'next/navigation'
import React from 'react'

const Page = () => {
    const router = useRouter();
    
    

    return (
        <div className='w-full overflow-y-auto h-screen m-4'>
            <h1 className='font-bold text-3xl text-center p-5'>Generated Quote</h1>
            <div className='min-w-full mx-2 mt-2 border-2 border-black space-y-5'>
                <div className='flex space-x-5'>
                    <div><img  alt="" /></div>
                    <div> <p><h2 className='text-yellow-500 font-bold text-xl uppercase'>Quantum Lasers</h2>
                        <div className='text-blue-900 font-semibold text-xl'> 
                          <p></p>  
                          <p></p>
                          <p></p>
                          <p></p>
                        </div>
                    </p>
                    </div>
                </div>
                <div className='text-blue-700 italic font-semibold '>
                    <p>GST.NO:33AYXPP7084J1ZI</p>
                    
                </div>
            </div>


            <div className='min-w-full mx-2 font-semibold text-xl uppercase text-center border-x-2 border-b-2 border-black'>
                <h3>Quotation</h3>
            </div>

            <div className='min-w-full h-12 max-w-full mx-2 border-x-2 border-b-2 border-black'>

            </div>

            
            <div className=' min-w-full grid grid-cols-2 mx-2 border-x-2 border-b-2 border-black  '>
               
                <div className='flex justify-start items-end pb-3 border-r-2 border-black px-2 font-semibold '>
                    <div>
                        <p>{}</p>
                        <p>GST NO :{}</p>
                        <p>kind Attn :</p>
                    </div>

                </div>

               
                <div className='space-y-5 px-2 '>
                    <div className='font-semibold'>
                        <p>Quotation ID:</p>
                        <p>Date : {}</p>
                    </div>

                    <div className='flex space-x-20 pb-9'>
                        <p>Ref NO: {}</p>
                        <p className='font-semibold'>EMAIL</p>
                    </div>
                </div>

            </div>

           

            <div className=' min-w-full mx-2 border-x-2 border-b-2 border-black font-semibold'>
                <p>Subject : {}</p>
            </div>

            <div className=' min-w-full mx-2 border-x-2 border-b-2 border-black pt-3'>
                <p>We are pleased to submit the following quote as requested</p>
            </div>

           

            <div>
                <table className=' mx-2 min-w-full mb-10  '>
                    <thead className=' border-collapse'>
                        <tr className=''>
                            <th className='border-2 border-t-0 border-black'>SL.NO</th>
                            <th className='border-2 border-t-0 border-black'>Item Name / Description</th>
                            <th className='border-2 border-t-0 border-black'>HSN code</th>
                            <th className='border-2 border-t-0 border-black'>Qty</th>
                            <th className='border-2 border-t-0 border-black'>unit</th>
                            <th className='border-2 border-t-0 border-black'>unit Cost</th>
                            <th className='border-2 border-t-0 border-black'>Taxable value</th>
                            <th className='border-2 border-t-0 border-black w-32'>CGST/IGST
                                <th className='border-t-2 border-r-2 border-black   w-1/2 '>%</th>
                                <th className='border-t-2  border-black min-w-full w-1/2'>Tax Amt</th>
                            </th>
                            <th className='border-2 border-t-0 border-black w-32 '>SGST/UGST
                                <th className='border-t-2 border-r-2 border-black w-1/2 '>%</th>
                                <th className='border-t-2  border-black min-w-full w-1/2'>Tax Amt</th>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
           
              <tr  className="text-center h-8">
                <td className="border-2 border-t-0 border-black">{}</td>
                <td className="border-2 border-t-0 border-black">{}</td>
                <td className="border-2 border-t-0 border-black">{}</td>
                <td className="border-2 border-t-0 border-black">{}</td>
                <td className="border-2 border-t-0 border-black">{}</td>
                <td className="border-2 border-t-0 border-black">{}</td>
                <td className="border-2 border-t-0 border-black">{}</td>
                <td className="border-2 border-t-0 border-black">
                  <div className="flex">
                    <div className="w-1/2">{}</div>
                    <div className="w-1/2">{}</div>
                  </div>
                </td>
                <td className="border-2 border-t-0 border-black">
                  <div className="flex">
                    <div className="w-1/2">{}</div>
                    <div className="w-1/2">{}</div>
                  </div>
                </td>
              </tr>
         
          </tbody>

          <tfoot className=''>
          <tr>
            <td  className="text-right font-bold">Total Items:</td>
            <td >{}</td>
            <td  className="text-right font-bold">Total Unit Cost:</td>
            <td >{}</td>
          </tr>
          </tfoot>
                </table>

            </div>

        </div>
    );
};

export default Page;
