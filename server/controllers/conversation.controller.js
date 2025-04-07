import ConversationModel from "../models/conversations.model.js";

 export async function getConversationDetail(req , res){
    const { senderId } = req.body;
    const receiverId = "67ebaf8ff566e9b5e7312562";
  try {
    let conversation = await ConversationModel.findOne({
      members: { $all: [senderId, receiverId] },
    }).populate("messages", "-id -conversation");
    
    if (!conversation) {
      conversation = new ConversationModel({
        members: [senderId, receiverId],
      });
      await conversation.save();
    }
    res.status(200).json({
        data: conversation,
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
export async function getUserConversations(req , res){
    const  userId  = "67ebaf8ff566e9b5e7312562";
    try {
      const conversations = await ConversationModel.find({
        members: { $in: userId },
      })
        .populate({
          path: "members",
          select: "-password -__v",
        })
        .populate({
          path: "messages",
          select: "-id -conversation",
        });
        res.status(200).json({
            data: conversations,
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
export async function getConversations(req , res){
  const _id  = req.body;
  try {
    const conversations = await ConversationModel.findOne({
      _id: _id,
    })
      .populate({
        path: "members",
        select: "-password -__v",
      })
      .populate({
        path: "messages",
      });
      res.status(200).json({
          data: conversations,
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
export async function updateConversationsMessage(req , res){
  const  {MessageId, conversationId}  = req.body;

  try {
      const conversations = await ConversationModel.updateOne({_id: conversationId},
        { $push: { messages: MessageId } });
      res.status(200).json({
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