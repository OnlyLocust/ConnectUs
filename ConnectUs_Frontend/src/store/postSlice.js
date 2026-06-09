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
      const existingIds = new Set(state.posts.map((p) => p._id));
      const newPosts = action.payload.filter((p) => !existingIds.has(p._id));
      state.posts = [...state.posts, ...newPosts];
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
    reconcilePosts: (state, action) => {
      const latestPosts = action.payload;
      if (!latestPosts || latestPosts.length === 0) return;

      const existingPosts = state.posts;
      const latestMap = new Map(latestPosts.map((p) => [p._id, p]));

      // Determine timestamp bounds of the fetched batch
      const timestamps = latestPosts.map((p) => new Date(p.createdAt).getTime());
      const newestTime = Math.max(...timestamps);
      const oldestTime = Math.min(...timestamps);

      const updatedPosts = [];

      // Prepend any new posts from the payload that are newer than our newest existing post
      const newestExistingTime = existingPosts.length > 0
        ? new Date(existingPosts[0].createdAt).getTime()
        : 0;

      const newerPosts = latestPosts.filter((p) => new Date(p.createdAt).getTime() > newestExistingTime);
      updatedPosts.push(...newerPosts);

      // Reconcile existing posts
      for (const existingPost of existingPosts) {
        const postTime = new Date(existingPost.createdAt).getTime();
        if (latestMap.has(existingPost._id)) {
          const serverPost = latestMap.get(existingPost._id);
          
          // Preserve client-side optimistic comments
          const optimisticComments = existingPost.comments.filter((c) => c.optimisticId && !c._id);
          const mergedComments = [...serverPost.comments];
          
          optimisticComments.forEach((opt) => {
            if (!mergedComments.some((c) => c.optimisticId === opt.optimisticId || c.text === opt.text)) {
              mergedComments.push(opt);
            }
          });

          updatedPosts.push({
            ...serverPost,
            comments: mergedComments,
          });
        } else {
          // If the post falls within the fetched timeframe but is missing, it was deleted on the server
          const wasDeleted = postTime >= oldestTime && postTime <= newestTime;
          if (!wasDeleted) {
            updatedPosts.push(existingPost);
          }
        }
      }

      // Sort posts by createdAt descending
      updatedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Deduplicate by ID
      const seenIds = new Set();
      state.posts = updatedPosts.filter((p) => {
        if (seenIds.has(p._id)) return false;
        seenIds.add(p._id);
        return true;
      });
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
  reconcilePosts,
} = postSlice.actions;
export default postSlice.reducer;
