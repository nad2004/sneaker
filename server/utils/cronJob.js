// cronJob.js
import OrderModel from "../models/order.model.js";

async function cancelExpiredOrders() {
    const now = new Date();

    const expiredOrders = await OrderModel.find({
        payment_status: "Pending",
        expiresAt: { $lte: now }
    });

    for (let order of expiredOrders) {
        await OrderModel.findByIdAndDelete(order._id);

        // (Tuỳ chọn) Cộng lại stock
        for (let item of order.products) {
            await ProductModel.findByIdAndUpdate(
                item.productId,
                { $inc: { stock: item.quantity } }
            );
        }

        console.log(`Đã huỷ đơn hàng hết hạn: ${order._id}`);
    }
}

export default cancelExpiredOrders;
