const sendOtp = require("../config/sendOtp")
const OTP = require("../models/Otp")
const User = require("../models/User")

const jwt = require("jsonwebtoken")

const loginUser=async(req,res)=>{
    try {
        const {email}=req.body

        if (!email) {
            return res.status(400).json({message: "Email is required"})
        }

        const subject="ecommerce App"

        const otp=Math.floor(Math.random()*1000000)

        const prevOtp=await OTP.findOne({email})
        if(prevOtp){
            await prevOtp.deleteOne() 
        }
        await sendOtp({email,subject,otp})

        await OTP.create({email,otp})

        res.status(200).json({message:"OTP sent successfully"})

    } catch (error) {
        res.status(500).json({message:"loginuser server error"})
    }
}


const verifyUser=async(req,res)=>{
    try {
        const {email,otp}=req.body
        
        
        const haveOtp=await OTP.findOne({email,otp})
        if (!haveOtp) {
            return res.status(400).json({message: "Invalid OTP"})
        }
        let user=await User.findOne({email})

        if(user){
            const token=jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"})
        
        await haveOtp.deleteOne()
        res.status(200).json({message:"OTP verified successfully",token,user})
        }else{
            user=await User.create({email})
            const token=jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"})
        
        await haveOtp.deleteOne()
        res.status(200).json({message:"OTP verified successfully",token,user})
        }
    } catch (error) {
        res.status(500).json({message:"verifyUser server error"})
    }
}



const myProfile=async(req,res)=>{
    try {

        const user=await User.findById(req.user._id)

        if (!user) {
            return res.status(404).json({message: "User not found"})
        }

        res.status(200).json({message:"User profile fetched successfully",user})
        
    } catch (error) {
        res.status(500).json({message:"myProfile server error"})
    }
}


module.exports={loginUser,verifyUser,myProfile}