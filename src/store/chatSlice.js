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
      const { message, isSender, createdAt } = action.payload;
      state.chats.push({
        message,
        isSender,
        createdAt: createdAt || Date.now(),
      });
    },
    removeChat: (state) => {
      state.chats.pop();
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
