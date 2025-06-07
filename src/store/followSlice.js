import { createSlice } from "@reduxjs/toolkit";

const followSlice = createSlice({
  name: "follow",
  initialState: {
    user: {},
    follow:{}
  },
  reducers: {
    setFollow:(state,action) => {
        state.follow = action.payload.followData;
        state.user = action.payload.userData;
    },
    emptyFollow:(state) => {
      state.user = {}
        state.follow = {}
    },
  }
    
});

export const {setFollow, emptyFollow} = followSlice.actions;
export default followSlice.reducer;
