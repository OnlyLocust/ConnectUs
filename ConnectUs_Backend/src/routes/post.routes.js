import express from "express";
import { getPost, getPosts, toggleBookmark } from "../controllers/post.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/getall", protect, getPosts);
router.get("/get/:postId", protect, getPost);
router.patch("/bookmark/:postId",  protect, toggleBookmark);

export default router;