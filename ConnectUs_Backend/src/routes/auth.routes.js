import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  res.status(200).json({ message: "Fetch all users" });
});

export default router;