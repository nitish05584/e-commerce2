import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className='w-[60%] m-auto flex flex-col justify-center items-center'>
      <img src="https://comodosslstore.com/resources/wp-content/uploads/2025/05/website-page-found-error-robot-character-broken-chatbot-mascot-disabled-site-technical-work_502272-1888.jpg" alt=""/>

      <Link to={'/'}><Button variant="ghost">Go To <Home/>Page</Button></Link>
    </div>
  )
}

export default NotFound
