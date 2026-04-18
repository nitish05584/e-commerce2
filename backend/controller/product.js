const bufferGenerator = require("../config/bufferGenerator");
const { create } = require("../models/Otp");
const Product = require("../models/Product");

const cloudinary = require("cloudinary").v2

const createProduct = async (req, res) => {
    try {
        if(req.user.role!=="admin"){
            return res.status(403).json({message:"Forbidden"})
        }
        const {title,description,price,category,stock}=req.body;
       const files=req.files;
       
       if (!files || files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }
      
      const imageUploadPromises = files.map(async(file) => {
      const fileBuffer=bufferGenerator(file)
      const  result=await cloudinary.uploader.upload(fileBuffer.content)
        return {id:result.public_id,url:result.secure_url}

      })
      const uploadedImage=await Promise.all(imageUploadPromises)

      const product=await Product.create({
        title,
        description,
        price,
        category,
        stock,
        images:uploadedImage
      })
      res.status(201).json({message:"Product created successfully",product})

        
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"createProduct server error"})
        
    }
}



const getAllProducts=async(req,res)=>{
    try {
        const {search,category,page,sortByPrice}=req.query;
        const filter={}
        if (search) {
            filter.title={$regex:search,$options:"i"}
        }
        if (category) {
            filter.category=category
        }
        const limit=8;

        const skip=(page-1)*limit
        
        let sortOption={createdAt:-1}

        if (sortByPrice) {
            if(sortByPrice==="lowToHigh"){
                sortOption={price:1}
            }else if(sortByPrice==="highToLow"){
                sortOption={price:-1}
            }
        }


        const products=await Product.find(filter).sort(sortOption).limit(limit).skip(skip)

        const categories=await Product.distinct("category")

        const newProduct=await Product.find().sort("-createdAt").limit(4)

        const countProduct=await Product.countDocuments()

        const totalPages=Math.ceil(countProduct/limit)

        res.json({message:"Products fetched successfully",products,categories,newProduct,totalPages})


    } catch (error) {
        console.error(error);
        res.status(500).json({message:"getAllProducts server error"})
    }
}


const getSingleProduct=async(req,res)=>{
    try {
        const product=await Product.findById(req.params.id)

        const relatedProduct=await Product.find({category:product.category,_id:{$ne:product._id}}).limit(4)

        res.status(200).json({message:"Product fetched successfully",product,relatedProduct})
        
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"getSingleProduct server error"})
    }
}



const updateProduct=async(req,res)=>{
    try {
        if(req.user.role!=="admin"){
            return res.status(403).json({message:"Forbidden"})
        }
        const {title ,description,price,category,stock}=req.body;

      const updateFields={}
       
      if (title){
        updateFields.title=title
      }
      if (description){
        updateFields.description=description
      }
      if (price !== undefined){
        updateFields.price=price
      }
      if (category){
        updateFields.category=category
      }
      if (stock !== undefined){
        updateFields.stock=stock
      }

      const updatedProduct=await Product.findByIdAndUpdate(req.params.id,updateFields,{new:true,runValidators:true})

     if (!updatedProduct) {
        return res.status(404).json({message:"Product not found"})
     }
        
     res.status(200).json({message:"Product updated successfully",updatedProduct})

    } catch (error) {
        console.error(error);
        res.status(500).json({message:"updateProduct server error"})
    }
}


const updateProductImage=async(req,res)=>{
    try {
        if(req.user.role!=="admin"){
            return res.status(403).json({message:"Forbidden"})
        }
        const {id}=req.params
        const files=req.files;
       
       if (!files || files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }
      const product=await Product.findById(id)
      
      if (!product) {
        return res.status(404).json({message:"Product not found"})
      }
      const oldImages=product.images||[]

      for (const img of oldImages){
        if (img.id) {
            await cloudinary.uploader.destroy(img.id)
        }
      } 
     
      const imageUploadPromises = files.map(async(file) => {
      const fileBuffer=bufferGenerator(file)
      const  result=await cloudinary.uploader.upload(fileBuffer.content)
        return {id:result.public_id,url:result.secure_url}

      })
      const uploadedImage=await Promise.all(imageUploadPromises)

        product.images=uploadedImage
        await product.save()
        res.status(200).json({message:"Product images updated successfully",product})


    } catch (error) {
        console.error(error);
        res.status(500).json({message:"updateProductImage server error"})
    }
}





module.exports={createProduct,getAllProducts,getSingleProduct,updateProduct,updateProductImage}