import mongoose from "mongoose";
import { Schema } from "mongoose";


const userSchema=new Schema({
       userName:{
        type:String,
        required:true
        },
        email:{
            type:String,
            required:true,
            unique: true
        },
        phone:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        address:[{
            label:{
                type:String,
                enum:["Home","Shop","Office","Others"],
                required:true
            },
            country:{
                type:String,
                required:true
            },
            city:{
                type:String,
                required:true
            },
            state:{
                type:String,
                required:true
            },
            street:{
                type:String,
                required:true
            },

        }],
        role:{
            type:String,
            enum:["customer","seller","delivery man"],
            required:true
        },
        profilepic:{
            secure_url:{type:String},
            public_id:{type:String}

        }
},{timestamps:true})




export const User=mongoose.model("User",userSchema)