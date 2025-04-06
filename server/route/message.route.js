import { Router } from 'express'
import {createMessage, markMessagesAsRead} from '../controllers/message.controller.js'

const messageRouter = Router()
messageRouter.post("/create", createMessage)
messageRouter.post("/mark-read", markMessagesAsRead)
export default messageRouter