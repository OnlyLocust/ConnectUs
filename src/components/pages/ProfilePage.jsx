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
import { formatDistanceToNow } from "date-fns";
import { joinProfileRoom, leaveProfileRoom } from "@/lib/socket";

const ProfilePage = () => {
  const params = useParams();
  const id = params.id;
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user?._id);
  const [selectedTab, setSelectedTab] = useState("Posts");
  const recv = useSelector((state) => state.recv.receiver);
  const [isMobileView, setMobileView] = useState(false);

  useEffect(() => {
    if (id) {
      joinProfileRoom(id);
      return () => {
        leaveProfileRoom(id);
      };
    }
  }, [id]);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setMobileView(true);
    }
  }, []);

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
  }, [dispatch, id]);

  return recv ? (
    <div className="max-w-4xl mx-auto p-2 sm:p-6">

      <div className="flex flex-col sm:flex-row items-center mb-10 bg-card text-card-foreground border border-border shadow-md rounded-lg p-4 md:p-6 gap-4 sm:gap-10">
        <div className="flex flex-row flex-1 gap-4 sm:gap-6 items-center w-full">

          <div className="flex-shrink-0">
            <ShowAvatar
              profilePicture={recv.profilePicture}
              username={recv.username}
              size={isMobileView ? 20 : 32}
              isUser
            />
          </div>


          <div className="flex-1 w-full text-left">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl md:text-2xl font-semibold">
                {recv?.username || "some one"}
              </h2>
              {recv?.online && (
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
              )}
            </div>
            <div className="mb-2">
              {recv?.online ? (
                <span className="text-xs font-semibold text-green-500 animate-pulse">Online</span>
              ) : recv?.lastSeen ? (
                <span className="text-xs text-muted-foreground">
                  {(() => {
                    try {
                      return `Last active ${formatDistanceToNow(new Date(recv.lastSeen), { addSuffix: true })}`;
                    } catch (e) {
                      return "Offline";
                    }
                  })()}
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">Offline</span>
              )}
            </div>
            <div className="">
              <FollowDetails
                postLength={recv?.posts.length || 0}
                followerCount={recv?.followerCount || 0}
                followingCount={recv?.followingCount || 0}
                userId={id}
              />
            </div>
            <p className="text-sm text-muted-foreground">{recv?.bio || ""}</p>
          </div>
        </div>


        <div className="flex sm:flex-col gap-3 sm:gap-4 w-full sm:w-auto justify-around">
          <FirstButton userId={userId} id={id} />
          <SecondButton userId={userId} id={id} />
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
