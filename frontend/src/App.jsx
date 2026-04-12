import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const App = () => {
  return (
    <>
    <BrowserRouter>
    <Navbar/>
    <Routes>
      
      <Route path='/' element={<Home/>}/>

      <Route path='/login' element={<Login/>}/>

    </Routes>
    <Footer/>
    </BrowserRouter>
     
    </>
  )
}

export default App
