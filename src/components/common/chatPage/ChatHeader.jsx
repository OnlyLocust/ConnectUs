import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import React from "react";

const ChatHeader = ({activeChat, chatUsers}) => {

  const chatUser = chatUsers.find((c) => c._id === activeChat)

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage
            src={chatUser?.member.profilePicture}
          />
          <AvatarFallback>
            {chatUser?.member.username.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">
            {chatUser?.member.username}
          </h3>
          <p className="text-xs text-gray-500">
            {chatUser?.member.online
              ? "Online"
              : "Offline"}
          </p>
        </div>
      </div>
      <Button variant="ghost" size="icon">
        <MoreVertical className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default ChatHeader;
