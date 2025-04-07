import { Router } from 'express'
import {createMessage, deleteMessage, markMessagesAsRead} from '../controllers/message.controller.js'

const messageRouter = Router()
messageRouter.post("/create", createMessage);
messageRouter.post("/mark-read", markMessagesAsRead);
messageRouter.delete("/delete", deleteMessage);
export default messageRouter