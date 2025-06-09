import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "search",
  initialState: {
    chatUsers: [],
    recv: null,
    chats: null,
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
      state.recv = action.payload;
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
      const userId = action.payload;

      state.chatUsers = state.chatUsers.map((chat) =>
        chat.member._id === userId
          ? {
              ...chat,
              member: {
                ...chat.member,
                online: false,
              },
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
} = chatSlice.actions;
export default chatSlice.reducer;
