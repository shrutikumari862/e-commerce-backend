import express from 'express'
import bcrypt from 'bcrypt'
import dotenv  from 'dotenv'
import jwt from 'jsonwebtoken'
dotenv.config()
import { User } from '../models/user.model.js'
import { Cart } from '../models/cart.model.js'
import { Product } from '../models/product.model.js'
import cloudinary from 'cloudinary'
import { chekLogin } from '../middlewares/checkLogin.middleware.js'

 cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
export default cloudinary;

export const userRouter=express.Router()
////user signup rout
userRouter.post('/signup',async(req,res)=>{
    try {
       const existingEmail=await User.findOne({email:req.body.email})
       if(existingEmail){
        return res.status(400).json({
            error:`this email is already registered`
        })
       }


       const hashedPassword=await bcrypt.hash(req.body.password,10)



       const user=new User({
         userName:req.body.userName,
         phone:req.body.phone,
         email:req.body.email,
         password:hashedPassword,
         address:req.body.address,
         role:req.body.role,
         
         
         
       })
       if(req.files && req.files.profile){
       const profile=await cloudinary.uploader.upload(req.files.profile.tempFilePath)
       user.profilepic={
                secure_url:profile.secure_url,
                public_id:profile.public_id
            }
       console.log(profile)
       }
        
        await user.save()



        res.status(200).json({
            NEWUSER:user,
            
    })
    } catch (error) {
        res.status(500).json({
            ERROR:`error in signup rout error:${error}`
        })
    }
})

////userlogin
userRouter.post('/login',async(req,res)=>{
    try {
        
         const user=await User.findOne({email:req.body.email}).lean()
         
         if(!user){
            return res.status(400).json({
                error:`this email is not registered`
            })
         }
         

         if(user.role!=='customer'){
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

////delete user
userRouter.delete('/delete/:userID',chekLogin,async(req,res)=>{
      try{
        const verifyUser=await jwt.verify(req.headers.authorization.split(' ')[1],process.env.JWT_SECRET)
        if(verifyUser.id !== req.params.userID){
             return res.status(400).json({
                message:`you are not eligible to delete this user`
             })
        }
        const user=await User.findById(req.params.userID)
        if(user.profilepic && user.profilepic.public_id){
            await cloudinary.uploader.destroy(user.profilepic.public_id)
        }
        const deletedUser=await User.findByIdAndDelete(req.params.userID)
        res.status(200).json({
            delUser:deletedUser
        })


      }catch(error){
        res.status(500).json({
            ERROR:`ERROR IN DELETE USER ROUT ${error}`
        })
      }
})


userRouter.post('/addToCart/:productID',chekLogin,async(req,res)=>{
    try {
         const verifyUser=await jwt.verify(req.headers.authorization.split(' ')[1],process.env.JWT_SECRET)
         


         const cart=new Cart({
            userId:verifyUser.id,
            products:{
                productId:req.params.productID,
                
            }
         })
         if(req.body?.quantity){
             cart.products.quantity=req.body.quantity
         }
         await cart.save()
         res.status(200).json({
            productaddedtocart:cart
         })

    } catch (error) {
       res.status(500).json({
        ERROR:`ERROR IN ADDTOCART ERROR:${error}`
       }) 
    }
})


//get all products
userRouter.get('/products',async(req,res)=>{
    try{const products=await Product.find()
    res.status(200).json({
        products:products
    })}catch(error){
        res.status(500).json({
            Error:`error in /prducts GET rout error:${error}`
        })
    }
})

userRouter.get('/product/:productId',async(req,res)=>{
    try {
        const product=await Product.findById(req.params.productId).populate('soldBy')
        res.status(200).json({
            product:product
        })
    } catch (error) {
        res.status(500).json({
            ERROR:`ERROR IN /PRODUCT ROUT ${error}`
        })
    }
})



userRouter.get('/getItemsInCart',chekLogin,async(req,res)=>{
        try {
            const verifyUser=await jwt.verify(req.headers.authorization.split(' ')[1],process.env.JWT_SECRET)
            const product=await Cart.find({userId:verifyUser.id}).populate('products.productId')
            res.status(200).json({
                yourCart:product
            })

        } catch (error) {
            res.status(500).json({
                ERROR:`ERROR IN GETITEMSINCART error:${error}`
            })
        }
})