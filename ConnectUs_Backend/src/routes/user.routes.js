import express from "express";
import { getMe } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.js"

const router = express.Router();

router.get("/", protect, getMe);

export default router;