import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const chekLogin=async(req,res,next)=>{
       try {
           const verifyUser=await jwt.verify(req.headers.authorization.split(' ')[1],process.env.JWT_SECRET)
           req.user = decoded;
           next()
       } catch (error) {
        return res.status(500).json({
            Error:`Error in checkLogin middleware ${error.message}`
        })
        
       }
}