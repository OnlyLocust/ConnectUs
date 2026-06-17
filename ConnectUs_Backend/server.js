import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import mongoSanitize from "./src/middleware/mongoSanitize.js";

import { setupSocket } from "./src/socket/index.js";
import connectDB from "./src/config/db.js";

import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from './src/routes/user.routes.js';
import chatRoutes from "./src/routes/chat.routes.js";
import postRoutes from "./src/routes/post.routes.js"
import notificationRoutes from "./src/routes/notification.routes.js"
import followRoutes from "./src/routes/follow.routes.js"

dotenv.config();

const app = express();
const server = http.createServer(app);

setupSocket(server);

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", process.env.FRONTEND_URL],
    credentials: true,
  })
);

app.use(express.json());
app.use(mongoSanitize);
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
app.use("/api/user",userRoutes)
app.use("/api/chat", chatRoutes);
app.use("/api/post", postRoutes);
app.use("/api/notification", notificationRoutes)
app.use("/api/follow", followRoutes)

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