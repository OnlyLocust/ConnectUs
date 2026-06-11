import express from "express";

import { signup , logout, login } from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/", async (req, res) => {
  res.status(200).json({ message: "Fetch all users" });
});

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);


export default router;