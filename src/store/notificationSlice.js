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
    setIsNotification: (state, action) => {
      state.isNotification = action.payload;
    },
    addNotification:(state,action) => {

      if(!state.isNotification) return 

      const payload = action.payload;
      if (payload.actor && typeof payload.actor === "object") {
        // Prevent duplicate notifications in list
        if (payload._id && state.notifications.some((n) => n._id === payload._id)) {
          return;
        }
        state.notifications = [payload, ...state.notifications];
      } else {
        const {actionType, username, userId ,createdAt} = action.payload;
        const notification = {
          action:actionType,
          actor:{
            _id:userId,
            username
          },
          createdAt
        };
        state.notifications = [notification , ...state.notifications];
      }
    },
    removeNotification:(state) => {
      state.notifications = [];
    }
  }
    
});

export const { setNotifications, addNotification , removeNotification, setIsNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
