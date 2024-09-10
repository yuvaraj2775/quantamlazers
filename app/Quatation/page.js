import React from 'react'

const page = () => {
  return (
    <>
    <form action="">
    <div className='border-2 h-screen overflow-x-auto w-screen p-4'>
     <div className='flex justify-between'>
      <div></div>
      <div>
        <h1>Quatation Form</h1>
      </div>
      <div>
        <h1>Quatation NO: Draft</h1>
      </div>
     </div>
     <div className='grid grid-cols-2'>
      <div>
      <div class="flex flex-col"><label class="text-gray-800 font-semibold mb-2">Address</label><textarea name="buyer" placeholder="Enter the Address" class="border border-gray-300 capitalize text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 resize-none min-h-[150px] max-h-[300px] shadow-sm transition-all duration-300"></textarea></div>
      </div>
      <div>
        <div>
        <label htmlFor="">Date</label>
          <input type="text" className='border-2 w-full' name="" id="" />
        </div>
        <div> 
        <label htmlFor="">Reference Number</label>
          <input type="text" className='w-full border-2' name="" id="" />
        </div>
      </div>
     </div>
     <div className='grid grid-cols-2'>
      <div>
        <label htmlFor="">GST Number</label>
        <input type="text" className='border-2 w-full' name="" id="" />
      </div>
      <div>
      <label htmlFor="">GST Number</label>
      <input type="text" className='border-2 w-full' name="" id="" />
      </div>
     </div>
     <div>
      <label htmlFor="">Subject</label>
      <input type="text" className='border-2 w-full' name="" id="" />
     </div>
     <table className='border-2  overflow-x-auto'>
      <tr>
        <th>SL.NO</th>
        <th>Item Name/Description</th>
        <th>HSN Code</th>
        <th>Qty</th>
        <th>Unit</th>
        <th>Unit Cost</th>
        <th>Taxable Value</th>
        <th>Type of Tax</th>
        <th>%</th>
        <th>Tax Amt</th>
        <th>Type of Tax</th>
        <th>%</th>
        <th>Tax Amt</th>
        <th></th>
        <th></th>
      </tr>
     </table>
     <div className='grid-cols-4 grid'>
      <div>
        <label htmlFor=""> Discount Amount (%)</label>
        <input type="text" className='border-2' name="" id="" />
      </div>
      <div>
        <label htmlFor="">Package Charges </label>
        <input type="text" className='border-2' name="" id="" />
      </div>
      <div>
        <label htmlFor="">Transportation Charges</label>
        <input type="text" className='border-2' name="" id="" />
      </div>
      <div>
        <label htmlFor="">Other Cost</label>
        <input type="text" className='border-2' name="" id="" />
      </div>
     </div>
     <div className='grid grid-cols-2'>
      <div>
       <div>
       <span>Grand Total (In Words)</span>
       <p></p>
       </div>
       <div>
        <span>Tax Amount</span>
        <div className='grid grid-cols-2'>
          <div>
            <label htmlFor="">CGST :</label>
            <p></p>
          </div>
          <div>
            <label htmlFor="">IGST :</label>
            <p></p>
          </div>
        </div>
        <div className='grid grid-cols-2'>
          <div>
            <label htmlFor="">SGST :</label>
            <p></p>
          </div>
          <div>
            <label htmlFor="">UGST :</label>
            <p></p>
          </div>
        </div>
       </div>
      </div>
      <div >
        <div className='grid grid-cols-2'>
          <p>Sub-Total Amt</p>
          <p>0.00</p>
        </div>
        <div className='grid grid-cols-2'>
          <p>Discount (0 %)</p>
          <p>0.00</p>
        </div>
        <div className='grid grid-cols-2'>
          <p>CGST</p>
          <p>0.00</p>
        </div>
        <div className='grid grid-cols-2'>
          <p>SGST</p>
          <p>0.00</p>
        </div>
        <div className='grid grid-cols-2'>
          <p>IGST</p>
          <p>0.00</p>
        </div>
        <div className='grid grid-cols-2'>
          <p>UGST</p>
          <p>0.00</p>
        </div>
        <div className='grid grid-cols-2'>
          <p>Package Charges</p>
          <p>0.00</p>
        </div>
        <div className='grid grid-cols-2'>
          <p>Transportation Charges</p>
          <p>0.00</p>
        </div>
        <div className='grid grid-cols-2'>
          <p>Other Cost</p>
          <p>0.00</p>
        </div>
        <div className='grid grid-cols-2'>
          <p>Grand Total (RS)</p>
          <p>0.00</p>
        </div>

      </div>
     </div>
     <div>
      <h1>Payment Terms</h1>
      <div className='border-2'>
        <input type="text" placeholder='Enter Payment Term 1' name=""  className='w-full border-none' id="" />
        <input type="text" placeholder='Enter Payment Term 2' name="" className='w-full' id="" />
        <input type="text" placeholder='Enter Payment Term 3' className='w-full' name="" id="" />
        <input type="text" placeholder='Enter Payment Term 4' className='w-full' name="" id="" />

      </div>
     </div>
     <div>
      <button type='submit' className='text-center' >Submit</button>
     </div>
    </div>
    </form>
    </>
  )
}

export default page
