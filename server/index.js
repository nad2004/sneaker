import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import http from "http";
import connectDB from './config/connectDB.js'
import userRouter from './route/user.route.js'
import categoryRouter from './route/category.route.js'
import uploadRouter from './route/upload.router.js'
import productRouter from './route/product.route.js'
import cartRouter from './route/cart.route.js'
import orderRouter from './route/order.route.js'
import reviewRouter from './route/review.route.js'
import paymentRoute from './route/payment.route.js'
import chatRouter from './route/chat.route.js'
import conversationRouter from './route/conversation.route.js'
import handleMessage from './utils/message.js'
import messageRouter from './route/message.route.js'
import cron from "node-cron";
import cancelExpiredOrders from "./utils/cronJob.js";
const app = express()
const wsServer = http.createServer();

const allowedOrigins = [
  "http://localhost:5173",       // local dev
  "http://localhost:5174",       // local dev khác
  "https://sneaker-omega.vercel.app" // frontend deploy
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Cho phép request không có origin (Postman, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // cho phép cookie, Authorization header
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Cho phép preflight request (OPTIONS)
app.options("*", cors());

app.use(express.json())
app.use(cookieParser())
app.use(morgan())
app.use(helmet({
    crossOriginResourcePolicy : false
}))

const PORT = 8080
app.get("/",(request,response)=>{
    response.json({
        message : "Server is running " + PORT
    })
})

app.use('/api/user',userRouter)
app.use("/api/category",categoryRouter)
app.use("/api/file",uploadRouter)
app.use("/api/product",productRouter)
app.use("/api/cart",cartRouter)
app.use('/api/order',orderRouter)
app.use('/api/review',reviewRouter)
app.use('/api/payment',paymentRoute)
app.use('/api/chat',chatRouter)
app.use('/api/conversation',conversationRouter)
app.use('/api/message',messageRouter)
cron.schedule("* * * * *", async () => {
    console.log("⏳ Đang kiểm tra đơn hàng hết hạn...");
    await cancelExpiredOrders();
})
connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("Server is running",PORT)
    })
})
handleMessage(wsServer);
wsServer.listen(8081, () => console.log("WebSocket server running on 8081"));
