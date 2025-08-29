import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import fileUpload from 'express-fileupload';
import { userRouter } from './routes/user.rout.js';
import { sellerRout } from './routes/seller.rout.js';
dotenv.config()
const app = express();

async function connectToMondoDB(){
    try {
        await mongoose.connect(process.env.MONGO_DB_URI)
        console.log(`connection to db successful!!`)
    } catch (error) {
        console.log(`error in connection to db ${error}`)
    }
}
connectToMondoDB()
app.use(cors())
app.use(express.json())
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

app.use('/user',userRouter)
app.use('/seller',sellerRout)
app.post('/hello',(req,res)=>{
    res.send("server is ready")
})











app.listen(process.env.PORT,()=>{
    console.log(`you server is running on port:${process.env.PORT}`)
})