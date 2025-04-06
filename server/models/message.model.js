import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
    conversation: {
        type: mongoose.Schema.ObjectId,
        ref: "conversations",
        required: true,
    },
    sender: {
        type: String,
        enum: ["user", "admin"],
        required: true,
    },
    text: {
        type: String,
    },
    read: {
        type: Boolean,
        default: false,
    }, 
}, {
    timestamps: true
});


const MessageModel = mongoose.model("messages", messageSchema);

export default MessageModel;
