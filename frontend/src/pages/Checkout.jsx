import Loading from '@/components/Loading'
import { Button } from '@/components/ui/button'
import { server } from '@/main'
import axios from 'axios'
import Cookies from 'js-cookie'
import { Trash } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Checkout = () => {
    const [address,setAddress]=useState([])
    const [loading,setLoading]=useState(false)

    const fetchAddress=async()=>{
        try {
            const {data}=await axios.get(`${server}/api/address/all`,{
                headers:{
                    token:Cookies.get("token")
                }
            })
            setAddress(data.address)
            setLoading(false)
        } catch (error) {
         console.log(error)
            setLoading(false)   
        }
    }
    useEffect(()=>{
       fetchAddress() 
    },[])
  return (
    <div className='container mx-auto px-4 py-8 min-h-[60vh]'>
      <h1 className='text-3xl font-bold mb-6 text-center'>Checkout</h1>
      {
        loading ? <Loading/>: <div className='grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4'>
            {address && address.length>0 ? address.map((e)=>(
             <div className='p-4 border rounded-lg shadow-sm' key={e._id}>
              <h3 className='text-lg font-semibold flex justify-between gap-3'>Address- {e.address}
                 <Button varient="destructive" ><Trash/></Button> 
                  </h3> 

                <p className='text-sm'>
                    Phone-{e.phone}
                    </p> 
                 <Link to={`/payment/${e._id}`}>
                 <Button varient="outline">Use Address</Button>
                 </Link>    
             
             </div>
            )):(<p>No Address found</p>)}
        </div>
      }
      <Button className="mt-6" varient="outline">
        Add New Address
      </Button>
    </div>
  )
}

export default Checkout
