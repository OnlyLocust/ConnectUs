"use client";

import profile from "./../../../public/profile.png";

import React, { useState, useCallback, useMemo, memo } from "react";
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
import {
  removeRecvOnePostComment,
  setRecvOnePostComment,
  setRecvOnePostLike,
} from "@/store/recvSlice";
import Options from "./PostCard/Options";
import { Badge } from "../ui/badge";
import { notify } from "@/lib/socket";
import ShowAvatar from "./ShowAvatar";
import PostImage from "./PostCard/PostImage";
import CommentInput from "./PostCard/CommentInput";
import dotenv from 'dotenv'
dotenv.config()
const API_URL = process.env.API_URL

const PostCard = ({ post, type }) => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const [comment, setComment] = useState("");

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

  const isLiked = useMemo(() => likes.includes(user._id), [likes, user._id]);
  const likeCount = likes.length;
  const isBookmarked = useMemo(
    () => user.bookmarks.some((bookmark) => bookmark._id === postId),
    [user.bookmarks, postId]
  );

  const commentHandler = useCallback((e) => {
    setComment(e.target.value);
  }, []);

  const bookmarkPost = useCallback(async () => {
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
    }
  }, [dispatch, isBookmarked, postId, image, likeCount, comments.length]);

  const likePost = useCallback(async () => {
    const actionPayload = { doLike: !isLiked, userId: user._id };
    const postActionPayload = { postId, ...actionPayload };

    if (type === "single") {
      dispatch(setRecvOnePostLike(actionPayload));
    } else {
      dispatch(setPostLike(postActionPayload));
    }

    try {
      const res = await axios.patch(
        `${API_URL}/post/like/${postId}`,
        { like: isLiked ? "unlike" : "like" },
        { withCredentials: true }
      );
      if (!res.data.success) throw new Error("Post Like Failed");
      else {
        if (!isLiked && authorId !== user._id) {
          notify(authorId);
          await axios.post(
            `${API_URL}/notification/send/${authorId}`,
            { action: "like" },
            { withCredentials: true }
          );
        }
      }
    } catch (error) {
      type === "single"
        ? dispatch(setRecvOnePostLike({ ...actionPayload, doLike: isLiked }))
        : dispatch(setPostLike({ ...postActionPayload, doLike: isLiked }));
      toast.error("Post Like Failed");
    }
  }, [dispatch, isLiked, postId, type, user._id]);

  const commentPost = useCallback(async () => {
    if (!comment.trim()) return toast.error("Comment cannot be empty");

    const payload = {
      username: user.username,
      text: comment,
      postId,
    };

    type === "single"
      ? dispatch(setRecvOnePostComment(payload))
      : dispatch(setPostComment(payload));

    try {
      const res = await axios.patch(
        `${API_URL}/post/comment/${postId}`,
        { text: comment },
        { withCredentials: true }
      );
      if (!res.data.success) throw new Error(res.data.message);
      else {
        if (authorId !== user._id) {
          notify(authorId);
          await axios.post(
            `${API_URL}/notification/send/${authorId}`,
            { action: "comment" },
            { withCredentials: true }
          );
        }
      }

      setComment("");
    } catch (error) {
      type === "single"
        ? dispatch(removeRecvOnePostComment())
        : dispatch(removePostComment({ postId }));
      toast.error("Error posting a comment");
    }
  }, [comment, dispatch, postId, type, user.username]);

  const sendPost = useCallback(() => {
    toast.error("This feature unavailable");
  }, []);

  const formattedDate = useMemo(
    () => formatDistanceToNow(new Date(createdAt)),
    [createdAt]
  );

  return (
    <Card className="w-full max-w-xl mx-auto rounded-lg shadow-sm border border-gray-100 mb-6 p-3">
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
              {authorId === user._id && (
                <Badge variant="secondary">author</Badge>
              )}
            </p>
            <p className="text-xs text-gray-500">
              {location || "Somewhere on Earth"} • {formattedDate}
            </p>
          </div>
        </div>

        <Options
          username={username}
          profilePicture={profilePicture}
          userId={authorId}
          id={user._id}
          postId={postId}
          userFollowing={user.following}
        >
          <button className="text-gray-500 hover:text-gray-700 hover:scale-105">
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

            <button className="flex items-center gap-1" aria-label="Comments">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">{comments.length}</span>
            </button>

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
              <FaBookmark className="w-5 h-5 text-gray-800" />
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
            <button className="text-sm text-gray-500 mb-1 cursor-pointer">
              View all {comments.length} comments
            </button>
          </Comments>
        )}

        {/* Timestamp */}
        <p className="text-xs text-gray-400 uppercase mt-2">{formattedDate}</p>
      </div>

      <CommentInput
        comment={comment}
        commentHandler={commentHandler}
        commentPost={commentPost}
      />
    </Card>
  );
};

export default memo(PostCard);
