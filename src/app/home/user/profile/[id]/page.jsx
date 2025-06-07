"use client";

import { Button } from "@/components/ui/button";
import { UserMinus, UserPlus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PostsShow from "@/components/common/PostsShow";
import axios from "axios";
import { API_URL } from "@/constants/constant";
import { toast } from "sonner";
import { removeRecv, setFollower, setRecv } from "@/store/recvSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { followRecv } from "@/store/authSlice";
import Link from "next/link";
import Loading from "@/components/pages/Loading";
import { setRecvId } from "@/store/chatSlice";
import { useRouter } from "next/navigation";
import { notify } from "@/lib/socket";

const page = ({ params }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("Posts");

  useEffect(() => {
    const getUser = async () => {
      try {
        const { id } = await params;

        const res = await axios.get(`${API_URL}/get/${id}`, {
          withCredentials: true,
        });

        if (res.data.success) {
          dispatch(setRecv(res.data.user));
        } else {
          throw new Error(res.data.message || "Failed to fetch user");
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch user"
        );
      }
    };

    getUser();
    // Cleanup function to remove receiver when component unmounts

    return () => dispatch(removeRecv());
  }, []);

  const recv = useSelector((state) => state.recv.receiver);
  const userFollowing = useSelector((state) => state.auth.user.following);

  const isFollowing = userFollowing.includes(recv?._id);

  const followUser = async () => {
    try {
      const res = await axios.patch(`${API_URL}/follow/${recv._id}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);

        const follow = res.data.follow;
        if (follow) {
          notify(recv._id);
          await axios.post(
            `${API_URL}/notification/send/${recv._id}`,
            { action: "follow" },
            { withCredentials: true }
          );
        }

        dispatch(setFollower({ follow }));
        dispatch(followRecv({ follow, recvId: recv._id }));
      } else {
        throw new Error(res.data.message || "Failed to follow user");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch posts"
      );
    }
  };

  const startMessage = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/chat/addchat`,
        { recvId: recv._id },
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(setRecvId(recv._id));
        router.push("/home/chats");
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return recv ? (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex gap-15 items-center mb-10 bg-white shadow-md rounded-lg p-6  justify-around">
        {/* Profile Picture */}
        <Avatar className="w-32 h-32 border-4 border-primary">
          <AvatarImage src={recv?.profilePicture} alt="Profile" />
          <AvatarFallback>
            {recv?.username?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {/* Profile Info */}
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4 justify-between">
            <h2 className="text-2xl font-semibold">{recv?.username}</h2>
            {isFollowing ? (
              <Button
                variant="default"
                size="sm"
                className="gap-1 "
                onClick={followUser}
              >
                <UserMinus className="h-4 w-4" />
                <span>Unfollow</span>
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                className="gap-1 bg-blue-600 hover:bg-blue-700"
                onClick={followUser}
              >
                <UserPlus className="h-4 w-4" />
                <span>Follow</span>
              </Button>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-8 text-sm mb-4">
              <span>
                <strong>{recv.posts.length}</strong> posts
              </span>
              <span>
                <Link href={`/home/user/followers/${recv._id}`}>
                  <strong>{recv.followerCount}</strong> followers
                </Link>
              </span>
              <span>
                <Link href={`/home/user/following/${recv._id}`}>
                  <strong>{recv.followingCount}</strong> following
                </Link>
              </span>
            </div>

            <Button
              variant="secondary"
              className="cursor-pointer"
              onClick={startMessage}
            >
              Message
            </Button>
          </div>

          <div>
            <p className="font-semibold">{recv?.username}</p>
            <p className="text-sm text-muted-foreground">{recv?.bio}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-around mb-10 border-b border-gray-300 relative">
        {[
          ["Posts", recv?.posts?.length],
          ["Bookmarks", recv?.bookmarks?.length],
        ].map((tab) => (
          <button
            key={tab[0]}
            onClick={() => setSelectedTab(tab[0])}
            className={`relative px-4 py-2 text-base font-medium transition-all duration-300 ease-in-out 
      ${
        selectedTab === tab[0]
          ? "text-black font-bold"
          : "text-gray-500 hover:text-black"
      }`}
          >
            {tab[0]} {tab[1]}
            {/* Underline animation */}
            <div
              className={`absolute bottom-0 left-0 right-0 h-0.5 bg-black transition-all duration-300 ease-in-out 
          ${
            selectedTab === tab[0]
              ? "opacity-100 scale-x-100"
              : "opacity-0 scale-x-0"
          }`}
            />
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      <div
        key={selectedTab} // triggers re-animation on tab change
        className="transition-all duration-500 ease-in-out animate-fadeIn"
      >
        {selectedTab === "Posts" && <PostsShow posts={recv?.posts} />}
        {selectedTab === "Bookmarks" && <PostsShow posts={recv?.bookmarks} />}
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default page;

// 💬❤️
