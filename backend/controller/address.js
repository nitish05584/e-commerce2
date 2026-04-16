const Address = require("../models/Address")


const addAddress = async (req, res) => {
    try {
        const {address,phone}=req.body
        await Address.create({address,phone,user:req.user._id})
        res.status(200).json({message:"Address added successfully"})
    } catch (error) {
        res.status(500).json({message:" address Server error"})
    }
}

const getAllAddress=async(req,res)=>{
    try {
        const allAddress=await Address.find({user:req.user._id})
       return res.status(200).json({message:"Address fetched successfully",allAddress})
    } catch (error) {
        res.status(500).json({message:" address Server error"})
    }
}


const getSingleAddress=async(req,res)=>{
    try {
        const address=await Address.findById(req.params.id)
        res.status(200).json({message:"Address fetched successfully",address})

    } catch (error) {
        res.status(500).json({message:" address Server error"})
    }
}


const deleteAddress=async(req,res)=>{
    try {
        const address=await Address.findOne({_id:req.params.id,user:req.user._id})
        await address.deleteOne()
        res.status(200).json({message:"Address deleted successfully"})
    } catch (error) {
        res.status(500).json({message:" address Server error"})
    }
}

module.exports={addAddress,getAllAddress,getSingleAddress,deleteAddress}