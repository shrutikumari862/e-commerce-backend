import express from 'express'
import { User } from '../models/user.model.js'
import { Product } from '../models/product.model.js'
import { chekLogin } from '../middlewares/checkLogin.middleware.js'
import cloudinary from './user.rout.js'
import bcrypt from 'bcrypt'
import jwt from'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
export const sellerRout=express.Router()


//sellerlogin
sellerRout.post('/login',async(req,res)=>{
    try {
        
         const user=await User.findOne({email:req.body.email}).lean()
         
         if(!user){
            return res.status(400).json({
                error:`this email is not registered`
            })
         }
         

         if(user.role!=='seller'){
            return res.status(400).json({
                message:`you are in the wrong login`
            })
         }

         
         const verifypass=await bcrypt.compare(req.body.password,user.password)
         if(!verifypass){
           return res.status(400).json({
                error:`you entered the wrong password`
            })
         }
         const token=await jwt.sign({
            id:user._id,
            userName:user.userName,
            email:user.email,
            phone:user.phone,
            role:user.role
         },process.env.JWT_SECRET)
         
         res.status(200).json({
              message:`you successfully logged in`,
              token:token,
              user:user
        })


     } catch (error) {
        res.status(500).json({
            ERROR:`ERROR IN LOGIN ROUT ERROR:${error}`
        })
    }
})


//seller/addproduct
sellerRout.post('/addProduct',chekLogin,async(req,res)=>{
     
     
    try{
  const verifyUser=await jwt.verify(req.headers.authorization.split(' ')[1],process.env.JWT_SECRET)
  const uploadedImg1=await cloudinary.uploader.upload(req.files.img1.tempFilePath)


   const product=new Product({
    productName:req.body.productName,
    img:{img1:{
        secure_url:uploadedImg1.secure_url,
        public_id:uploadedImg1.public_id
    }},
    price:req.body.price,
    materialType:req.body.materialType,
    color:req.body.color,
    sizesAvailable:req.body.sizesAvailable,
    soldBy:verifyUser.id,
    category:req.body.category
    
   })
  if(req.body.description){
    product.description=req.body.description
  }
  if (req.files?.img2) {
      const uploadedImg2 = await cloudinary.uploader.upload(req.files.img2.tempFilePath);
      product.img.img2 = {
        secure_url: uploadedImg2.secure_url,
        public_id: uploadedImg2.public_id
      };
    }

  if (req.files?.img3) {
      const uploadedImg3 = await cloudinary.uploader.upload(req.files.img3.tempFilePath);
      product.img.img3 = {
        secure_url: uploadedImg3.secure_url,
        public_id: uploadedImg3.public_id
      };
    }  

  if (req.files?.img4) {
      const uploadedImg4 = await cloudinary.uploader.upload(req.files.img4.tempFilePath);
      product.img.img4 = {
        secure_url: uploadedImg4.secure_url,
        public_id: uploadedImg4.public_id
      };
    }

    await product.save()
  res.status(200).json({
    product:product
  })



}catch(error){
    res.status(500).json({
        ERROR:`ERROR IN ADDPRODUCT ERROR:${error}`
    })
}


})

//seller/deleteproduct
sellerRout.delete('/deleteproduct/:productID',chekLogin,async(req,res)=>{
    try {
        const verifyUser=await jwt.verify(req.headers.authorization.split(' ')[1],process.env.JWT_SECRET)
        const product=await Product.findById(req.params.productID)
        if(product.soldBy.toString()!==verifyUser.id.toString()){
            return res.status(400).json({
                error:`you are not eligible to do any edits in this product`
            })
        }


       if (Array.isArray(product.img)) {
  for (const imgObj of product.img) {
    if (imgObj.img1?.public_id) {
      await cloudinary.uploader.destroy(imgObj.img1.public_id);
    }
    if (imgObj.img2?.public_id) {
      await cloudinary.uploader.destroy(imgObj.img2.public_id);
    }
    if (imgObj.img3?.public_id) {
      await cloudinary.uploader.destroy(imgObj.img3.public_id);
    }
    if (imgObj.img4?.public_id) {
      await cloudinary.uploader.destroy(imgObj.img4.public_id);
    }
  }
}
     const deletedproduct=await Product.findByIdAndDelete(req.params.productID)

     res.status(200).json({
        deletproduct:deletedproduct
     })
    } catch (error) {
        res.status(500).json({
            ERROR:`ERROR IN DELETE PRODUCT ERROR:${JSON.stringify(error)} `
        })
    }
})



//get products added
sellerRout.get('/myproducts',chekLogin,async(req,res)=>{
  try {
    const verifyUser=await jwt.verify(req.headers.authorization.split(' ')[1],process.env.JWT_SECRET)
     const products=await Product.find({soldBy:verifyUser.id})
     res.status(200).json({
      yourproducts:products
     })
  } catch (error) {
    res.status(500).json({
      ERROR:`ERROR IN GET /muproducts rout error:${error}`
    })
  }
})