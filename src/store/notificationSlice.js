import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notifications:[],
    isNotification:false
  },
  reducers: {
    setNotifications:(state,action) => {
        state.notifications=action.payload.notification 
    },
    addNotification:(state,action) => {

      if(!state.isNotification) return 

      const {actionType, username, userId ,createdAt} = action.payload
      const notification = {
        action:actionType,
        actor:{
          _id:userId,
          username
        },
        createdAt
      }
      state.notifications = [notification , ...state.notifications]
    },
    removeNotification:(state) => {
      state.notifications = []
    }
  }
    
});

export const { setNotifications, addNotification , removeNotification} = notificationSlice.actions;
export default notificationSlice.reducer;
