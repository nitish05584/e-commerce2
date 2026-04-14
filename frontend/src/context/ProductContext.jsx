import { server } from "@/main";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {

    const [products, setProducts] = useState([]);
    const [newProd, setNewProd] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        setLoading(true);
        try {
           const {data}= await axios.get(`${server}/api/product/all`);
            setProducts(data.products);
            setNewProd(data.newProduct);
            setLoading(false);
        } catch (error) {
          console.log(error) 
           setLoading(false);
        }
    }
    useEffect(()=>{
       fetchProducts(); 
    },[])

    return (
        <ProductContext.Provider value={{loading, products, newProd}}>
            {children}
        </ProductContext.Provider>
    )
}

export const ProductData = () => useContext(ProductContext);