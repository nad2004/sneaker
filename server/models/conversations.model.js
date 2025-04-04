import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
   members: [
    {
        type: mongoose.Schema.ObjectId,
        ref: "users",
    }
   ],
}, {
    timestamps: true
});

const ConversationModel = mongoose.model("conversations", conversationSchema);

export default ConversationModel;
