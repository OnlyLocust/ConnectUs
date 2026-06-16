import express from "express";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/multer.js";

import { getPosts } from "../controllers/post/getPosts.js";
import { getPost } from "../controllers/post/getPost.js";
import { toggleBookmark } from "../controllers/post/toggleBookmark.js";
import { getHomePosts } from "../controllers/post/getHomePosts.js";
import { addComment } from "../controllers/post/addComment.js";
import { likeUnlikePost } from "../controllers/post/likeUnlikePost.js";
import { deletePost } from "../controllers/post/deletePost.js";
import { createPost } from "../controllers/post/createPost.js";

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