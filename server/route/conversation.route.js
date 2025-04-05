import { Router } from 'express'
import {getConversationDetail, getUserConversations, updateConversationsMessage } from "../controllers/conversation.controller.js";
import { admin } from '../middleware/Admin.js';
const conversationRouter = Router()

conversationRouter.post('/getconversationdetail',getConversationDetail)
conversationRouter.post('/getuserconversations',admin,getUserConversations)
conversationRouter.put('/updatemessage',updateConversationsMessage)
export default conversationRouter