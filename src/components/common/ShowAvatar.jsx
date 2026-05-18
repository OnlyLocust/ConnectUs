import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";

const SIZE_MAP = {
  6: "w-6 h-6",
  7: "w-7 h-7",
  8: "w-8 h-8",
  10: "w-10 h-10",
  12: "w-12 h-12",
  14: "w-14 h-14",
  16: "w-16 h-16",
  20: "w-20 h-20",
  24: "w-24 h-24",
  32: "w-32 h-32",
};

const ShowAvatar = ({
  profilePicture = "#",
  username = "",
  size = 8,
  isUser = false,
  className,
}) => {
  const sizeClass = SIZE_MAP[size] ?? SIZE_MAP[8];
  const initial = username?.charAt(0)?.toUpperCase() || "?";

  return (
    <Avatar
      className={cn(
        sizeClass,
        "border-2 shadow-sm shrink-0",
        isUser ? "border-pink-500" : "border-transparent",
        className
      )}
    >
      <AvatarImage src={profilePicture} alt={username} />
      <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-medium">
        {initial}
      </AvatarFallback>
    </Avatar>
  );
};

export default ShowAvatar;
