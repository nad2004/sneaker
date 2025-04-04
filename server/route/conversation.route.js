import { Router } from 'express'
import {getConversationDetail, getUserConversations } from "../controllers/conversation.controller.js";
import { admin } from '../middleware/Admin.js';
const conversationRouter = Router()

conversationRouter.post('/getconversationdetail',getConversationDetail)
conversationRouter.post('/getuserconversations',admin,getUserConversations)

export default conversationRouter