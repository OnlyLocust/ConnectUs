import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
  },
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    addPosts: (state, action) => {
      state.posts = [...state.posts, ...action.payload];
    },
    setPostComment: (state, action) => {
      const { postId, username, text } = action.payload;
      const comment = {
        text,
        post: postId,
        author: {
          username,
        },
      };

      const post = state.posts.find((post) => post._id === postId);
      if (!post) return; // optionally handle missing post

      post.comments = [...post.comments, comment];
    },
    removePostComment: (state,action) => {
      const {postId} = action.payload
      const post = state.posts.find((post) => post._id === postId);
      if (!post) return; // optionally handle missing post
      post.comments.pop()
    },
    setPostLike: (state, action) => {
      const { postId, userId, doLike } = action.payload;

      const post = state.posts.find((post) => post._id === postId);
      if (!post) return; // optionally handle post not found

      if (doLike) {
        post.likes = [...post.likes, userId];
      } else {
        post.likes = post.likes.filter((id) => id !== userId);
      }
    },
    deletePost: (state, action) => {
      const { postId } = action.payload;
      state.posts = state.posts.filter((post) => post._id !== postId);
    },
  },
});

export const { setPosts,addPosts, setPostComment, setPostLike, deletePost, removePostComment } =
  postSlice.actions;
export default postSlice.reducer;
