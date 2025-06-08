import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";

const ProfileHeader = ({isLoading,image,submitPost}) => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="flex items-center justify-between pb-4 border-b">
      <div className="flex items-center space-x-3">
        <Avatar className="w-10 h-10 border-2 border-pink-500">
          <AvatarImage src={user?.profilePicture} />
          <AvatarFallback>
            {user?.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{user.username}</p>
          <p className="text-xs text-gray-500">Post to your profile</p>
        </div>
      </div>
      <Button
        variant="ghost"
        className="text-blue-500 hover:text-blue-700"
        onClick={submitPost}
        disabled={isLoading || !image}
      >
        {isLoading ? <Loader2Icon className="animate-spin h-5 w-5" /> : "Share"}
      </Button>
    </div>
  );
};

export default ProfileHeader;
