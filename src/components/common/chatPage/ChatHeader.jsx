import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import React from "react";
import ShowAvatar from "../ShowAvatar";

const ChatHeader = ({activeChat, chatUsers}) => {

  const chatUser = chatUsers.find((c) => c._id === activeChat)

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center">
        <ShowAvatar profilePicture={chatUser.member.profilePicture} username={chatUser.member.username} size={10} className='mr-3'/>
        <div className="ml-3">
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
