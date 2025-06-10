import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const ShowAvatar = ({ profilePicture = "#", username = "", size = 7 ,isUser = false}) => {
  return (
    // <Avatar className={`w-${size} h-${size} border-2  ${isUser ? 'border-pink-500' : 'border-white'} shadow-sm`}>
    <Avatar className={`w-${size} h-${size} border-2  ${isUser ? 'border-pink-500' : ''} shadow-sm`}>
      <AvatarImage
        src={profilePicture }
        alt={username}
      />
      <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-medium">
        {username.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

export default ShowAvatar;
