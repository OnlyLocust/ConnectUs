import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";

import { setupSocket } from "./src/socket/index.js";
import connectDB from "./src/config/db.js";

import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from './src/routes/user.routes.js';
import chatRoutes from "./src/routes/chat.routes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

setupSocket(server);

// Middleware
app.use(
  cors({
    origin: ["http://localhost:10000", process.env.FRONTEND_URL],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend Running",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/get",userRoutes)
app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();