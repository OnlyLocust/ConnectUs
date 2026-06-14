import express from "express";
import { toggleFollow } from "../controllers/follow.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.patch("/:id", protect, toggleFollow);

export default router;