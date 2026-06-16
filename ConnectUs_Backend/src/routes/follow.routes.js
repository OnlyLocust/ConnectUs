import express from "express";
import { protect } from "../middleware/auth.js";

import { toggleFollow } from "../controllers/follow/toggleFollow.js";

const router = express.Router();

router.patch("/:id", protect, toggleFollow);

export default router;