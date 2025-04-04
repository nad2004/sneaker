import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name : {
        type : String,
        default : ""
    },
    image : {
        type : String,
        default : ""
    },
    publish : {
        type : Boolean,
        default : true
    }

},{
    timestamps : true
})

const CategoryModel = mongoose.model('categories',categorySchema)

export default CategoryModel