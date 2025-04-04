import { Router } from 'express'
import auth from '../middleware/auth.js'
import { createNewOrderController, generateInvoicePDF, exportExcelOrder, updateOrderStatus, updateOrderDetails, deleteOrderDetails, getOrderListController, getOrderDetails, getOrderDetailsbyUserController, getOrderController} from '../controllers/order.controller.js'

const orderRouter = Router()
orderRouter.post("/get-order-details",getOrderDetails)
orderRouter.post("/create",auth,createNewOrderController)
orderRouter.post("/order-list",auth,getOrderDetailsbyUserController)
orderRouter.post("/get",getOrderController)
orderRouter.get("/get-order-list",getOrderListController)
orderRouter.get("/export-excel",exportExcelOrder)
orderRouter.post("/export-invoice",generateInvoicePDF)
orderRouter.delete("/delete",auth,deleteOrderDetails)
orderRouter.put('/update-order-details',auth,updateOrderDetails)
orderRouter.put('/update-order-status',auth,updateOrderStatus)
export default orderRouter