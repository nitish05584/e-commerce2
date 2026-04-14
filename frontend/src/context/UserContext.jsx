import { createContext, useContext, useState } from "react";
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




  const verifyUser = async (otp, navigate) => {
    setBtnLoading(true);
    const email=localStorage.getItem("email")
    try {
      const { data } = await axios.post(`${server}/api/user/verify`, {email, otp });

      toast.success(data.message);
      localStorage.clear();
      navigate("/")
      setBtnLoading(false);
      Cookies.set("token", data.token,{expires:15, secure: true, path:"/"});
      setIsAuth(true);
      setUser(data.user);
      
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{ user, loading, btnLoading, isAuth, loginUser,verifyUser }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);