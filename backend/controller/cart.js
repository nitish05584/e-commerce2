const Cart = require("../models/Cart")
const Product = require("../models/Product")

const addToCart = async (req, res) => {
    try {
        const {product}=req.body

        if(!product){
            return res.status(400).json({message:"Product id is required"})
        }

        const cart=await Cart.findOne({product:product,user:req.user._id}).populate("product")
        
        if(cart){
           if(cart.product.stock<=cart.quantity){
            return res.status(400).json({message:"Product stock limit reached"})
        }
            cart.quantity+=1
            await cart.save()
            return res.status(200).json({message:"Product quantity updated in cart",cart})
        
    }

    const cartProd=await Product.findById(product)

    if(!cartProd){
        return res.status(404).json({message:"Product not found"})
    }

    if(cartProd.stock<=0){
        return res.status(400).json({message:"Product out of stock"})
    }
    const createdCart=await Cart.create({product:product,user:req.user._id,quantity:1})
    return res.status(200).json({message:"Product added to cart successfully",cart:createdCart})

    } catch (error) {
        res.status(500).json({message:"cart server error"})
    }
}



const removeFromCart=async(req,res)=>{
    try {
        const cart=await Cart.findById(req.params.id)

        await cart.deleteOne()

        res.status(200).json({message:"Product removed from cart successfully"})
        
    } catch (error) {
        res.status(500).json({message:"cart server error"})
    }
}


const updateCart=async(req,res)=>{
    try {
        const {action}=req.query

        if(action==="inc"){
            const {id}=req.body
            const cart=await Cart.findById(id).populate("product")

            if(cart.quantity<cart.product.stock){
             cart.quantity+=1

             await cart.save()
                res.status(200).json({message:"Cart quantity increased",cart})
                
            }else{
                res.status(400).json({message:"Product stock limit reached"})
            }
            res.status(200).json({message:"Cart quantity increased"})
        }
        if(action==="dec"){
            const {id}=req.body
            const cart=await Cart.findById(id).populate("product")
            
            if(cart.quantity>1){
             cart.quantity-=1
             await cart.save()
             res.status(200).json({message:"Cart quantity decreased",cart})
            }else{
                res.status(400).json({message:"Cannot decrease quantity below 1"})
            }
            res.status(200).json({message:"Cart quantity decreased"})
        }

        
    } catch (error) {
       
        res.status(500).json({message:"updateCart server error"})
    }
}

const fetchCart=async(req,res)=>{
    try {
        const cart=await Cart.find({user:req.user._id}).populate("product")
        const sumofQuantities=cart.reduce((total,item)=>total+item.quantity,0)

        let subTotal=0;
        cart.forEach((i)=>{
            const itemSubTotal=i.product.price*i.quantity
            subTotal+=itemSubTotal
        })
        res.status(200).json({message:"Cart fetched successfully",cart,subTotal,sumofQuantities})

    } catch (error) {
        res.status(500).json({message:"fetchCart server error"})
    }
}

module.exports={addToCart,removeFromCart,updateCart,fetchCart}