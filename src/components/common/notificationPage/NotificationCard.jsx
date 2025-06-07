import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import React from "react";

const NotificationCard = ({notification , getNotificationIcon}) => {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 pt-1">
        {getNotificationIcon(notification.action)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={notification.actor.profilePicture || "#"} />
            <AvatarFallback>
              {notification.actor.username.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium">
              <span className="hover:underline cursor-pointer">
                {notification.actor.username}
              </span>{" "}
              {notification.action === "like" && "liked your post"}
              {notification.action === "comment" && "commented: on your post"}
              {notification.action === "follow" && "started following you"}
              {notification.action === "message" && "Messaged you"}
            </p>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(notification.createdAt, {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
