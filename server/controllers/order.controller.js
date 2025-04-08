import ProductModel from "../models/product.model.js";
import CartProductModel from "../models/cartproduct.model.js";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import ExcelJS from "exceljs";
import { fileURLToPath } from "url";
import PDFDocument from "pdfkit";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export async function createNewOrderController(request, response) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { userId, products, totalAmt, payment_method, delivery_address } = request.body;

        if (!userId || !products || products.length === 0) {
            return response.status(400).json({
                message: "Missing userId or products in the order.",
                error: true,
                success: false,
            });
        }

        // Đặt trạng thái thanh toán ban đầu
        let payment_status = "Pending";
        if (payment_method === "USING DEBIT CARD") {
            payment_status = "Pending"; // Đợi xác nhận từ VNPay
        } else {
            payment_status = "Success"; // COD chẳng hạn
        }

        const orderPayload = {
            userId,
            orderId: `ORD-${Date.now()}`,
            products,
            payment_method,
            payment_status,
            delivery_status: "OrderMade",
            delivery_address: delivery_address || "",
            subTotalAmt: totalAmt,
            totalAmt,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 2 * 60 * 1000), // Tự huỷ sau 2 phút
        };

        const createdOrder = await OrderModel.create([orderPayload], { session });
        const orderId = createdOrder[0]._id;

        // Trừ tồn kho
        for (let item of products) {
            await ProductModel.findByIdAndUpdate(
                item.productId,
                { $inc: { stock: -item.quantity } },
                { session }
            );
        }

        // Xoá giỏ hàng
        await CartProductModel.deleteMany({ userId }, { session });
        await UserModel.updateOne({ _id: userId }, { shopping_cart: [] }, { session });
        await UserModel.updateOne({ _id: userId }, { $push: { orderHistory: orderId } }, { session });

        await session.commitTransaction();
        session.endSession();

        return response.status(201).json({
            message: "Order created successfully",
            error: false,
            success: true,
            data: createdOrder,
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return response.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false,
        });
    }
}

export async function getOrderDetailsbyUserController(request, response) {
    try {
        const {userId} = request.body;
        const orderList = await OrderModel.find({ userId: userId })
            .sort({ createdAt: -1 })
            .populate("products.productId");

        if (!orderList || orderList.length === 0) {
            return response.status(404).json({
                message: "No orders found for this user.",
                data: [],
                error: false,
                success: true
            });
        }

        return response.json({
            message: "Order list retrieved successfully",
            data: orderList,
            error: false,
            success: true
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
}

export const getOrderController = async(request,response)=>{
    try {
        
        let { page, limit, search } = request.body 

        if(!page){
            page = 1
        }

        if(!limit){
            limit = 10
        }

        const query = search ? {
            $text : {
                $search : search
            }
        } : {}

        const skip = (page - 1) * limit

        const [data,totalCount] = await Promise.all([
            OrderModel.find(query).sort({createdAt : -1 }).skip(skip).limit(limit),
            OrderModel.countDocuments(query)
        ])

        return response.json({
            message : "Order data",
            error : false,
            success : true,
            totalCount : totalCount,
            totalNoPage : Math.ceil( totalCount / limit),
            data : data
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const getOrderDetails = async(request,response)=>{
    try {
        const { id } = request.body 

        const order = await OrderModel.findOne({ _id : id }).populate('products.productId')


        return response.json({
            message : "Order details",
            data : order,
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}
export const getOrderListController = async (request, response) => {
    try {
        const [data, totalCount] = await Promise.all([
            OrderModel.find().sort({ createdAt: -1 }), // Lấy danh sách order, sắp xếp giảm dần theo ngày tạo
            OrderModel.countDocuments()          // Đếm tổng số đơn hàng (Nhưng `query` chưa định nghĩa!)
        ]);

        return response.json({
            message: "Order data",
            error: false,
            success: true,
            data: data
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};
export const deleteOrderDetails = async (request, response) => {
    const session = await OrderModel.startSession(); // Khởi tạo session
    session.startTransaction(); // Bắt đầu transaction

    try {
        const { _id } = request.body;

        if (!_id) {
            return response.status(400).json({
                message: "Provide _id",
                error: true,
                success: false
            });
        }

        const order = await OrderModel.findOne({ _id }).session(session);
         
        if (!order) {
            await session.abortTransaction(); // Hủy transaction nếu không tìm thấy đơn hàng
            session.endSession();
            return response.status(404).json({
                message: "Order not found",
                error: true,
                success: false
            });
        }

        // Cập nhật lại stock cho từng sản phẩm trong đơn hàng
        for (let item of order.products) {
            await OrderModel.findByIdAndUpdate(
                item.productId,
                { $inc: { stock: +item.quantity } },
                { session }
            );
        }
    
        // Xóa đơn hàng
        const deleteOrder = await OrderModel.deleteOne({ _id }).session(session);

        // Commit transaction
        await session.commitTransaction();
        session.endSession();

        return response.json({
            message: "Delete successfully",
            error: false,
            success: true,
            data: deleteOrder
        });
    } catch (error) {
        await session.abortTransaction(); // Hủy transaction nếu có lỗi
        session.endSession();
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

export const updateOrderDetails = async(request,response)=>{
    try {
        const { id } = request.body;

        if(!id){
            return response.status(400).json({
                message : "provide Order id",
                error : true,
                success : false
            })
        }

        const updateOrder = await OrderModel.updateOne({ _id : id },{
            ...request.body
        })

        return response.json({
            message : "updated successfully",
            data : updateOrder,
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}
export const updateOrderStatus = async (request, response) => {
    try {
        const { id, delivery_status, payment_status } = request.body;

        if (!id) {
            return response.status(400).json({
                message: "Provide Order ID",
                error: true,
                success: false
            });
        }

        if (delivery_status && !["OrderMade", "OrderPaid", "Shipped", "Complete"].includes(delivery_status)) {
            return response.status(400).json({
                message: "Invalid delivery status",
                error: true,
                success: false,
            });
        }

        if (payment_status && !["Pending", "Success"].includes(payment_status)) {
            return response.status(400).json({
                message: "Invalid payment status", // ✅ Đã sửa lại đúng lỗi
                error: true,
                success: false,
            });
        }

        // Kiểm tra xem đơn hàng có tồn tại không
        const existingOrder = await OrderModel.findById(id);
        if (!existingOrder) {
            return response.status(404).json({
                message: "Order not found",
                error: true,
                success: false,
            });
        }

        // Chỉ cập nhật các trường được phép
        const updateFields = {};
        if (delivery_status) updateFields.delivery_status = delivery_status;
        if (payment_status) updateFields.payment_status = payment_status;

        const updateOrder = await OrderModel.findByIdAndUpdate(
            id,
            { $set: updateFields }, // ✅ Chỉ cập nhật trường hợp lệ
            { new: true } // ✅ Trả về bản ghi mới sau khi cập nhật
        );

        return response.json({
            message: "Order updated successfully",
            data: updateOrder, // ✅ Trả về thông tin đơn hàng mới nhất
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
};

export const exportExcelOrder = async (req, res) => {
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Orders");

        // Lấy danh sách order
        const orders = await OrderModel.find().sort({ createdAt: -1 }).populate('products.productId userId');

        // Định nghĩa tiêu đề cột
        worksheet.columns = [
            { header: "Order ID", key: "orderId", width: 25 },
            { header: "User Name", key: "userName", width: 25 },
            { header: "Total Amount", key: "totalAmount", width: 15 },
            { header: "Payment Method", key: "payment_method", width: 20 },
            { header: "Payment Status", key: "payment_status", width: 15 },
            { header: "Delivery Status", key: "delivery_status", width: 15 },
            { header: "Created At", key: "createdAt", width: 25 },
            { header: "Products", key: "products", width: 100 },
        ];

        // Thêm dữ liệu vào Excel
        orders.forEach((order) => {
            worksheet.addRow({
                orderId: order.orderId,
                userName: order.userId?.name || "Unknown",
                totalAmount: order.totalAmt,
                payment_method: order.payment_method,
                payment_status: order.payment_status,
                delivery_status: order.delivery_status,
                createdAt: order.createdAt,
                products: order.products.map(p => `(${p.productId.name}, Qty: ${p.quantity}, Size: ${p.size})`).join(" | ")
            });
        });

        // Ghi file Excel ra bộ nhớ
        const filePath = path.join(__dirname, "orders.xlsx");
        await workbook.xlsx.writeFile(filePath);

        // Gửi file về client
        res.download(filePath, "orders.xlsx", (err) => {
            if (err) {
                console.error("Lỗi tải file:", err);
                res.status(500).send("Lỗi tải file");
            }
            fs.unlinkSync(filePath); // Xóa file sau khi gửi
        });

    } catch (err) {
        console.error("Lỗi xuất Excel:", err);
        res.status(500).json({ error: "Lỗi hệ thống" }); // ✅ Đúng

    }
}
export const generateInvoicePDF = async (req, res) => {
    try {
        const { orderId } = req.body;

        // Tìm đơn hàng theo orderId
        const order = await OrderModel.findOne({ _id: orderId }).populate("userId").populate("products.productId");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Tạo đường dẫn file PDF
       // Tạo đường dẫn file PDF trên hệ thống
       const invoicePath = path.join(__dirname, `invoice.pdf`);

       // Khởi tạo PDFKit
       const doc = new PDFDocument();

       // Ghi PDF vào file hệ thống
       doc.pipe(fs.createWriteStream(invoicePath));

        // Tiêu đề hóa đơn
        doc.fontSize(22).text("INVOICE", { align: "center" });
        doc.moveDown();

        // Thông tin khách hàng
        doc.fontSize(14).text(`Customer: ${order.userId.name || "N/A"}`);
        doc.text(`Email: ${order.userId.email || "N/A"}`);
        doc.text(`Address: ${order.delivery_address || "N/A"}`);
        doc.text(`Payment Method: ${order.payment_method}`);
        doc.text(`Payment Status: ${order.payment_status}`);
        doc.moveDown();

        // Thông tin sản phẩm
        doc.fontSize(16).text("Order Details:", { underline: true });
        order.products.forEach((item, index) => {
            doc.fontSize(12).text(
                `${index + 1}. ${item.productId.name || "Unknown Product"} - Size: ${item.size}, Quantity: ${item.quantity} x $${item.productId.price}`
            );
        });

        // Tổng tiền
        doc.moveDown();
        doc.fontSize(14).text(`Subtotal: ${order.subTotalAmt.toFixed(2)} đ `);
        doc.fontSize(14).text(`Total: ${order.totalAmt.toFixed(2)} đ `, { align: "right" });

        // Kết thúc PDF
        doc.end();
        doc.on("end", () => {
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment; filename="invoice.pdf"`);
            const fileStream = fs.createReadStream(invoicePath);
            fileStream.pipe(res); // Gửi PDF về client
        });
    } catch (error) {
        res.status(500).json({ message: "Error generating invoice", error: error.message });
    }
};