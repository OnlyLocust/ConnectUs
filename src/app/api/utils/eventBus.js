import EventEmitter from "events";
import { createAndSendNotification } from "./notification";

export const EVENTS = {
  POST_LIKED: "POST_LIKED",
  COMMENT_ADDED: "COMMENT_ADDED",
  POST_CREATED: "POST_CREATED",
  POST_DELETED: "POST_DELETED",
  FOLLOW_CREATED: "FOLLOW_CREATED",
  MESSAGE_SENT: "MESSAGE_SENT",
  MESSAGE_READ: "MESSAGE_READ",
  NOTIFICATION_RESET: "NOTIFICATION_RESET",
};

class EventBus extends EventEmitter {
  constructor() {
    super();
    this.setupListeners();
  }

  setupListeners() {
    // 1. Post Liked Event Handler
    this.on(EVENTS.POST_LIKED, async (payload) => {
      const { postId, actorId, recipientId, doLike } = payload;
      try {
        if (doLike) {
          await createAndSendNotification(actorId, recipientId, "like");
        }
        if (global.io) {
          global.io.to(`post:${postId}`).emit("post-like", { postId, userId: actorId, doLike });
        }
      } catch (err) {
        console.error("Error in POST_LIKED event handler:", err);
      }
    });

    // 2. Comment Added Event Handler
    this.on(EVENTS.COMMENT_ADDED, async (payload) => {
      const { postId, actorId, recipientId, comment, optimisticId } = payload;
      try {
        if (recipientId) {
          await createAndSendNotification(actorId, recipientId, "comment");
        }
        if (global.io) {
          global.io.to(`post:${postId}`).emit("post-comment", { postId, comment, optimisticId });
        }
      } catch (err) {
        console.error("Error in COMMENT_ADDED event handler:", err);
      }
    });

    // 3. Post Created Event Handler
    this.on(EVENTS.POST_CREATED, (payload) => {
      const { authorId, post, followers } = payload;
      try {
        if (global.io) {
          global.io.to(authorId).emit("post-create", post);
          followers.forEach((followerId) => {
            global.io.to(followerId).emit("post-create", post);
          });
        }
      } catch (err) {
        console.error("Error in POST_CREATED event handler:", err);
      }
    });

    // 4. Post Deleted Event Handler
    this.on(EVENTS.POST_DELETED, (payload) => {
      const { postId, authorId, followers } = payload;
      try {
        if (global.io) {
          global.io.to(`post:${postId}`).emit("post-delete", { postId });
          global.io.to(authorId).emit("post-delete", { postId });
          followers.forEach((followerId) => {
            global.io.to(followerId).emit("post-delete", { postId });
          });
        }
      } catch (err) {
        console.error("Error in POST_DELETED event handler:", err);
      }
    });

    // 5. Follow Created Event Handler
    this.on(EVENTS.FOLLOW_CREATED, async (payload) => {
      const { followerId, followingId, follow } = payload;
      try {
        if (follow) {
          await createAndSendNotification(followerId, followingId, "follow");
        }
        if (global.io) {
          const rooms = [followerId, followingId, `profile:${followerId}`, `profile:${followingId}`];
          rooms.forEach((roomName) => {
            global.io.to(roomName).emit("follow-user", { followerId, followingId, follow });
          });
        }
      } catch (err) {
        console.error("Error in FOLLOW_CREATED event handler:", err);
      }
    });

    // 6. Message Sent Event Handler
    this.on(EVENTS.MESSAGE_SENT, (payload) => {
      const { messageId, senderId, receiverId, message, createdAt, optimisticId } = payload;
      try {
        if (global.io) {
          global.io.to(receiverId).emit("get", {
            _id: messageId,
            userId: senderId,
            message,
            createdAt,
          });
          global.io.to(senderId).emit("sent", {
            messageId,
            recvId: receiverId,
            message,
            createdAt,
            optimisticId,
          });
        }
      } catch (err) {
        console.error("Error in MESSAGE_SENT event handler:", err);
      }
    });

    // 7. Message Read Event Handler
    this.on(EVENTS.MESSAGE_READ, (payload) => {
      const { chatId, userId, recvId } = payload;
      try {
        if (global.io) {
          global.io.to(userId).emit("chat-read", { chatId, recvId });
        }
      } catch (err) {
        console.error("Error in MESSAGE_READ event handler:", err);
      }
    });

    // 8. Notification Reset Event Handler
    this.on(EVENTS.NOTIFICATION_RESET, (payload) => {
      const { userId } = payload;
      try {
        if (global.io) {
          global.io.to(userId).emit("notification-reset");
        }
      } catch (err) {
        console.error("Error in NOTIFICATION_RESET event handler:", err);
      }
    });
  }
}

export const eventBus = new EventBus();
