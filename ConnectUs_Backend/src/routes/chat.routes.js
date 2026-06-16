import express from "express";
import { protect } from "../middleware/auth.js";

import {getMessages} from "../controllers/chat/getMessages.js"
import {addChat} from "../controllers/chat/addChat.js"
import {chatUsers} from "../controllers/chat/chatUsers.js"
import {sendMessage} from "../controllers/chat/sendMessage.js"
import {markChatAsRead} from "../controllers/chat/markChatAsRead.js"

const router = express.Router();

router.get("/get/:recvId", protect, getMessages);
router.post("/addchat", protect, addChat);
router.get("/chatusers", protect, chatUsers);
router.post("/send/:id", protect, sendMessage);
router.patch("/notread/:id", protect, markChatAsRead);

export default router;