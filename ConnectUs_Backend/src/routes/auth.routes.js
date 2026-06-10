import express from "express";

import { signup } from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/", async (req, res) => {
  res.status(200).json({ message: "Fetch all users" });
});

router.post("/signup", signup);

export default router;