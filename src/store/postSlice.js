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
    prependPost: (state, action) => {
      const post = action.payload;
      if (!state.posts.some((p) => p._id === post._id)) {
        state.posts = [post, ...state.posts];
      }
    },
    setPostComment: (state, action) => {
      const { postId, username, text, comment, optimisticId } = action.payload;

      const post = state.posts.find((post) => post._id === postId);
      if (!post) return;

      if (comment) {
        if (comment._id && post.comments.some((c) => c._id === comment._id)) {
          return;
        }

        let optComment = null;
        if (optimisticId) {
          optComment = post.comments.find((c) => c.optimisticId === optimisticId);
        }
        if (!optComment) {
          optComment = post.comments.find(
            (c) => !c._id && c.text === comment.text && c.author?.username === comment.author?.username
          );
        }

        if (optComment) {
          optComment._id = comment._id;
          optComment.author = comment.author;
          optComment.createdAt = comment.createdAt;
        } else {
          post.comments = [...post.comments, comment];
        }
      } else {
        const optimisticComment = {
          text,
          post: postId,
          author: {
            username,
          },
          optimisticId,
        };
        post.comments = [...post.comments, optimisticComment];
      }
    },
    removePostComment: (state, action) => {
      const { postId, optimisticId } = action.payload;
      const post = state.posts.find((post) => post._id === postId);
      if (!post) return;

      if (optimisticId) {
        post.comments = post.comments.filter((c) => c.optimisticId !== optimisticId);
      } else {
        const lastIndex = [...post.comments].reverse().findIndex((c) => !c._id);
        if (lastIndex !== -1) {
          const targetIndex = post.comments.length - 1 - lastIndex;
          post.comments.splice(targetIndex, 1);
        } else {
          post.comments.pop();
        }
      }
    },
    setPostLike: (state, action) => {
      const { postId, userId, doLike } = action.payload;

      const post = state.posts.find((post) => post._id === postId);
      if (!post) return;

      if (doLike) {
        if (!post.likes.includes(userId)) {
          post.likes = [...post.likes, userId];
        }
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

export const {
  setPosts,
  addPosts,
  prependPost,
  setPostComment,
  setPostLike,
  deletePost,
  removePostComment,
} = postSlice.actions;
export default postSlice.reducer;
