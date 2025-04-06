import MessageModel from "../models/message.model.js";
import ConversationModel from "../models/conversations.model.js";
 export async function createMessage(req , res){
    const { sender, conversation, text } = req.body;
  try {
    const message = new MessageModel({
        conversation,
        sender,
        text,
      });
      await message.save();

      // 2. Thêm message ID vào conversation
      await ConversationModel.findByIdAndUpdate(
        conversation,
        { $push: { messages: message._id } }
      );
    res.status(200).json({
        data: message,
        error : false,
        success : true
    });
  } catch (err) {
    res.status(500).json({
        data: err.message,
        error : true,
        success : false
    });
  }
}
export const markMessagesAsRead = async (req, res) => {
    const { conversationId, reader } = req.body;
    try {
      await MessageModel.updateMany(
        {
          conversation: conversationId,
          sender: { $ne: reader }, // Chỉ đánh dấu những tin nhắn KHÔNG phải do người đang đọc gửi
          read: false
        },
        { $set: { read: true } }
      );
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
