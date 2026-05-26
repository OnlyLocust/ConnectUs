"use client";
import React, { useState, useCallback, useMemo, memo, useEffect } from "react";
import { Card } from "../ui/card";
import { Heart, MessageCircle, Send, MoreHorizontal } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { FaHeart, FaRegBookmark, FaBookmark } from "react-icons/fa";
import { toast } from "sonner";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import Comments from "./PostCard/Comments";
import {
  removePostComment,
  setPostComment,
  setPostLike,
} from "@/store/postSlice";
import { setPostBookmark } from "@/store/authSlice";
import Options from "./PostCard/Options";
import { Badge } from "../ui/badge";
import ShowAvatar from "./ShowAvatar";
import PostImage from "./PostCard/PostImage";
import CommentInput from "./PostCard/CommentInput";
import { API_URL } from "@/constants/constant";
import { joinPostRoom, leavePostRoom } from "@/lib/socket";

const PostCard = ({ post, type }) => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const [likeLoading, setLikeLoading] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const {
    _id: postId,
    image,
    caption,
    createdAt,
    comments,
    likes,
    author: { username, profilePicture, _id: authorId },
    location,
  } = post;

  const userId = user?._id;

  useEffect(() => {
    if (postId) {
      joinPostRoom(postId);
      return () => {
        leavePostRoom(postId);
      };
    }
  }, [postId]);
  const isLiked = useMemo(
    () => (userId ? likes.includes(userId) : false),
    [likes, userId]
  );
  const likeCount = likes.length;
  const isBookmarked = useMemo(
    () =>
      user?.bookmarks?.some((bookmark) => bookmark._id === postId) ?? false,
    [user?.bookmarks, postId]
  );

  const bookmarkPost = useCallback(async () => {
    if (bookmarkLoading) return;
    setBookmarkLoading(true);

    const actionPayload = {
      postId,
      doBookmark: !isBookmarked,
      image,
      likeCount,
      commentCount: comments.length,
    };

    dispatch(setPostBookmark(actionPayload));

    try {
      const res = await axios.patch(
        `${API_URL}/post/bookmark/${postId}`,
        {},
        { withCredentials: true }
      );
      if (!res.data.success) throw new Error(res.data.message);
    } catch (error) {
      dispatch(
        setPostBookmark({
          ...actionPayload,
          doBookmark: isBookmarked,
        })
      );
      toast.error("Bookmark Failed");
    } finally {
      setBookmarkLoading(false);
    }
  }, [dispatch, isBookmarked, postId, image, likeCount, comments.length, bookmarkLoading]);

  const likePost = useCallback(async () => {
    if (likeLoading) return;
    setLikeLoading(true);

    const actionPayload = { doLike: !isLiked, userId };
    const postActionPayload = { postId, ...actionPayload };

    dispatch(setPostLike(postActionPayload));

    try {
      const res = await axios.patch(
        `${API_URL}/post/like/${postId}`,
        { like: isLiked ? "unlike" : "like" },
        { withCredentials: true }
      );
      if (!res.data.success) throw new Error("Post Like Failed");
    } catch (error) {
      dispatch(setPostLike({ ...postActionPayload, doLike: isLiked }));
      toast.error("Post Like Failed");
    } finally {
      setLikeLoading(false);
    }
  }, [dispatch, isLiked, postId, userId, likeLoading]);

  const commentPost = useCallback(async (commentText) => {
    if (!commentText || !commentText.trim()) return toast.error("Comment cannot be empty");

    const optimisticId = `opt-comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const payload = {
      username: user?.username ?? "",
      text: commentText,
      postId,
      optimisticId,
    };

    dispatch(setPostComment(payload));
    try {
      const res = await axios.patch(
        `${API_URL}/post/comment/${postId}`,
        { text: payload.text, optimisticId },
        { withCredentials: true }
      );
      if (!res.data.success) throw new Error(res.data.message);
    } catch (error) {
      dispatch(removePostComment({ postId, optimisticId }));
      toast.error("Error posting a comment");
    }
  }, [dispatch, postId, user?.username]);

  const sendPost = useCallback(() => {
    toast.error("This feature unavailable");
  }, []);

  const formattedDate = useMemo(
    () => formatDistanceToNow(new Date(createdAt)),
    [createdAt]
  );

  return (
    <Card className="w-full max-w-xl mx-auto rounded-lg shadow-sm border border-border mb-6 p-3">
      <div className="flex items-center justify-between px-3 py-1">
        <div className="flex items-center gap-3">
          <ShowAvatar
            username={username}
            profilePicture={profilePicture}
            size={10}
          />
          <div>
            <p className="text-sm font-semibold">
              {username}{" "}
              {authorId === userId && (
                <Badge variant="secondary">author</Badge>
              )}
            </p>
            <p className="text-xs text-muted-foreground">
              {location || "Somewhere on Earth"} • {formattedDate}
            </p>
          </div>
        </div>

        <Options
          username={username}
          profilePicture={profilePicture}
          userId={authorId}
          id={userId}
          postId={postId}
          userFollowing={user?.following ?? []}
        >
          <button className="text-muted-foreground hover:text-foreground hover:scale-105">
            <MoreHorizontal size={20} />
          </button>
        </Options>
      </div>

      <PostImage image={image} caption={caption} />

      <div className="px-3">
        <div className="flex justify-between items-center mb-2">
          <div className="flex gap-4">
            <button
              className="flex items-center gap-1"
              onClick={likePost}
              aria-label={isLiked ? "Unlike post" : "Like post"}
            >
              {isLiked ? (
                <FaHeart className="w-5 h-5 text-red-500" />
              ) : (
                <Heart className="w-5 h-5" />
              )}
              <span className="text-sm">{likeCount}</span>
            </button>

            <Comments comments={comments}>
              <button
                type="button"
                className="flex items-center gap-1"
                aria-label="Comments"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm">{comments.length}</span>
              </button>
            </Comments>

            <button
              className="flex items-center gap-1 cursor-pointer"
              aria-label="Share"
              onClick={sendPost}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={bookmarkPost}
            aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            {isBookmarked ? (
              <FaBookmark className="w-5 h-5 text-foreground" />
            ) : (
              <FaRegBookmark className="w-5 h-5" />
            )}
          </button>
        </div>

        <p className="text-sm mb-1">
          <span className="font-semibold mr-2">{username}</span>
          {caption}
        </p>

        {comments.length > 0 && (
          <Comments comments={comments}>
            <button className="text-sm text-muted-foreground mb-1 cursor-pointer">
              View all {comments.length} comments
            </button>
          </Comments>
        )}

        {/* Timestamp */}
        <p className="text-xs text-muted-foreground uppercase mt-2">{formattedDate}</p>
      </div>

      <CommentInput
        commentPost={commentPost}
      />
    </Card>
  );
};

export default memo(PostCard);
