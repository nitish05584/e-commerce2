import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { server } from "@/main";
import Cookies from "js-cookie";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [isAuth, setIsAuth] = useState(false);


  const loginUser = async (email, navigate) => {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/login`, { email });

      toast.success(data.message);
      localStorage.setItem("email",email);
      navigate("/verify")
      setBtnLoading(false);
      
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setBtnLoading(false);
    }
  };




  const verifyUser = async (otp, navigate,fetchCart) => {
    setBtnLoading(true);
    const email=localStorage.getItem("email")
    try {
      const { data } = await axios.post(`${server}/api/user/verify`, {email, otp });

      toast.success(data.message);
      localStorage.clear();
      navigate("/")
      setBtnLoading(false);
       setIsAuth(true);
      setUser(data.user);

      Cookies.set("token", data.token,{expires:15, secure: true, path:"/"});
     
      fetchCart();
      
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setBtnLoading(false);
    }
  };


  const fetchUser = async () => {
    try {
      const { data } = await axios.get(`${server}/api/user/me`,{
        headers:{token:Cookies.get("token")}
      } )
      setUser(data.user);
      setIsAuth(true);
      setLoading(false);
    } catch (error) {
      console.log(error)
        setIsAuth(false);
        setLoading(false);
    }
  }

  const logoutUser = (navigate,setTotalItem) => {
 Cookies.set("token",null);
 setUser([])
 setIsAuth(false)
 navigate("/login")
 toast.success("Logged out successfully")
  setTotalItem(0)
 
  }

  useEffect(()=>{
    fetchUser()
  },[])




  return (
    <UserContext.Provider
      value={{ user, loading, btnLoading, isAuth, loginUser,verifyUser,logoutUser }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);