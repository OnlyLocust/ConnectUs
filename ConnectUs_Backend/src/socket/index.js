import { Server } from "socket.io";
import User from "../models/user.model.js";
import { onlineUsers } from "./onlineUsers.js";
import { getPresenceSubscribers } from "./getPresenceSubscribers.js";

export const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  global.io = io;

  io.on("connection", async (socket) => {

    const { userId } = socket.handshake.query;

    if (!userId) {
      return socket.disconnect();
    }

    socket.join(userId);

    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }

    const userSockets = onlineUsers.get(userId);
    userSockets.add(socket.id);

    if (userSockets.size === 1) {

      try {
        await User.findByIdAndUpdate(userId, {
          lastSeen: new Date(),
        });
      } catch (err) {
        console.error(err);
      }

      const subscribers =
        await getPresenceSubscribers(userId);

      subscribers.forEach(subId => {
        io.to(subId).emit("user-online", {
          userId,
        });
      });
    }

    console.log("Connected:", userId);

    // ==================
    // SEND MESSAGE
    // ==================

    socket.on("send", (data) => {

      const {
        recvId,
        message,
        createdAt,
      } = data;

      io.to(recvId).emit("get", {
        userId,
        message,
        createdAt,
      });
    });

    // ==================
    // ONLINE USERS
    // ==================

    socket.on("get-users", async () => {

      const subscribers =
        await getPresenceSubscribers(userId);

      const onlineSubscribers =
        subscribers.filter(id =>
          onlineUsers.has(id)
        );

      socket.emit("online-users", {
        onlineUsers: onlineSubscribers,
      });
    });

    // ==================
    // TYPING
    // ==================

    socket.on("typing", (data) => {

      const {
        recvId,
        isTyping,
      } = data;

      io.to(recvId).emit("user-typing", {
        userId,
        isTyping,
      });
    });

    // ==================
    // NOTIFICATIONS
    // ==================

    socket.on("notify", ({ recvId }) => {

      io.to(recvId).emit("notification");
    });

    // ==================
    // ROOMS
    // ==================

    socket.on("join-post", ({ postId }) => {
      socket.join(`post:${postId}`);
    });

    socket.on("leave-post", ({ postId }) => {
      socket.leave(`post:${postId}`);
    });

    socket.on("join-profile", ({ profileId }) => {
      socket.join(`profile:${profileId}`);
    });

    socket.on("leave-profile", ({ profileId }) => {
      socket.leave(`profile:${profileId}`);
    });

    socket.on("join-chat", ({ chatId }) => {
      socket.join(`chat:${chatId}`);
    });

    socket.on("leave-chat", ({ chatId }) => {
      socket.leave(`chat:${chatId}`);
    });

    // ==================
    // DISCONNECT
    // ==================

    socket.on("disconnect", async () => {

      const userSockets =
        onlineUsers.get(userId);

      if (!userSockets) return;

      userSockets.delete(socket.id);

      if (userSockets.size === 0) {

        const lastSeen = new Date();

        try {
          await User.findByIdAndUpdate(
            userId,
            { lastSeen }
          );
        } catch (err) {
          console.error(err);
        }

        const subscribers =
          await getPresenceSubscribers(userId);

        subscribers.forEach(subId => {
          io.to(subId).emit("user-offline", {
            userId,
            lastSeen,
          });
        });

        onlineUsers.delete(userId);
      }

      console.log("Disconnected:", userId);
    });
  });

  return io;
};