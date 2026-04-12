const { createTestAccount } = require("nodemailer");
const sendOrderConfirmation = require("../config/sendOrderConfirmation");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const { create } = require("../models/Otp");
const Product = require("../models/Product");


const newOrderCode=async(req,res)=>{
    try {
        const {method,phone,address} = req.body;

        const cart=await Cart.find({user:req.user._id}).populate({path:"product",select:"total price"})

        if(!cart.length){
            return res.status(400).json({message:"Cart is empty"})
        }
        let subTotal=0;

        const items=cart.map((i)=>{
            const itemSubTotal=i.product.price*i.quantity

            subTotal+=itemSubTotal

            return {
                product:i.product._id,
                quantity:i.quantity,
                price:i.product.price,
                name:i.product.title

            }
        })
        const order=await Order.create({
            user:req.user._id,
            items,
            subTotal,
            method,
            phone,
            address
        })
        for(let i of order.items){
            const product=await Product.findById(i.product)

            if(product){
                product.stock-=i.quantity
                product.sold+=i.quantity
                await product.save()
            }
        }
        await Cart.deleteMany({user:req.user._id})

        await sendOrderConfirmation({email:req.user.email,subject:"Order Confirmation",orderId:order._id,
            products:items,
            totalAmount:subTotal
        })

        res.status(200).json({message:"Order placed successfully",order})

    } catch (error) {
            return res.status(500).json({message:"newOrderCode server error"})
    }
}


const getAllOrders=async(req,res)=>{
    try {
        const orders=await Order.find({user:req.user._id})

        res.json({orders:orders.reverse()})
    } catch (error) {
      return res.status(500).json({message:"getAllOrders server error"})  
    }
}



const getAllOrdersAdmin=async(req,res)=>{
    try {
        if(req.user.role!=="admin"){
            return res.status(403).json({message:"Forbidden"})
        }
        const orders=(await Order.find().populate("user")).toSorted({createdAt:-1})

        res.json(orders)
    } catch (error) {
      return res.status(500).json({message:"getAllOrdersAdmin server error"})  
    }
}

const getMyOrder=async(req,res)=>{
    try {
        const order=await Order.findById(req.params.id).populate("user").populate("items.product")
        res.json(order)
    } catch (error) {
      return res.status(500).json({message:"getMyOrder server error"})  
    }
}


const updateStatus=async(req,res)=>{
    try {
        if(req.user.role!=="admin"){
            return res.status(403).json({message:"Forbidden"})
        }
        const order=await Order.findById(req.params.id)
        const {status}=req.body
        
        order.status=status
        await order.save()
        res.json({message:"Order status updated successfully",order})
    } catch (error) {
      return res.status(500).json({message:"updateStatus server error"})  
    }
}

const getStats=async(req,res)=>{
    try {
        if(req.user.role!=="admin"){
            return res.status(403).json({message:"Forbidden"})
        }
        const cod=await Order.find({method:"cod"}).countDocuments()
        const online=await Order.find({method:"online"}).countDocuments()

        const products=await Product.find()

        const data=products.map((prod)=>({
            name:prod.titlw,
            sold:prod.sold
        }))
        
        res.json({cod,online,data})
    } catch (error) {
      return res.status(500).json({message:"getStats server error"})          
    }
}


module.exports={newOrderCode,getAllOrders,getAllOrdersAdmin,getMyOrder,updateStatus,getStats}