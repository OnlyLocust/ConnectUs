import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "search",
  initialState: {
    users: [],
    posts:[]
  },
  reducers: {
    setSearchPosts: (state, action) => {
    //   state.posts = action.payload;
      const posts = action.payload;
      state.posts = posts.sort(() => 0.5 - Math.random());
    },
    setSearchUsers: (state, action) => {
    //   state.users = action.payload;
    const users = action.payload;
      state.users = users.sort(() => 0.5 - Math.random());
    },
  }
    
});

export const {setSearchPosts, setSearchUsers} = searchSlice.actions;
export default searchSlice.reducer;
