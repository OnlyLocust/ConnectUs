import express from "express";
import {getMe, getSuggestions, getUsers } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.js"

const router = express.Router();

router.get("/", protect, getMe);
router.get("/users", protect, getUsers);
router.get("/suggestions", protect, getSuggestions);

export default router;