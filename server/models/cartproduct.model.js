import mongoose from "mongoose";

const cartProductSchema = new mongoose.Schema({
    productId : {
        type : mongoose.Schema.ObjectId,
        ref : 'products'
    },
    quantity : {
        type : Number,
        default : 1
    },
    size : {
        type : Number,
        default : 40
    },
    userId : {
        type : mongoose.Schema.ObjectId,
        ref : "users"
    }
},{
    timestamps : true
})

const CartProductModel = mongoose.model('cartproducts',cartProductSchema)

export default CartProductModel