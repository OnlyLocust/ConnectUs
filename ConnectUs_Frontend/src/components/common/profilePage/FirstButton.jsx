"use client";
import { Button } from "@/components/ui/button";
import { followRecv } from "@/store/authSlice";
import { setFollower } from "@/store/recvSlice";
import axios from "axios";
import { UserMinus, UserPlus } from "lucide-react";
import Link from "next/link";
import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { API_URL } from "@/constants/constant";

const FirstButton = ({ userId, id }) => {
  const dispatch = useDispatch();
  const [followLoading, setFollowLoading] = React.useState(false);
  const userFollowing = useSelector(
    (state) => state.auth.user?.following ?? []
  );
  const isFollowing = useMemo(
    () => userFollowing.includes(id),
    [userFollowing, id]
  );

  const followUser = useCallback(async () => {
    if (followLoading) return;
    setFollowLoading(true);

    const follow = !isFollowing;
    
    // Instant optimistic update
    dispatch(setFollower({ follow }));
    dispatch(followRecv({ follow, recvId: id }));

    try {
      const res = await axios.patch(
        `${API_URL}/follow/${id}`,
        {},
        { withCredentials: true }
      );

      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to follow user");
      }

      toast.success(res.data.message);

    } catch (error) {
      // Rollback on error
      dispatch(setFollower({ follow: isFollowing }));
      dispatch(followRecv({ follow: isFollowing, recvId: id }));

      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Failed to follow user"
      );
    } finally {
      setFollowLoading(false);
    }
  }, [dispatch, id, isFollowing, followLoading]);

  if (userId === id) {
    return (
      <Link href="/home/edit/profile">
        <Button variant="outline" className="cursor-pointer">
          Edit Profile
        </Button>
      </Link>
    );
  }

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
