import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "search",
  initialState: {
    chatUsers: [],
    recv: null,
    chats: [],
    typingUsers: {},
  },
  reducers: {
    setUserChats: (state, action) => {
      state.chatUsers = action.payload;
    },
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    addChat: (state, action) => {
      const { _id, message, isSender, createdAt, optimisticId } = action.payload;

      // Reconcile by optimisticId first
      if (optimisticId) {
        const optMsg = state.chats.find((m) => m.optimisticId === optimisticId);
        if (optMsg) {
          optMsg._id = _id;
          optMsg.createdAt = createdAt || optMsg.createdAt;
          return;
        }
      }

      // Check if already present by _id
      if (_id && state.chats.some((m) => m._id === _id)) {
        return;
      }

      // Fallback matching for sender messages without ids
      if (_id && isSender) {
        const optMsg = state.chats.find((m) => !m._id && m.isSender && m.message === message);
        if (optMsg) {
          optMsg._id = _id;
          optMsg.createdAt = createdAt || optMsg.createdAt;
          return;
        }
      }

      state.chats.push({
        _id,
        message,
        isSender,
        createdAt: createdAt || Date.now(),
        optimisticId,
      });
    },
    removeChat: (state, action) => {
      const { optimisticId } = action.payload || {};
      if (optimisticId) {
        state.chats = state.chats.filter((m) => m.optimisticId !== optimisticId);
      } else {
        state.chats.pop();
      }
    },
    setRecvId: (state, action) => {
      const id = action.payload;
       state.recv = id

      state.chatUsers = state.chatUsers.map((chat) =>
        chat.member._id === id
          ? {
              ...chat,
              notRead: 0,
            }
          : chat
      );
    },
    setOnline: (state, action) => {
      // const onlines =;
      const onlineUsers = new Set(action.payload.onlineUsers);
      state.chatUsers = state.chatUsers.map((chat) => {
        const isOnline = onlineUsers.has(chat.member._id);
        return {
          ...chat,
          member: {
            ...chat.member,
            online: isOnline,
          },
        };
      });
    },
    addOnline: (state, action) => {
      const userId = action.payload;

      state.chatUsers = state.chatUsers.map((chat) =>
        chat.member._id === userId
          ? {
              ...chat,
              member: {
                ...chat.member,
                online: true,
              },
            }
          : chat
      );
    },
    removeOnline: (state, action) => {
      const { userId, lastSeen } = action.payload;

      state.chatUsers = state.chatUsers.map((chat) =>
        chat.member._id === userId
          ? {
              ...chat,
              member: {
                ...chat.member,
                online: false,
                lastSeen: lastSeen || chat.member.lastSeen || new Date().toISOString(),
              },
            }
          : chat
      );
    },
    setTyping: (state, action) => {
      const { userId, isTyping } = action.payload;
      state.typingUsers = {
        ...state.typingUsers,
        [userId]: isTyping,
      };
    },
    setNotReadMessage: (state, action) => {
      const id = action.payload;

      state.chatUsers = state.chatUsers.map((chat) =>
        chat.member._id === id
          ? {
              ...chat,
              notRead: (chat.notRead || 0) + 1,
            }
          : chat
      );
    },
  },
});

export const {
  setUserChats,
  setChats,
  addChat,
  removeChat,
  setRecvId,
  setOnline,
  addOnline,
  removeOnline,
  setNotReadMessage,
  setTyping
} = chatSlice.actions;
export default chatSlice.reducer;
