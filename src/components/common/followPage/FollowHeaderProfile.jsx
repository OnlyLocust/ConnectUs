import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";

const FollowHeaderProfile = ({profilePicture, username, userId, id, followType}) => {
  return (
      <div className="flex gap-4 items-center justify-center">
        <Avatar className="h-10 w-10">
          <AvatarImage src={profilePicture} alt={username} />
          <AvatarFallback>
            {username?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-semibold">
          {userId == id ? "Your" : `${username}'s`}{" "}
          {followType == "followers" ? "followers" : "following"}
        </h1>
      </div>

  );
};

export default FollowHeaderProfile;
