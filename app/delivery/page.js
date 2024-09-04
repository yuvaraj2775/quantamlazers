import React from "react";


export default function page() {
  return (
    <div>
        <div className="h-screen p-4">
      <h1 className="text-center mt-5 font-bold text-xl">DC Form</h1>

      <div>
        <div className="grid grid-cols-2">
          <div className="capitalize">
            <label htmlFor="">Buyer</label>
            <input type="text" className=" border-2  rounded h-32 w-full" name="" id="" />
          </div>

          <div className="capitalize ml-3">
            <div>
              <label htmlFor="">DC date</label>
              <input type="date" className="px-2 border-2 h-10 rounded w-full" name="" id="" />
            </div>
            <div className="grid grid-cols-2">
              <div>
                <label htmlFor="">your order number</label>
                <input type="text" className="border-2 h-10 rounded w-full" name="" id="" />
              </div>
              <div className="ml-2">
                <label htmlFor="">your order date</label>
                <input type="date" className="px-2 border-2 rounded h-10 w-full" name="" id="" />
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 capitalize">
            <div>
                <label htmlFor="">vehicle number</label>
                <input type="text" name="" className="h-10 w-full border-2" id="" />
            </div>
            <div>
                <label htmlFor="">GST number</label>
                <input type="text" name="" className="h-10 w-full border-2" id="" />
            </div>
            <div>
                <label htmlFor="">Your DC Number</label>
                <input type="text" name="" className="h-10 w-full border-2" id="" />
            </div>
            <div>
                <label htmlFor="">Your DC Date</label>
                <input type="text" name="" className="h-10 w-full border-2" id="" />
            </div>

        </div>
        <div className="capitalize mt-5 ">

            <table className="border-2">
                <tr className="grid grid-cols-8">
                    <th className="">sl.no</th>
                    <th className=" border-l-2">item name/ description</th>
                    <th className=" border-l-2">HSN code</th>
                    <th className=" border-l-2">qty</th>
                    <th className=" border-l-2">umo</th>
                    <th className=" border-l-2">remarks</th>
                    <th className=" border-l-2"></th>
                    <th className=" border-l-2"></th>
                </tr>
                <tr>
                    <th className=""></th>
                    <th className=""></th>
                    <th className=""></th>
                    <th className=""></th>
                    <th className=""></th>
                    <th className=""></th>
                    <th className=""></th>
                    <th className=""></th>
                    
                </tr>
            </table>

        </div>
        <div className="flex justify-center mt-4">
        <div className="text-center border-2 p-2 w-14 rounded-md bg-green-500 text-white">
            <span>save</span>
        </div>
        </div>
      </div>
    </div>
    </div>
    
  );
}
