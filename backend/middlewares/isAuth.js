
const jwt = require("jsonwebtoken")
const User = require("../models/User")


const isAuth=async(req,res,next)=>{
    try {
        const {token}=req.headers;
       
        
        if (!token) {
            return res.status(401).json({message: "Unauthorized"})
        }
        const decodedData=jwt.verify(token,process.env.JWT_SECRET)
        req.user=await User.findById(decodedData._id)

        next()
        
    } catch (error) {
       console.log(error)
       return res.status(500).json({message: "isauth server error"}) 
    }
}

module.exports=isAuth