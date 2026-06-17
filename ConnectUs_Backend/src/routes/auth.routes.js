import express from "express";
import { signup } from "../controllers/auth/signup.js";
import { login } from "../controllers/auth/login.js";
import { logout } from "../controllers/auth/logout.js";
import { authLimiter } from "../middleware/rateLimiter.js";


const router = express.Router();


router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);
router.get("/logout", logout);


export default router;