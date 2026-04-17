import { server } from '@/main'
import axios from 'axios'
import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import Loading from '../Loading'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Link } from 'react-router-dom'


const OrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
 try {
  const {data}=await axios.get(`${server}/api/order/admin/all`,{
    headers:{
      token:Cookies.get("token")
    }
  })
  setOrders(data)
  setLoading(false)
 } catch (error) {
  console.log(error)
  setLoading(false)
 }
  }
  useEffect(()=>{
    fetchOrders()
  },[])
  const filteredOrders = orders.filter((order)=>order.user.email.toLowerCase().includes(search.toLocaleLowerCase()) || order._id.toLowerCase().includes(search.toLocaleLowerCase()))

  return (
    <div className='p-6 space-y-6'>
    <h1 className='text-2xl font-bold'>Manage Orders</h1> 
    <Input placholder="search by email or order id" value={search} onChange={(e)=>setSearch(e.target.value)} className="w-full md:w-1/2"/> 
    {
    loading ?(<Loading/>): (filteredOrders.length > 0 ? (<div className='overflow-x-auto'> 
    <Table>
     <TableHeader>
    <TableRow>
     <TableHead>Order ID</TableHead>
    <TableHead>User Email</TableHead>
    <TableHead>Total </TableHead>
     <TableHead> Status</TableHead> 
     <TableHead>Date</TableHead>
     <TableHead>Action</TableHead>
   </TableRow>  
     </TableHeader>
     <TableBody>
      {filteredOrders.map((order)=>(
        <TableRow key={order._id}>

       <TableCell>
       <Link to={`/order/${order._id}`} >{order._id}</Link>
        </TableCell> 

        <TableCell>
        {order.user.email}
        </TableCell> 

        <TableCell>
        {order.subTotal}
        </TableCell> 
          
        </TableRow>
      ))}
     </TableBody>
    </Table>
    </div>):(<p>No Orders</p>)
    )}
    </div>
  )
}

export default OrdersPage
