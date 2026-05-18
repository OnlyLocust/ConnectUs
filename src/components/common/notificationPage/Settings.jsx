import { Switch } from "@/components/ui/switch";
import React from "react";

const Settings = ({notificationSettings,setNotificationSettings}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">Notification Settings</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-foreground">Likes</h3>
            <p className="text-sm text-muted-foreground">
              When someone likes your post
            </p>
          </div>
          <Switch
            checked={notificationSettings.likes}
            onCheckedChange={(checked) =>
              setNotificationSettings({
                ...notificationSettings,
                likes: checked,
              })
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-foreground">Comments</h3>
            <p className="text-sm text-muted-foreground">
              When someone comments on your post
            </p>
          </div>
          <Switch
            checked={notificationSettings.comments}
            onCheckedChange={(checked) =>
              setNotificationSettings({
                ...notificationSettings,
                comments: checked,
              })
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-foreground">New Followers</h3>
            <p className="text-sm text-muted-foreground">When someone follows you</p>
          </div>
          <Switch
            checked={notificationSettings.follows}
            onCheckedChange={(checked) =>
              setNotificationSettings({
                ...notificationSettings,
                follows: checked,
              })
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-foreground">Messages</h3>
            <p className="text-sm text-muted-foreground">
              When you receive new messages
            </p>
          </div>
          <Switch
            checked={notificationSettings.messages}
            onCheckedChange={(checked) =>
              setNotificationSettings({
                ...notificationSettings,
                messages: checked,
              })
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Settings;
