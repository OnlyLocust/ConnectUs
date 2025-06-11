"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PostsShow from "@/components/common/PostsShow";
import axios from "axios";
import { toast } from "sonner";
import { removeRecv, setRecv } from "@/store/recvSlice";
import Loading from "@/components/common/Loading";
import PostTab from "@/components/common/profilePage/PostTab";
import FollowDetails from "@/components/common/profilePage/FollowDetails";
import SecondButton from "@/components/common/profilePage/SecondButton";
import FirstButton from "@/components/common/profilePage/FirstButton";
import { useParams } from "next/navigation";
import ShowAvatar from "../common/ShowAvatar";
import { API_URL } from "@/constants/constant";

const ProfilePage = () => {
  const params = useParams();
  const id = params.id;
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user._id);
  const [selectedTab, setSelectedTab] = useState("Posts");
  const recv = useSelector((state) => state.recv.receiver);

  useEffect(() => {
    const getUser = async () => {
      try {
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

    return () => dispatch(removeRecv());
  }, []);

  return recv ? (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex gap-15 items-center mb-10 bg-white shadow-md rounded-lg p-6 justify-around">
        <div className="h-32 w-32">
          <ShowAvatar
          profilePicture={recv.profilePicture}
          username={recv.username}
          size={32}
        />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4 justify-between">
            <h2 className="text-2xl font-semibold">{recv?.username}</h2>

            <FirstButton userId={userId} id={id} />
          </div>
          <div className="flex items-center justify-between">
            <FollowDetails
              postLength={recv?.posts.length}
              followerCount={recv?.followerCount}
              followingCount={recv?.followingCount}
              userId={id}
            />

            <SecondButton userId={userId} id={id} />
          </div>

          <div>
            {/* <p className="font-semibold">{recv?.username}</p> */}
            <p className="text-sm text-muted-foreground">{recv?.bio}</p>
          </div>
        </div>
      </div>

      <PostTab
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        postLength={recv?.posts?.length}
        bookmarkLength={recv?.bookmarks?.length}
      />

      <div
        key={selectedTab}
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

export default ProfilePage;
