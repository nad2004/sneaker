import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Provide name"]
    },
    email: {
        type: String,
        required: [true, "Provide email"],
        unique: true
    },
    password: {
        type: String,
        required: function () {
            return !this.googleId; 
          },
    },
    avatar: {
        type: String,
        default: ""
    },
    mobile: {
        type: String,
        default: ""
    },
    refresh_token: {
        type: String,
        default: ""
    },
    verify_email: {
        type: Boolean,
        default: false
    },
    otp: { // 🔹 Mã OTP dùng để xác minh email
        type: String,
        default: null
    },
    otpExpiry: { // 🔹 Thời gian hết hạn của OTP
        type: Date,
        default: null
    },
    last_login_date: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active"
    },
    address_details: {
        type: String,
        default: ""
    },
    shopping_cart: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "cartproducts"
        }
    ],  
    orderHistory: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "orders"
        }
    ],
    forgot_password_otp: {
        type: String,
        default: null
    },
    forgot_password_expiry: {
        type: Date,
        default: null
    },
    role: {
        type: String,
        enum: ["ADMIN", "CUSTOMER", "STAFF"],
        default: "CUSTOMER"
    },
    publish : {
        type: Boolean,
        default: true
    },
    googleId: {
        type: String,
        default: null,
        unique: true,
    }
}, {
    timestamps: true
});

const UserModel = mongoose.model("users", userSchema);

export default UserModel;
