import { Router } from 'express'
import {getConversationDetail, getUserConversations, getConversations, updateConversationsMessage } from "../controllers/conversation.controller.js";
import { admin } from '../middleware/Admin.js';
const conversationRouter = Router()

conversationRouter.post('/getconversationdetail',getConversationDetail)
conversationRouter.post('/getuserconversations',admin,getUserConversations)
conversationRouter.put('/updatemessage',updateConversationsMessage)
conversationRouter.post('/getconversation',getConversations)
export default conversationRouter