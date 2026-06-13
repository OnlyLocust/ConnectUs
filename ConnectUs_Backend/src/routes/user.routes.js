import express from "express";
import {getFollowers, getFollowing, getMe, getSuggestions, getUsers ,updateProfile} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.js"
import upload from "../middleware/multer.js";

const router = express.Router();

router.get("/", protect, getMe);
router.get("/users", protect, getUsers);
router.get("/suggestions", protect, getSuggestions);
router.get("/followers/:userId", protect, getFollowers);
router.get("/following/:userId", protect, getFollowing);
router.patch("/profile",  protect,  upload.single("profilePicture"),  updateProfile);

export default router;
