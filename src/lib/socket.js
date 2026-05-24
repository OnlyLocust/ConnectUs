  import { io } from "socket.io-client";
  import dotenv from "dotenv";
  dotenv.config();
  import { store } from "@/store/store";
  import { addChat, addOnline, removeOnline, setNotReadMessage, setOnline, setTyping } from "@/store/chatSlice";
  import { setNotRead, followRecv } from "@/store/authSlice";
  import { setPostLike, setPostComment, deletePost, prependPost } from "@/store/postSlice";
  import { setFollower, updateReceiverPresence } from "@/store/recvSlice";
  import { addNotification } from "@/store/notificationSlice";

  let socket;

  export const initiateSocket = (userId) => {
    if (!socket) {
      socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000", {
        query: { userId },
        transports: ["websocket"],
      });

      socket.on("connect", () => {
        console.log("✅ connected to server !!!!");
        socket.emit("get-users", {});
      });

      socket.on("get", (data) => {
        const recv = store.getState().chat.recv;
        
        // Clear typing indicator for the sender when they send a message
        store.dispatch(setTyping({ userId: data.userId, isTyping: false }));
 
        if (recv === data.userId) {
          store.dispatch(
            addChat({
              _id: data._id,
              message: data.message,
              isSender: false,
              createdAt: data.createdAt,
            })
          );
        }
        else{
          store.dispatch(setNotReadMessage(data.userId.toString()));
        }
      });

      socket.on("sent", (data) => {
        const activeRecv = store.getState().chat.recv;
        if (activeRecv === data.recvId) {
          const chats = store.getState().chat.chats;
          const hasOptimistic = chats.some(
            (msg) => msg.isSender && msg.message === data.message && !msg._id
          );
          if (!hasOptimistic) {
            store.dispatch(
              addChat({
                _id: data.messageId,
                message: data.message,
                isSender: true,
                createdAt: data.createdAt,
              })
            );
          }
        }
      });

      socket.on("online-users" , (data) => {
        store.dispatch(setOnline(data))
      })

      socket.on('user-online' ,(data) => {
        const {userId} = data;
        store.dispatch(addOnline(userId))
        store.dispatch(updateReceiverPresence({ userId, online: true }))
      })

      socket.on('user-offline' ,(data) => {
        const {userId, lastSeen} = data;
        store.dispatch(removeOnline({ userId, lastSeen }))
        store.dispatch(updateReceiverPresence({ userId, online: false, lastSeen }))
      })

      socket.on("user-typing", (data) => {
        const { userId, isTyping } = data;
        store.dispatch(setTyping({ userId, isTyping }));
        
        // Auto-expire typing indicator after 5 seconds of inactivity as a fail-safe
        if (isTyping) {
          if (!socket.typingTimeouts) socket.typingTimeouts = {};
          if (socket.typingTimeouts[userId]) {
            clearTimeout(socket.typingTimeouts[userId]);
          }
          socket.typingTimeouts[userId] = setTimeout(() => {
            store.dispatch(setTyping({ userId, isTyping: false }));
            delete socket.typingTimeouts[userId];
          }, 5000);
        }
      });

      socket.on("notification", (data) => {
        store.dispatch(setNotRead({ type: "inc" }));
        if (data) {
          store.dispatch(addNotification(data));
        }
      });

      socket.on("post-like", (data) => {
        const currentUser = store.getState().auth.user;
        if (currentUser && currentUser._id === data.userId) {
          return;
        }
        store.dispatch(setPostLike(data));
      });

      socket.on("post-comment", (data) => {
        store.dispatch(setPostComment(data));
      });

      socket.on("post-delete", (data) => {
        store.dispatch(deletePost(data));
      });

      socket.on("post-create", (data) => {
        store.dispatch(prependPost(data));
      });

      socket.on("follow-user", (data) => {
        const currentUser = store.getState().auth.user;
        const viewedRecv = store.getState().recv.receiver;

        if (currentUser && currentUser._id === data.followerId) {
          store.dispatch(followRecv({ recvId: data.followingId, follow: data.follow }));
        }

        if (viewedRecv && viewedRecv._id === data.followingId) {
          if (currentUser && currentUser._id !== data.followerId) {
            store.dispatch(setFollower({ follow: data.follow }));
          }
        }
      });
    }
  };


  export const askOnline = () => {
    if(socket){
      socket.emit("get-users" ,{})
    } else {
      console.warn("❌ Disconnnected from server ......!!!");
    }
  }

  export const getSocket = () => socket;

  export const disconnectSocket = () => {
    if (socket) {
      if (socket.typingTimeouts) {
        Object.values(socket.typingTimeouts).forEach(clearTimeout);
        socket.typingTimeouts = {};
      }
      socket.off(); // Remove all listeners
      socket.disconnect();
      socket = null;
    }
  };
