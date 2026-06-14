import express from "express";
import { getMessages, addChat ,chatUsers, sendMessage} from "../controllers/chat.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/get/:recvId", protect, getMessages);
router.post("/addchat", protect, addChat);
router.get("/chatusers", protect, chatUsers);
router.post("/send/:id", protect, sendMessage);

export default router;