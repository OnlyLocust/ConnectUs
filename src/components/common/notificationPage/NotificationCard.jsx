import { formatDistanceToNow } from "date-fns";
import React from "react";
import ShowAvatar from "../ShowAvatar";

const NotificationCard = ({notification , getNotificationIcon}) => {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 pt-1">
        {getNotificationIcon(notification.action)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <ShowAvatar profilePicture={notification.actor.profilePicture} username={notification.actor.username} size={8}/>
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
