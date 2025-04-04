import { Router } from 'express'
import {getMessages, getMessagesByConversationId } from "../controllers/message.controller.js";

const messageRouter = Router()

messageRouter.post('/get-messages',getMessages)
messageRouter.post('/get-messages-by-conversationId',getMessagesByConversationId)

export default messageRouter