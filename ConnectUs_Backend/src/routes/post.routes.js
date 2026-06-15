import express from "express";
import { addComment, createPost, deletePost, getHomePosts, getPost, getPosts, likeUnlikePost, toggleBookmark } from "../controllers/post.controller.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.get("/getall", protect, getPosts);
router.get("/get/:postId", protect, getPost);
router.patch("/bookmark/:postId",  protect, toggleBookmark);
router.get("/", protect, getHomePosts);
router.patch("/comment/:postId", protect, addComment);
router.patch("/like/:postId",  protect, likeUnlikePost);
router.delete("/:postId", protect, deletePost);
router.post("/add",protect, upload.single("image"), createPost);

export default router;