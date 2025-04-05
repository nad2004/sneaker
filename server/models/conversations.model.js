import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
    {
   members: [
    {
        type: mongoose.Schema.ObjectId,
        ref: "users",
    }
   ],
   messages: [
    { 
        text: {
            type: String,
        },
        sender: {
            type: String,
            enum: ["user", "admin"],
            required: true,
        },
    }
    ],
    read: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true
});


const ConversationModel = mongoose.model("conversations", conversationSchema);

export default ConversationModel;
