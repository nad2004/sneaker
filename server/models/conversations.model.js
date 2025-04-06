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
        type: mongoose.Schema.ObjectId,
        ref: "messages",
    }
    ],
}, {
    timestamps: true
});


const ConversationModel = mongoose.model("conversations", conversationSchema);

export default ConversationModel;
