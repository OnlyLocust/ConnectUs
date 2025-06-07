"use client";

import React, { useState } from "react";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Heart,
  MessageCircle,
  Send,
  MoreHorizontal,
  Loader2Icon,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { FaHeart, FaRegBookmark, FaBookmark } from "react-icons/fa";
import { toast } from "sonner";
import { API_URL } from "@/constants/constant";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import Comments from "./Comments";
import { removePostComment, setPostComment, setPostLike } from "@/store/postSlice";
import { setPostBookmark } from "@/store/authSlice";
import Options from "./Options";
import { Badge } from "../ui/badge";
import { removeRecvOnePostComment, setRecvOnePostComment, setRecvOnePostLike } from "@/store/recvSlice";

const PostCard = ({ post, type }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [isLoading, setIsLoading] = useState(false);
  const [comment, setComment] = useState("");

  const isBookmarked = user?.bookmarks.some(
    (bookmark) => bookmark._id == post._id
  );

  const isLiked = post.likes.includes(user._id);
  const likeCount = post.likes.length;

  const commentHandler = async (e) => {
    setComment(e.target.value);
  };

  const bookmarkPost = async () => {
    dispatch(
      setPostBookmark({
        postId: post._id,
        doBookmark: !isBookmarked,
        image: post.image,
        likeCount,
        commentCount: post.comments.length,
      })
    );

    try {
      const res = await axios.patch(`${API_URL}/post/bookmark/${post._id}`, {
        withCredentials: true,
      });

      if (!res.data.success) {
        throw new Error(res.data.message);
      }
    } catch (error) {
      dispatch(
        setPostBookmark({
          postId: post._id,
          doBookmark: !isBookmarked,
          image: post.image,
          likeCount,
          commentCount: post.comments.length,
        })
      );
      toast.error("BoookMark Failed");
    }
  };

  const likePost = async () => {
    if (type === "single") {
      dispatch(setRecvOnePostLike({ doLike: !isLiked, userId: user._id }));
    } else
      dispatch(
        setPostLike({
          postId: post._id,
          doLike: !isLiked,
          userId: user._id,
        })
      );

    try {
      const res = await axios.patch(
        `${API_URL}/post/like/${post._id}`,
        { like: isLiked ? "unlike" : "like" },
        { withCredentials: true }
      );

      if (!res.data.success) {
        throw new Error("Post Like Failed");
      }
    } catch (error) {
      if (type === "single") {
        dispatch(setRecvOnePostLike({ doLike: !isLiked, userId: user._id }));
      } else
        dispatch(
          setPostLike({
            postId: post._id,
            doLike: !isLiked,
            userId: user._id,
          })
        );
      toast.error("Post Like Failed");
      // toast.error(
      //   error.message ||
      //     error.data.message ||
      //     error ||
      //     "Something went wrong while commenting"
      // );
    }
  };

  const commentPost = async () => {
    if (!comment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    
    if (type == "single") {
      dispatch(
        setRecvOnePostComment({
          username: user.username,
          text: comment,
          postId: post._id,
        })
      );
    } else {
      dispatch(
        setPostComment({
          username: user.username,
          text: comment,
          postId: post._id,
        })
      );
    }
    setIsLoading(true);
    try {
      const res = await axios.patch(
        `${API_URL}/post/comment/${post._id}`,
        { text: comment },
        { withCredentials: true }
      );
      setComment("");

      if (!res.data.success) {
        throw new Error(res.data.message);
      }
    } catch (error) {
      if (type === "single") {
      dispatch(
        removeRecvOnePostComment()
      );
    } else {
      dispatch(
        removePostComment({
          postId: post._id,
        })
      );
    }
      toast.error("Error posting a comment");
    } finally {
      setIsLoading(false);
    }
  };

  return (  
    <Card className="w-full max-w-xl mx-auto rounded-lg shadow-sm border border-gray-100 mb-6 p-3">
      {/* Top section - Profile */}
      <div className="flex items-center justify-between px-3 py-1">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage
              src={post.author.profilePicture || "/avatar.jpg"}
              alt={post.author.username}
            />
            <AvatarFallback>
              {post.author.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">
              {post.author.username}{" "}
              {post.author._id == user._id && (
                <Badge variant="secondary">author</Badge>
              )}
            </p>
            <p className="text-xs text-gray-500">
              {post.location || "Somewhere on Earth"} •{" "}
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>

        <Options
          username={post.author.username}
          profilePicture={post.author.profilePicture}
          userId={post.author._id}
          id={user._id}
          postId={post._id}
          userFollowing={user?.following}
        >
          <button className="text-gray-500 hover:text-gray-700 cursor-pointer hover:scale-105">
            <MoreHorizontal size={20} />
          </button>
        </Options>
      </div>

      {/* Image */}
      <div className="w-full bg-gray-50">
        <img
          src={
            post.image ||
            "https://tse4.mm.bing.net/th?id=OIP.mnLRlJTIlYQ6VN-WchekugHaHa&pid=Api&P=0&h=180"
          }
          alt={post.caption || "Post image"}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Actions */}
      <div className="px-3">
        <div className="flex justify-between items-center mb-2">
          <div className="flex gap-4">
            <button
              className="flex items-center gap-1 cursor-pointer"
              onClick={likePost}
            >
              {isLiked ? (
                <FaHeart className="w-5 h-5 text-red-500" />
              ) : (
                <Heart className="w-5 h-5" />
              )}
              <span className="text-sm">{likeCount}</span>
            </button>
            <Comments comments={post.comments}>
              <button className="flex items-center gap-1 cursor-pointer">
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm">{post.comments.length}</span>
              </button>
            </Comments>

            <button className="flex items-center gap-1">
              <Send className="w-5 h-5" />
              <span className="text-sm">87</span>
            </button>
          </div>

          <button onClick={bookmarkPost} className="cursor-pointer">
            {isBookmarked ? (
              <FaBookmark className="w-5 h-5 text-gray-800" />
            ) : (
              <FaRegBookmark className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Caption */}
        <div className="mb-1">
          <p className="text-sm">
            <span className="font-semibold mr-2">{post.author.username}</span>
            {post.caption}
          </p>
        </div>

        {/* Comments preview */}
        <Comments comments={post.comments}>
          {post.comments.length > 0 && (
            <button className="text-sm text-gray-500 mb-1 cursor-pointer">
              View all {post.comments.length} comments
            </button>
          )}
        </Comments>

        {/* Timestamp */}
        <p className="text-xs text-gray-400 uppercase mt-2">
          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
        </p>
      </div>

      {/* Add comment */}
      <div className="border-t border-gray-100 p-3">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Add a comment..."
            className="text-sm w-full focus:outline-none"
            value={comment}
            onChange={commentHandler}
          />
          <button
            className="text-blue-500 font-semibold text-sm ml-auto cursor-pointer"
            onClick={commentPost}
          >
            {isLoading ? (
              <Loader2Icon className="animate-spin h-5 w-5" />
            ) : (
              "Post"
            )}
          </button>
        </div>
      </div>
    </Card>
  );
};

export default PostCard;
