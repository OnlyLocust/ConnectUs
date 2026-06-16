import express from "express";
import { protect } from "../middleware/auth.js";
import {getNotifications} from "../controllers/notification/getNotifications.js"
import {createNotification} from "../controllers/notification/createNotification.js"
import {resetNotifications} from "../controllers/notification/resetNotifications.js"
const router = express.Router();

router.get("/", protect, getNotifications);
router.post("/send/:recvId", protect, createNotification);
router.patch("/reset",  protect,  resetNotifications);

export default router;