import express from "express";
import {getFollowers, getFollowing, getMe, getShortProfile, getSuggestions, getUserProfile, getUsers ,updateProfile} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.js"
import upload from "../middleware/multer.js";

const router = express.Router();

router.get("/", protect, getMe);
router.get("/users", protect, getUsers);
router.get("/suggestions", protect, getSuggestions);
router.get("/followers/:userId", protect, getFollowers);
router.get("/following/:userId", protect, getFollowing);
router.patch("/profile",  protect,  upload.single("profilePicture"),  updateProfile);
router.get("/get/:id", protect, getUserProfile);
router.get("/profile", protect, getShortProfile);

export default router;
