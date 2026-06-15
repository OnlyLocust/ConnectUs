import express from "express";
import { addComment, getHomePosts, getPost, getPosts, likeUnlikePost, toggleBookmark } from "../controllers/post.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/getall", protect, getPosts);
router.get("/get/:postId", protect, getPost);
router.patch("/bookmark/:postId",  protect, toggleBookmark);
router.get("/", protect, getHomePosts);
router.patch("/comment/:postId", protect, addComment);
router.patch("/like/:postId",  protect, likeUnlikePost);

export default router;