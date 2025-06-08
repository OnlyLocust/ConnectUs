import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";

const ProfilePicture = ({profilePicture, username}) => {
  return (
    <Avatar className="w-32 h-32 border-4 border-primary">
      <AvatarImage src={profilePicture || '#'} alt="Profile" />
      <AvatarFallback>{username?.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
};

export default ProfilePicture;
