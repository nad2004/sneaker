import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "users",
    },
    orderId: {
      type: String,
      required: [true, "Provide orderId"],
      unique: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.ObjectId,
          ref: "products",
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        size: {
          type: Number,
          required: true,
        },
      },
    ],
    delivery_address: {
      type: String,
      default: "",
    },
    payment_status: {
      type: String,
      enum: ["Pending", "Success"],
      default: "Pending",
    },
    payment_method: {
      type: String,
      enum: ["CASH ON DELIVERY", "USING DEBIT CARD"], // Only allows these values
      required: true,
    },
    delivery_status: {
      type: String,
      enum: ["OrderMade", "OrderPaid", "Shipped", "Complete"], // Only allows these values
      default: "OrderMade",
    },
    subTotalAmt: {
      type: Number,
      default: 0,
    },
    totalAmt: {
      type: Number,
      default: 0,
    },
    publish: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 2 * 60 * 1000), // +2 phút kể từ khi tạo
    },
  },
  {
    timestamps: true,
  }
);

const OrderModel = mongoose.model("orders", orderSchema);

export default OrderModel;
