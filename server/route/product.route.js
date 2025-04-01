import { Router } from 'express'
import auth from '../middleware/auth.js'
import { createProductController,  getProductsByCategories, deleteProductDetails, getProductByCategory, getProductController, getProductDetails, searchProduct, updateProductDetails } from '../controllers/product.controller.js'
import { admin } from '../middleware/Admin.js'

const productRouter = Router()
productRouter.post('/get',getProductController)

productRouter.post("/create",auth,admin,createProductController)
productRouter.post('/get',getProductController)
productRouter.post("/get-product-by-category",getProductByCategory)
productRouter.post('/get-product-details',getProductDetails)
productRouter.post('/get-product-by-categories',getProductsByCategories)
//update product
productRouter.put('/update-product-details',auth,admin,updateProductDetails)

//delete product
productRouter.delete('/delete',auth,admin,deleteProductDetails)

//search product 
productRouter.post('/search-product',searchProduct)

export default productRouter