import express from "express";
import { addComment, getHomePosts, getPost, getPosts, toggleBookmark } from "../controllers/post.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/getall", protect, getPosts);
router.get("/get/:postId", protect, getPost);
router.patch("/bookmark/:postId",  protect, toggleBookmark);
router.get("/", protect, getHomePosts);
router.patch("/comment/:id", protect, addComment);

export default router;