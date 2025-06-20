import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreVertical } from "lucide-react";
import React from "react";
import ShowAvatar from "../ShowAvatar";

const ChatHeader = ({ activeChat, chatUsers, onBack }) => {
  const chatUser = chatUsers.find((c) => c._id === activeChat);

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-2">
        {/* Back Button only on mobile */}
        <button
          onClick={onBack}
          className="md:hidden mr-3 p-1"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <ShowAvatar
          profilePicture={chatUser.member.profilePicture}
          username={chatUser.member.username}
          size={10}
          className="mx-3"
        />
        <div>
          <h3 className="font-medium">{chatUser?.member.username}</h3>
          <p className="text-xs text-gray-500">
            {chatUser?.member.online ? "Online" : "Offline"}
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
