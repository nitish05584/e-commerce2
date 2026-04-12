import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { UserData } from './context/UserContext'
import Verify from './pages/Verify'


const App = () => {
  const {}=UserData()
  return (
<>
    <BrowserRouter>
    <Navbar/>
    <Routes>
      
      <Route path='/' element={<Home/>}/>

      <Route path='/login' element={<Login/>}/>

      <Route path='/verify' element={<Verify/>}/>

    </Routes>
    <Footer/>
    </BrowserRouter>
    
    </>
  )
}

export default App
