import { Router } from 'express'
import auth from '../middleware/auth.js'
import { getCategoryDetails, createCategoryController, AddCategoryController, deleteCategoryController, getCategoryController, updateCategoryController } from '../controllers/category.controller.js'

const categoryRouter = Router()

categoryRouter.post("/add-category",auth,AddCategoryController)
categoryRouter.post('/get',getCategoryController)
categoryRouter.post('/get-category-details',getCategoryDetails)
categoryRouter.put('/update-category-details',auth,updateCategoryController)
categoryRouter.post("/create",auth,createCategoryController)
categoryRouter.delete("/delete",auth,deleteCategoryController)

export default categoryRouter