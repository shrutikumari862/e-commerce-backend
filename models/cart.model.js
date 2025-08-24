import mongoose from 'mongoose'
import { User } from './user.model.js'
import { Product } from './product.model.js'
import { Schema } from 'mongoose'

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min:1
        },
      },
    ],
  },
  { timestamps: true }
)


export const Cart=mongoose.model("Cart",cartSchema)