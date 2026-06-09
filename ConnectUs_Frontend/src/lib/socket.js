  import { io } from "socket.io-client";
  import dotenv from "dotenv";
  dotenv.config();
  import { store } from "@/store/store";
  import { addChat, addOnline, removeOnline, setNotReadMessage, setOnline, setTyping, resetNotReadMessage, setUserChats, setChats } from "@/store/chatSlice";
  import { setNotRead, followRecv } from "@/store/authSlice";
  import { setPostLike, setPostComment, deletePost, prependPost, reconcilePosts } from "@/store/postSlice";
  import { setFollower, updateReceiverPresence, reconcileRecvPost } from "@/store/recvSlice";
  import { addNotification, setNotifications } from "@/store/notificationSlice";
  import axios from "axios";
  import { API_URL } from "@/constants/constant";

  let activePostRooms = new Set();
  let activeProfileRoom = null;
  let activeChatRoom = null;
  let receivedNotificationIds = new Set();
  let socket;
  let resyncAbortController = null;

  export const initiateSocket = (userId) => {
    if (socket) {
      if (!socket.connected) {
        console.log("🔄 Reconnecting existing socket instance...");
        socket.connect();
      }
      return;
    }

    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000", {
      query: { userId },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      randomizationFactor: 0.5,
      timeout: 15000,
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error);
    });

    socket.on("disconnect", (reason) => {
      console.warn("⚠️ Socket disconnected. Reason:", reason);
      if (resyncAbortController) {
        resyncAbortController.abort();
        resyncAbortController = null;
      }
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected to server!");
      
      // Abort any outstanding resynchronization API calls from previous connection sessions
      if (resyncAbortController) {
        resyncAbortController.abort();
      }
      resyncAbortController = new AbortController();
      const signal = resyncAbortController.signal;

      socket.emit("get-users", {});

      // Re-join active post rooms
      activePostRooms.forEach((postId) => {
        socket.emit("join-post", { postId });
      });

      // Re-join active profile room
      if (activeProfileRoom) {
        socket.emit("join-profile", { profileId: activeProfileRoom });
      }

      // Re-join active chat room
      if (activeChatRoom) {
        socket.emit("join-chat", { chatId: activeChatRoom });
      }

      // Helper to handle API errors and ignore cancellation errors
      const handleCatch = (context) => (err) => {
        if (axios.isCancel(err)) {
          console.log(`Cancelled resync request for: ${context}`);
        } else {
          console.error(`Failed to sync ${context} on connect:`, err);
        }
      };

      // Fetch up-to-date user details (to sync unread notification count on connect/reconnect)
      axios.get(`${API_URL}/user`, {
        withCredentials: true,
        signal,
      }).then((res) => {
        if (res.data.success && res.data.user) {
          const notRead = res.data.user.notifications?.notRead || 0;
          store.dispatch(setNotRead({ type: "set", notRead }));
        }
      }).catch(handleCatch("notifications count"));

      // If currently viewing notifications page, refresh the notifications list to fetch missed events
      const isNotification = store.getState().notification.isNotification;
      if (isNotification) {
        axios.get(`${API_URL}/notification/get`, {
          withCredentials: true,
          signal,
        }).then((res) => {
          if (res.data.success) {
            store.dispatch(setNotifications(res.data.notifications));
          }
        }).catch(handleCatch("notifications list"));
      }

      // Reconnect recovery for active chat messages
      const activeRecv = store.getState().chat.recv;
      if (activeRecv) {
        axios.get(`${API_URL}/chat/${activeRecv}`, {
          withCredentials: true,
          signal,
        }).then((res) => {
          if (res.data.success) {
            store.dispatch(setChats(res.data.messages));
          }
        }).catch(handleCatch("chat messages"));
      }

      // Reconnect recovery for sidebar chat users list
      axios.get(`${API_URL}/chat/chatusers`, {
        withCredentials: true,
        signal,
      }).then((res) => {
        if (res.data.success) {
          store.dispatch(setUserChats(res.data.chatUsers));
        }
      }).catch(handleCatch("chat users list"));

      // Reconnect recovery for home feed posts
      const homePosts = store.getState().posts.posts;
      if (homePosts && homePosts.length > 0) {
        const fetchLimit = Math.max(10, homePosts.length);
        axios.get(`${API_URL}/post?limit=${fetchLimit}`, {
          withCredentials: true,
          signal,
        }).then((res) => {
          if (res.data.success) {
            store.dispatch(reconcilePosts(res.data.posts));
          }
        }).catch(handleCatch("home feed posts"));
      }

      // Reconnect recovery for active profile details
      if (activeProfileRoom) {
        axios.get(`${API_URL}/get/${activeProfileRoom}`, {
          withCredentials: true,
          signal,
        }).then((res) => {
          if (res.data.success) {
            store.dispatch(setRecv(res.data.user));
          }
        }).catch(handleCatch("profile details"));
      }

      // Reconnect recovery for active single post detail view
      const recvPost = store.getState().recv.recvPost;
      if (recvPost) {
        axios.get(`${API_URL}/post/${recvPost._id}`, {
          withCredentials: true,
          signal,
        }).then((res) => {
          if (res.data.success) {
            store.dispatch(reconcileRecvPost(res.data.post));
          }
        }).catch(handleCatch("single post detail"));
      }
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

          // Reset unread count automatically since we are actively viewing this chat
          const chatUsers = store.getState().chat.chatUsers;
          const activeChat = chatUsers.find((chat) => chat.member._id === data.userId);
          if (activeChat) {
            axios.patch(`${API_URL}/chat/notread/${activeChat._id}`, {}, {
              withCredentials: true,
            }).catch((err) => {
              console.error("Failed to mark message as read in real-time:", err);
            });
          }
        }
        else{
          store.dispatch(setNotReadMessage(data.userId.toString()));
        }
      });

      socket.on("sent", (data) => {
        const activeRecv = store.getState().chat.recv;
        if (activeRecv === data.recvId) {
          store.dispatch(
            addChat({
              _id: data.messageId,
              message: data.message,
              isSender: true,
              createdAt: data.createdAt,
              optimisticId: data.optimisticId,
            })
          );
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
        if (data && data._id) {
          if (receivedNotificationIds.has(data._id)) {
            return;
          }
          receivedNotificationIds.add(data._id);
          if (receivedNotificationIds.size > 100) {
            const firstKey = receivedNotificationIds.values().next().value;
            receivedNotificationIds.delete(firstKey);
          }
        }

        store.dispatch(setNotRead({ type: "inc" }));
        if (data) {
          store.dispatch(addNotification(data));
        }
      });

      socket.on("notification-reset", () => {
        store.dispatch(setNotRead({ type: "reset" }));
      });

      socket.on("chat-read", (data) => {
        store.dispatch(resetNotReadMessage(data.recvId));
      });

      socket.on("post-like", (data) => {
        const posts = store.getState().posts.posts;
        const post = posts.find((p) => p._id === data.postId);
        const recvPost = store.getState().recv.recvPost;
        
        const isPostLiked = post && post.likes.includes(data.userId);
        const isRecvPostLiked = recvPost && recvPost._id === data.postId && recvPost.likes.includes(data.userId);

        if ((post && isPostLiked !== data.doLike) || (recvPost && isRecvPostLiked !== data.doLike) || (!post && !recvPost)) {
          store.dispatch(setPostLike(data));
        }
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

        const isCurrentlyFollowing = currentUser && currentUser.following && currentUser.following.includes(data.followingId);

        if (isCurrentlyFollowing !== data.follow) {
          store.dispatch(followRecv({ recvId: data.followingId, follow: data.follow }));
        }

        if (viewedRecv && viewedRecv._id === data.followingId) {
          if (currentUser && currentUser._id !== data.followerId) {
            store.dispatch(setFollower({ follow: data.follow }));
          }
        }
      });
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
    if (resyncAbortController) {
      resyncAbortController.abort();
      resyncAbortController = null;
    }
    if (socket) {
      if (socket.typingTimeouts) {
        Object.values(socket.typingTimeouts).forEach(clearTimeout);
        socket.typingTimeouts = {};
      }
      socket.off(); // Remove all listeners
      socket.disconnect();
      socket = null;
    }
    activePostRooms.clear();
    activeProfileRoom = null;
    activeChatRoom = null;
    receivedNotificationIds.clear();
  };

  export const joinPostRoom = (postId) => {
    if (!postId) return;
    activePostRooms.add(postId);
    if (socket && socket.connected) {
      socket.emit("join-post", { postId });
    }
  };

  export const leavePostRoom = (postId) => {
    if (!postId) return;
    activePostRooms.delete(postId);
    if (socket && socket.connected) {
      socket.emit("leave-post", { postId });
    }
  };

  export const joinProfileRoom = (profileId) => {
    if (!profileId) return;
    activeProfileRoom = profileId;
    if (socket && socket.connected) {
      socket.emit("join-profile", { profileId });
    }
  };

  export const leaveProfileRoom = (profileId) => {
    if (!profileId) return;
    if (activeProfileRoom === profileId) {
      activeProfileRoom = null;
    }
    if (socket && socket.connected) {
      socket.emit("leave-profile", { profileId });
    }
  };

  export const joinChatRoom = (chatId) => {
    if (!chatId) return;
    activeChatRoom = chatId;
    if (socket && socket.connected) {
      socket.emit("join-chat", { chatId });
    }
  };

  export const leaveChatRoom = (chatId) => {
    if (!chatId) return;
    if (activeChatRoom === chatId) {
      activeChatRoom = null;
    }
    if (socket && socket.connected) {
      socket.emit("leave-chat", { chatId });
    }
  };
