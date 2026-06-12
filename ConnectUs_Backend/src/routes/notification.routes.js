import express from "express";
import { createNotification, getNotifications } from "../controllers/notification.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getNotifications);
router.post("/send/:recvId", protect, createNotification);

export default router;