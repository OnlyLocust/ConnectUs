import express from "express";
import { getMessages, addChat } from "../controllers/chat.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/:recvId", protect, getMessages);
router.post("/addchat", protect, addChat);

export default router;