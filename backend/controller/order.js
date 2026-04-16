const { createTestAccount } = require("nodemailer");
const sendOrderConfirmation = require("../config/sendOrderConfirmation");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const { create } = require("../models/Otp");
const Product = require("../models/Product");
const dotenv=require("dotenv")
dotenv.config()


const Stripe=require("stripe")


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


const stripe=new Stripe(process.env.Stripe_Secret_Key)

const newOrderOnline=async(req,res)=>{
    try {
        const {method,phone,address} = req.body;
        const cart=await Cart.find({user:req.user._id}).populate("products")

        if(!cart.length){
            return res.status(400).json({message:"Cart is empty"})
        }
        const subTotal=cart.reduce((total,item)=>total+item.product.price*item.quantity,0)
        const lineItems=cart.map((item)=>({
           price_Data:{
           curency:"inr",
            product_data:{
                name:item.product.title,
                images:[item.product.images[0].url],
            },
            unit_amount:Math.round(item.product.price*100),
           } ,
              quantity:item.quantity
        }))
        const session=await stripe.checkout.sessions.create({
            payment_method_types:["card"],
            line_items:lineItems,
            mode:"payment",
            success_url:`${process.env.Frontend_Url}/ordersuccess?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url:`${process.env.Frontend_Url}/cart`,
            metadata:{
                userId:req.user._id.toString(),
                method,
                phone,
                address,
                subTotal
            }
        })
        res.json({url:session.url})
       
        
    } catch (error) {
      console.log(error)
      return res.status(500).json({message:"newOrderOnline server error"})  
    }
}


const verifyPayment=async(req,res)=>{
    try {
       const {sessionsId} = req.body
         const session=await stripe.checkout.sessions.retrieve(sessionsId)
       
         const {userId,method,phone,address,subTotal}=session.metadata

         const cart=await Cart.find({user:userId}).populate("products")

         const items=cart.map((i)=>{
            return{
                product:i.product._id,
                name:i.product.title,
                price:i.product.price,
                quantity:i.quantity
            }
         })

         if(cart.length===0){
            return res.status(400).json({message:"Cart is empty"})
         }

         const existingOrder=await Order.findOne({paymentInfo:sessionsId})

            if(!existingOrder){
               const order=await Order.create({
                   items:cart.map((item)=>({
                    product:item.product._id,
                   quantity:item.quantity,
                   })),
                   method,
                   phone,
                   address,
                   subTotal,
                   paymentInfo:sessionsId,
                   user:userId,
                   paidAt:new Date()
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
        return res.json({message:"Payment verified and order placed successfully",order})

 
            }




    } catch (error) {
        console.error(error)
        return res.status(500).json({message:"verifyPayment server error"})
    }
}


module.exports={newOrderCode,getAllOrders,getAllOrdersAdmin,getMyOrder,updateStatus,getStats,newOrderOnline,verifyPayment}