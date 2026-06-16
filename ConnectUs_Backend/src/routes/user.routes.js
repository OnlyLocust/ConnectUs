import express from "express";
import { protect } from "../middleware/auth.js"
import upload from "../middleware/multer.js";

import {getMe} from "../controllers/user/getMe.js"
import {getUsers} from "../controllers/user/getUsers.js"
import {getSuggestions} from "../controllers/user/getSuggestions.js"
import {updateProfile} from "../controllers/user/updateProfile.js"
import {getUserProfile} from "../controllers/user/getUserProfile.js"
import {getShortProfile} from "../controllers/user/getShortProfile.js"
import {getFollowers,getFollowing} from "../controllers/user/getFollowData.js"

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
