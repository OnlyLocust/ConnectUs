import express from "express";
import {getMe, getUsers } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.js"

const router = express.Router();

router.get("/", protect, getMe);
router.get("/users", protect, getUsers);

export default router;