import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreVertical } from "lucide-react";
import React from "react";
import ShowAvatar from "../ShowAvatar";
import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";

const ChatHeader = ({ activeChat, chatUsers, onBack }) => {
  const typingUsers = useSelector((state) => state.chat.typingUsers || {});
  const chatUser = chatUsers.find((c) => c._id === activeChat);

  if (!chatUser?.member) {
    return (
      <div className="flex items-center p-4 border-b">
        <button onClick={onBack} className="md:hidden mr-3 p-1" type="button">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <p className="text-sm text-muted-foreground">Chat unavailable</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 border-b shrink-0">
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={onBack}
          className="md:hidden mr-1 p-1 shrink-0"
          type="button"
          aria-label="Back to chats"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <ShowAvatar
          profilePicture={chatUser.member.profilePicture}
          username={chatUser.member.username}
          size={10}
          className="mx-1"
        />
        <div className="min-w-0">
          <h3 className="font-medium truncate">{chatUser.member.username}</h3>
          <p className="text-xs text-muted-foreground">
            {typingUsers[chatUser.member._id] ? (
              <span className="text-green-500 font-semibold animate-pulse">typing...</span>
            ) : chatUser.member.online ? (
              "Online"
            ) : chatUser.member.lastSeen ? (
              (() => {
                try {
                  return `Last active ${formatDistanceToNow(new Date(chatUser.member.lastSeen), { addSuffix: true })}`;
                } catch (e) {
                  return "Offline";
                }
              })()
            ) : (
              "Offline"
            )}
          </p>
        </div>
      </div>
      <Button variant="ghost" size="icon" type="button" aria-label="More options">
        <MoreVertical className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default ChatHeader;
