import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useDispatch } from "react-redux";
import { deletePost } from "@/store/postSlice";
import axios from "axios";
import { API_URL } from "@/constants/constant";
import { toast } from "sonner";
import { followRecv, removePost } from "@/store/authSlice";
import Link from "next/link";
import { notify } from "@/lib/socket";

const Options = ({
  children,
  profilePicture,
  username,
  userId,
  id,
  postId,
  userFollowing,
}) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const isFollowing = userFollowing.includes(userId);


  const deletePostHandler = async () => {
    try {
      dispatch(deletePost({ postId }));
      dispatch(removePost({ postId }));
      setOpen(false);
      const res = await axios.delete(`${API_URL}/post/${postId}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        throw new Error(res.data.message || "Failed to delete post");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Login failed"
      );
    }
  };

  const followUser = async () => {
    try {
      const res = await axios.patch(`${API_URL}/follow/${userId}`, {
        withCredentials: true,
      });
      

      if (res.data.success) {
        toast.success(res.data.message);

        const follow = res.data.follow;
        if(follow){
          notify(userId)
          await axios.post(
          `${API_URL}/notification/send/${userId}`,
          { action: "follow" },
          { withCredentials: true }
        );
        }
        dispatch(followRecv({follow, recvId: userId}));
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-3 justify-center">
          <Avatar className="w-10 h-10">
            <AvatarImage src={profilePicture} alt={username} />
            <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">{username}</p>
          </div>
        </div>
        {/* <ScrollArea className="max-h-64 pr-4"> */}
        {/* {userId != id && <Button className="bg-blue-500">Follow</Button>} */}
        {userId != id && (
          isFollowing ? <Button variant='outline' onClick={followUser}>Following</Button> : <Button className="bg-blue-500 text-white hover:bg-blue-600" onClick={followUser}>Follow</Button>
        )}
        
        {userId == id && (
          <Button  className="bg-blue-500 hover:text-white text-white hover:bg-blue-600"><Link href='/home/user/profile' className="w-full">Go To Profile</Link></Button>
        )}
        {userId != id && (
          <Button className="bg-black text-white hover:text-white hover:bg-black"><Link href={`/home/user/profile/${userId}`} className="w-full">View Profile</Link></Button>
        )}
        {userId == id && (
          <Button className="bg-red-500 text-white hover:bg-red-600" onClick={deletePostHandler}>
            Delete
          </Button>
        )}
        {/* </ScrollArea> */}
      </DialogContent>
    </Dialog>
  );
};

export default Options;
