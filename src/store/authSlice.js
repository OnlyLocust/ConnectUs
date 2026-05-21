import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    suggestions: [],
    notRead: 0,
  },
  reducers: {
    setAuth: (state, action) => {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
    },
    setSuggestions: (state, action) => {
      state.suggestions = action.payload;
    },
    setPostBookmark: (state, action) => {
      const { postId, doBookmark, image, likeCount, commentCount } =
        action.payload;
      if (doBookmark) {
        const bookMark = {
          _id: postId,
          image,
          likeCount,
          commentCount,
        };

        state.user.bookmarks.push(bookMark);
      } else {
        state.user.bookmarks = state.user.bookmarks.filter(
          (mark) => mark._id !== postId
        );
      }
    },
    setPost: (state, action) => {
      const { postId, image } = action.payload;
      const post = {
        _id: postId,
        image,
        likeCount: 0,
        commentCount: 0,
      };

      state.user.posts = [post, ...state.user.posts];
    },
    removePost: (state, action) => {
      const { postId } = action.payload;
      state.user.posts = state.user.posts.filter((post) => post._id !== postId);
    },
    followRecv: (state, action) => {
      const { recvId, follow } = action.payload;
      if (follow) {
        state.user.following = [...state.user.following, recvId];
      } else {
        state.user.following = state.user.following.filter(
          (id) => id !== recvId
        );
      }
    },

    setNotRead: (state, action) => {   
      const {type} = action.payload   

      if(type === 'reset'){
        state.notRead = 0
      }
      else if(type === 'set'){
        state.notRead = action.payload.notRead
      }
      else if(type == 'inc'){
        state.notRead = state.notRead + 1
      }
      else return
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase("posts/setPostLike", (state, action) => {
        const { postId, userId, doLike } = action.payload;
        if (state.user) {
          if (state.user.posts) {
            const p = state.user.posts.find((p) => p._id === postId);
            if (p) {
              if (doLike) {
                p.likeCount = (p.likeCount || 0) + 1;
              } else {
                p.likeCount = Math.max(0, (p.likeCount || 0) - 1);
              }
            }
          }
          if (state.user.bookmarks) {
            const p = state.user.bookmarks.find((p) => p._id === postId);
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
        const { postId } = action.payload;
        if (state.user) {
          if (state.user.posts) {
            const p = state.user.posts.find((p) => p._id === postId);
            if (p) {
              p.commentCount = (p.commentCount || 0) + 1;
            }
          }
          if (state.user.bookmarks) {
            const p = state.user.bookmarks.find((p) => p._id === postId);
            if (p) {
              p.commentCount = (p.commentCount || 0) + 1;
            }
          }
        }
      })
      .addCase("posts/removePostComment", (state, action) => {
        const { postId } = action.payload;
        if (state.user) {
          if (state.user.posts) {
            const p = state.user.posts.find((p) => p._id === postId);
            if (p) {
              p.commentCount = Math.max(0, (p.commentCount || 0) - 1);
            }
          }
          if (state.user.bookmarks) {
            const p = state.user.bookmarks.find((p) => p._id === postId);
            if (p) {
              p.commentCount = Math.max(0, (p.commentCount || 0) - 1);
            }
          }
        }
      })
      .addCase("posts/deletePost", (state, action) => {
        const { postId } = action.payload;
        if (state.user) {
          if (state.user.posts) {
            state.user.posts = state.user.posts.filter((p) => p._id !== postId);
          }
          if (state.user.bookmarks) {
            state.user.bookmarks = state.user.bookmarks.filter((p) => p._id !== postId);
          }
        }
      });
  },
});

export const {
  setAuth,
  logout,
  setSuggestions,
  setPostBookmark,
  setPost,
  removePost,
  followRecv,
  setNotRead
} = authSlice.actions;
export default authSlice.reducer;
