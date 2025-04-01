import { Router } from "express";
import auth from "../middleware/auth.js";
import {createQRCode, createCollectionLink, generateQRVNPay, handleVnpayReturn} from "../controllers/payment.controller.js"
const paymentRouter = Router();

paymentRouter.post('/qr-link', createCollectionLink)
paymentRouter.post('/momo-qr', createQRCode)
paymentRouter.post('/vnpay-qr', generateQRVNPay)
paymentRouter.get('/vnpay-return', handleVnpayReturn)
export default paymentRouter