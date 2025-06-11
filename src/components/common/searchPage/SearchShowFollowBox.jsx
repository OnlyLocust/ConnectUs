import React from "react";
import Link from "next/link";
import { Eye, UserMinus, UserPlus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { followRecv } from "@/store/authSlice";
import { notify } from "@/lib/socket";
import { Button } from "@/components/ui/button";
import ShowAvatar from "../ShowAvatar";
import { API_URL } from "@/constants/constant";

const SearchShowFollowBox = ({ user }) => {
  const dispatch = useDispatch();

  const userId = useSelector((state) => state.auth.user._id);
  const meUserFollowing = useSelector((state) => state.auth.user.following);
  const isFollowing = meUserFollowing.includes(user._id);

  const followUser = async () => {
    try {
      const res = await axios.patch(`${API_URL}/follow/${user._id}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);

        const follow = res.data.follow;
        if (follow) {
          notify(user._id);
          await axios.post(
            `${API_URL}/notification/send/${user._id}`,
            { action: "follow" },
            { withCredentials: true }
          );
        }
        dispatch(followRecv({ follow, recvId: user._id }));
      } else {
        throw new Error(res.data.message || "Failed to follow / unfollow user");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch posts"
      );
    }
  };

  return (
    <div className="flex items-center px-4 hover:bg-gray-50/50 transition-colors rounded-lg">
      <div className="flex items-center flex-1 min-w-0 space-x-3">
        <ShowAvatar
          profilePicture={user.profilePicture}
          username={user.username}
          size={14}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h4 className="font-semibold truncate text-gray-900">
              {user.username}
            </h4>
          </div>
          <p className="text-sm text-gray-500 truncate">@{user.username}</p>
        </div>
      </div>

      <div className="flex space-x-2 ml-4">
        <Link
          href={`/home/user/profile/${user._id}`}
        >
          <Button variant="outline" size="sm" className="gap-1">
            <Eye className="h-4 w-4" />
            <span>Profile</span>
          </Button>
        </Link>
        {user._id == userId ? (
          <Button
            variant={"outline"}
            size="sm"
            className="gap-1"
            disable={"true"}
          >
            You
          </Button>
        ) : isFollowing ? (
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
    </div>
  );
};

export default SearchShowFollowBox;
