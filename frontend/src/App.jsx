import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { UserData } from './context/UserContext'
import Verify from './pages/Verify'
import Loading from './components/Loading'
import Products from './pages/Products'
import Cart from './pages/Cart'


const App = () => {
  const {isAuth,loading}=UserData()
  return (
<>
    {loading ? <Loading/> : 
    <BrowserRouter>
    <Navbar/>
    <Routes>
      
      <Route path='/' element={<Home/>}/>

       <Route path='/products' element={<Products/>}/>

       <Route path='/cart' element={isAuth ? <Cart/> : <Login/>}/>

      <Route path='/login' element={isAuth ? <Home/> : <Login/>}/>

      <Route path='/verify' element={isAuth ? <Home/> : <Verify/>}/>

    </Routes>
    <Footer/>
    </BrowserRouter>

    }
    
    </>
  )
}

export default App
