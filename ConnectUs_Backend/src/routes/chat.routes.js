import express from "express";
import { getMessages } from "../controllers/chat.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/:recvId", protect, getMessages);

export default router;