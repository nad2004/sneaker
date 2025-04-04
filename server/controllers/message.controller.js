import MessageModel from "../models/message.model.js";

export async function getMessages(req, res) {
const { conversationId, senderId, text } = req.body;
const newMessage = new MessageModel({
    conversationId,
    senderId,
    text,
  });
  try {
    const savedMessage = await newMessage.save();
    res.status(200).json({
        data: savedMessage,
        error : false,
        success : true
    });
  } catch (err) {
    res.status(500).json({
        data: err,
        error : true,
        success : false
    });
  }
}
export async function getMessagesByConversationId(req, res) {
    const { conversationId } = req.body;
    try {
        const messages = await MessageModel.find({
          conversationId: conversationId,
        });
        res.status(200).json({
            data: messages,
            error : false,
            success : true
        });
      } catch (err) {
        res.status(500).json({
            data: err,
            error : true,
            success : false
        });
      }
}