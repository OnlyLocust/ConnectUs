"use client";
import React, { memo, useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { API_URL } from "@/constants/constant";
import { setSuggestions } from "@/store/authSlice";
import { toast } from "sonner";
import Link from "next/link";
import SuggestUser from "../common/RightSideBar/SuggestUser";

const RightSideBar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const suggestions = useSelector((state) => state.auth.suggestions);

  useEffect(() => {
    const getSuggestions = async () => {
      try {
        const res = await axios.get(`${API_URL}/user/suggestion`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSuggestions(res.data.suggestions));
        } else {
          throw new Error("Failed to fetch suggestions");
        }
      } catch (error) {
        dispatch(setSuggestions([]));
      }
    };

    getSuggestions();
  }, []);

  const seeAllHandler = useCallback(() => {
    toast.success("Coming Soon! This feature is under development.");
  }, []);

  return (
    <aside className="w-[300px] hidden lg:block p-6 fixed right-0 top-0 h-screen overflow-y-auto">
      <Link
        href={`/home/user/profile/${user._id}`} 
        className="flex justify-between items-center mb-8 pt-4 cursor-pointer"
      >
        <SuggestUser
          profilePicture={user?.profilePicture}
          username={user?.username}
          isUser={true}
        />
      </Link>

      {/* Suggestions Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm font-semibold text-gray-500">
            Suggestions For You
          </p>
          <button
            className="text-xs font-semibold text-gray-900 hover:text-gray-700"
            onClick={seeAllHandler}
          >
            See All
          </button>
        </div>

        {/* <ScrollArea className="h-[calc(100vh-220px)] pr-2"> */}
        {suggestions?.map((suggest) => (
          <Link
            href={`/home/user/profile/${suggest?._id}`}
            key={suggest._id}
            className="flex justify-between items-center mb-4 hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-pointer"
          >
            <SuggestUser
              profilePicture={suggest?.profilePicture}
              username={suggest?.username}
              isUser={false}
            />
          </Link>
        ))}
      </div>
    </aside>
  );
};

// export default RightSideBar;
export default memo(RightSideBar);
