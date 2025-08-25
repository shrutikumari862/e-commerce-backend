import mongoose from 'mongoose'
import { Schema } from 'mongoose'

const productSchema=new Schema({
    productName:{
        type:String,
        required:true
    },
    img:{
        img1:{
             secure_url:{
                type:String,
                required:true
             },
             public_id:{
                type:String,
                required:true
             },
             
        },
        img2:{
             secure_url:{
                type:String,
                
             },
             public_id:{
                type:String,
                
             },
             
        },
        img3:{
             secure_url:{
                type:String,
                
                
             },
             public_id:{
                type:String,
                
             },
             
        },
        img4:{
             secure_url:{
                type:String,
                
             },
             public_id:{
                type:String,
                
             },
             
        }
    },
    price:{
        type:String,
        required:true
    },
    materialType:{
        type:String,
        required:true
    },
    color:{
        type:String,
        required:true
    },
    sizesAvailable: [{
  type: String,
  enum: ["S", "M", "L"]
   }],
    description:{
        type:String,
        
    },
    soldBy:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    category:{
        type:String,
        enum:['Men','Women','Kid'],
        required:true
    }
},{timestamps:true})




export const Product=mongoose.model("Product",productSchema)