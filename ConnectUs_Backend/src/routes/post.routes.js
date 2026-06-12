import express from "express";
import { getPosts, toggleBookmark } from "../controllers/post.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/getall", protect, getPosts);
router.patch("/bookmark/:postId",  protect, toggleBookmark);

export default router;