import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { setupSocket } from "./src/socket/index.js";
import connectDB from "./src/config/db.js";

dotenv.config();

const app = express();

await connectDB()

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend Running",
  });
});

const server = http.createServer(app);

setupSocket(server);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});