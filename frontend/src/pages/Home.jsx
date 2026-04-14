import Hero from '@/components/Hero'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate=useNavigate()
  return (
    <div>
      <Hero navigate={navigate}/>
      <div className='top products mt-4 p-4'>
        <h1 className='text-3xl mb-4'>Latest Products</h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
          
        </div>
      </div>
    </div>
  )
}

export default Home
