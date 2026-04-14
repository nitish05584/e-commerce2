import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'

const Products = () => {
  const [show,setShow]=useState(false)
  return (
    <div className='flex flex-col md:flex-row h-full'>
      <div className={`fixed inset-y-0 left-0 z-50 md:z-40 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${show ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className='p-4 relative'>
          <button onClick={()=>setShow(false)} className='absolute top-4 right-4 bg-gray-400 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full p-2 md:hidden'>X</button>
          <h2 className='text-lg font-bold mb-2'>Filter</h2>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-2'>Search Title</label>
            <Input type="text" placeholder="Search Title" className='w-full p-2 border rounded-full'/>
          </div>

          <div className='mb-4'>
            <label className='block text-sm font-medium mb-2'>Category</label>
            <select className='w-full p-2 border rounded-md dark:bg-gray-900 dark:text-white'>
      <option value="">All </option>
            </select>
          </div>

          <div className='mb-4'>
            <label className='block text-sm font-medium mb-2'>Price</label>
            <select className='w-full p-2 border rounded-md dark:bg-gray-900 dark:text-white '>
      <option value="">select </option>
       <option value="lowToHigh">Low to High</option>
        <option value="highToLow">High to Low</option>
            </select>
          </div>
          <Button className='mt-2'>clear Filter</Button>
        </div>
      </div>
    </div>
  )
}

export default Products
