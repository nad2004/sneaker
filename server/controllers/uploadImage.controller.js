import uploadImageClodinary from "../utils/uploadImageClodinary.js"
import mongoose from "mongoose";
import Product from "../models/product.model.js"; 
const uploadImageController = async(request,response)=>{
    try {
        const file = request.file
        const { productId } = request.body;
        
        if (!productId) {
            return response.status(400).json({ message: "Missing productId", error: true, success: false, id: productId });
        }
       
        const uploadImage = await uploadImageClodinary(file)
        
        const updatedProduct = await Product.findByIdAndUpdate(
            new mongoose.Types.ObjectId(productId), // ✅ Cách đúng
            { $push: { image: uploadImage.secure_url } },
            { new: true }
        );
     
        return response.json({
            message : "Upload done",
            data : uploadImage,
            success : true,
            error : false
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export default uploadImageController