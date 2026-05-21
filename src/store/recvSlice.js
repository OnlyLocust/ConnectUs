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
  extraReducers: (builder) => {
    builder
      .addCase("posts/setPostLike", (state, action) => {
        const { postId, userId, doLike } = action.payload;
        if (state.recvPost && state.recvPost._id === postId) {
          if (doLike) {
            if (!state.recvPost.likes.includes(userId)) {
              state.recvPost.likes = [...state.recvPost.likes, userId];
            }
          } else {
            state.recvPost.likes = state.recvPost.likes.filter((id) => id !== userId);
          }
        }
        if (state.receiver) {
          if (state.receiver.posts) {
            const p = state.receiver.posts.find((p) => p._id === postId);
            if (p) {
              if (doLike) {
                p.likeCount = (p.likeCount || 0) + 1;
              } else {
                p.likeCount = Math.max(0, (p.likeCount || 0) - 1);
              }
            }
          }
          if (state.receiver.bookmarks) {
            const p = state.receiver.bookmarks.find((p) => p._id === postId);
            if (p) {
              if (doLike) {
                p.likeCount = (p.likeCount || 0) + 1;
              } else {
                p.likeCount = Math.max(0, (p.likeCount || 0) - 1);
              }
            }
          }
        }
      })
      .addCase("posts/setPostComment", (state, action) => {
        const { postId, username, text, comment } = action.payload;
        if (state.recvPost && state.recvPost._id === postId) {
          if (comment) {
            if (comment._id && state.recvPost.comments.some((c) => c._id === comment._id)) {
              return;
            }
            const optComment = state.recvPost.comments.find(
              (c) => !c._id && c.text === comment.text && c.author?.username === comment.author?.username
            );
            if (optComment) {
              optComment._id = comment._id;
              optComment.author = comment.author;
              optComment.createdAt = comment.createdAt;
            } else {
              state.recvPost.comments = [...state.recvPost.comments, comment];
            }
          } else {
            const optimisticComment = {
              text,
              post: postId,
              author: {
                username,
              },
            };
            state.recvPost.comments = [...state.recvPost.comments, optimisticComment];
          }
        }
        if (state.receiver) {
          if (state.receiver.posts) {
            const p = state.receiver.posts.find((p) => p._id === postId);
            if (p) {
              p.commentCount = (p.commentCount || 0) + 1;
            }
          }
          if (state.receiver.bookmarks) {
            const p = state.receiver.bookmarks.find((p) => p._id === postId);
            if (p) {
              p.commentCount = (p.commentCount || 0) + 1;
            }
          }
        }
      })
      .addCase("posts/removePostComment", (state, action) => {
        const { postId } = action.payload;
        if (state.recvPost && state.recvPost._id === postId) {
          const lastIndex = [...state.recvPost.comments].reverse().findIndex((c) => !c._id);
          if (lastIndex !== -1) {
            const targetIndex = state.recvPost.comments.length - 1 - lastIndex;
            state.recvPost.comments.splice(targetIndex, 1);
          } else {
            state.recvPost.comments.pop();
          }
        }
        if (state.receiver) {
          if (state.receiver.posts) {
            const p = state.receiver.posts.find((p) => p._id === postId);
            if (p) {
              p.commentCount = Math.max(0, (p.commentCount || 0) - 1);
            }
          }
          if (state.receiver.bookmarks) {
            const p = state.receiver.bookmarks.find((p) => p._id === postId);
            if (p) {
              p.commentCount = Math.max(0, (p.commentCount || 0) - 1);
            }
          }
        }
      })
      .addCase("posts/deletePost", (state, action) => {
        const { postId } = action.payload;
        if (state.recvPost && state.recvPost._id === postId) {
          state.recvPost = null;
        }
        if (state.receiver) {
          if (state.receiver.posts) {
            state.receiver.posts = state.receiver.posts.filter((p) => p._id !== postId);
          }
          if (state.receiver.bookmarks) {
            state.receiver.bookmarks = state.receiver.bookmarks.filter((p) => p._id !== postId);
          }
        }
      })
      .addCase("auth/followRecv", (state, action) => {
        const { recvId, follow } = action.payload;
        if (state.receiver && state.receiver._id === recvId) {
          if (follow) {
            state.receiver.followerCount = (state.receiver.followerCount || 0) + 1;
          } else {
            state.receiver.followerCount = Math.max(0, (state.receiver.followerCount || 0) - 1);
          }
        }
      });
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
