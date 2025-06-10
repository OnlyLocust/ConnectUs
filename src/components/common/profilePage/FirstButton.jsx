"use client";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/constants/constant";
import { notify } from "@/lib/socket";
import { followRecv } from "@/store/authSlice";
import { setFollower } from "@/store/recvSlice";
import axios from "axios";
import { UserMinus, UserPlus } from "lucide-react";
import Link from "next/link";
import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const FirstButton = ({ userId, id }) => {
  const dispatch = useDispatch();


  if (userId === id) {
    return (
      <Link href="/home/edit/profile">
        <Button variant="outline" className="cursor-pointer">
          Edit Profile
        </Button>
      </Link>
    );
  }


  const userFollowing = useSelector((state) => state.auth.user.following);
  const isFollowing = useMemo(() => userFollowing.includes(id), [userFollowing, id]);

  const followUser = useCallback(async () => {

    try {
      const res = await axios.patch(`${API_URL}/follow/${id}`, {}, { withCredentials: true });

      if (res.data.success) {
        toast.success(res.data.message);

        const follow = res.data.follow;
        if (follow) {
          notify(id);
          await axios.post(
            `${API_URL}/notification/send/${id}`,
            { action: "follow" },
            { withCredentials: true }
          );
        }

        dispatch(setFollower({ follow }));
        dispatch(followRecv({ follow, recvId: id }));
      } else {
        throw new Error(res.data.message || "Failed to follow user");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Failed to follow user"
      );
    }
  }, [dispatch, id]);

  return isFollowing ? (
    <Button variant="default" size="sm" className="gap-1" onClick={followUser}>
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
  );
};

export default FirstButton;
