import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
   conversationId: 
    {
        type: mongoose.Schema.ObjectId,
        ref: "conversations",
    },
    senderId: 
    {
        type: mongoose.Schema.ObjectId,
        ref: "users",
    },
    text: {
        type: String,
        required: true,
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
