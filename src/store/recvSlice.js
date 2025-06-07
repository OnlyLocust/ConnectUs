import { createSlice } from "@reduxjs/toolkit";

const recvSlice = createSlice({
  name: "recv",
  initialState: {
    receiver: null,
    recvPost: null,
  },
  reducers: {
    setRecv: (state, action) => {
      state.receiver = action.payload;
    },
    removeRecv: (state) => {
      state.receiver = null;
    },
    setFollower: (state, action) => {
      const { follow } = action.payload;
      if (follow) {
        state.receiver.followerCount += 1;
      } else {
        state.receiver.followerCount -= 1;
      }
    },
    setRecvPosts: (state, action) => {
      state.recvPost = action.payload;
    },
    setRecvOnePost: (state, action) => {
      state.recvPost = action.payload;
    },
    setRecvOnePostLike: (state, action) => {
      const { userId, doLike } = action.payload;

      if (doLike) {
        state.recvPost.likes = [...state.recvPost.likes, userId];
      } else {
        state.recvPost.likes = state.recvPost.likes.filter(
          (id) => id !== userId
        );
      }
    },
    setRecvOnePostComment: (state, action) => {
      const { postId, username, text } = action.payload;
      const comment = {
        text,
        post: postId,
        author: {
          username,
        },
      };

      state.recvPost.comments = [...state.recvPost.comments, comment];
    },
    removeRecvOnePostComment: (state) => {
      state.recvPost.comments.pop()
    },
    removeRecvPost: (state) => {
      state.recvPost = null;
    },
  },
});

export const {
  removeRecv,
  setRecv,
  setFollower,
  setRecvPosts,
  setRecvOnePost,
  setRecvOnePostLike,
  setRecvOnePostComment,
  removeRecvPost,
  removeRecvOnePostComment
} = recvSlice.actions;
export default recvSlice.reducer;
