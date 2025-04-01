import { Router } from 'express'
import {generateText} from "../controllers/chatbot.controller.js"
const chatRouter = Router()

chatRouter.post('', generateText)

export default chatRouter