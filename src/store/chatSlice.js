import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "search",
  initialState: {
    chatUsers : [],
    recv : null,
    chats:null
  },
  reducers: {
    setUserChats:(state,action) => {
        state.chatUsers = action.payload
    },
    setChats:(state,action) => {
        state.chats = action.payload
    },
    addChat:(state,action) => {
        const {message , isSender , createdAt} = action.payload
        state.chats.push({message, isSender , createdAt:createdAt || Date.now()})
    },
    removeChat:(state) => {
      state.chats.pop()
    },
    setRecvId:(state,action) => {
      state.recv = action.payload
    }
  }
    
});

export const {setUserChats , setChats, addChat, removeChat, setRecvId} = chatSlice.actions;
export default chatSlice.reducer;
