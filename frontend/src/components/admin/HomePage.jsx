import { ProductData } from '@/context/ProductContext'
import React, { useState } from 'react'
import Loading from '../Loading'
import ProductCard from '../ProductCard'
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '../ui/pagination'

const HomePage = () => {
    const {products,page,setPage,fetchProduct,loading,totalPages}=ProductData()

     const nextPage=()=>{
    setPage(page+1);
  };
   const prevPage=()=>{
    setPage(page-1);
  };

  const [open,setOpen]=useState(false)

  const [formData,setFormData]=useState({
    title:"",
    description:"",
    price:"",
    category:"",
    stock:"",
    images:null
  })

  const handleChange=(e)=>{
    const {name,value}=e.target
    setFormData((prev)=>({...prev,[name]:value}))
  }
  const handleFileChange=(e)=>{
    setFormData((prev)=>({...prev,images:e.target.files}))
  }
  return (
    <div>
      <div className='flex justify-between'>
      <h2 className='text-2xl font-bold'>All Products</h2>
      </div>
      {
        loading ?( <Loading/>) : (<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols3-3 lg:grid-cols-4 gap-6'>
         {
          products && products.length >0 ?( products.map((e)=>{
            return <ProductCard product={e} key={e._id} latest={"no"}/>
          })) :(<p>No Products yet</p>

           )}
            
        </div>
      )}
       <div className='mt-2 mb-3'>
          <Pagination>
            <PaginationContent>
              {page !==1&& (
                <PaginationItem className='cursor-pointer'onClick={prevPage}>
                  <PaginationPrevious/>
                  </PaginationItem>
              )}
              {
                page !==totalPages && (
                  <PaginationItem className='cursor-pointer'onClick={nextPage}>
                  <PaginationNext/>
                  </PaginationItem>
                )
              }
            </PaginationContent>
          </Pagination>
        </div>

      
    </div>
  )
}

export default HomePage
