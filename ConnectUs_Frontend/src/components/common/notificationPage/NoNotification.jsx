import { Bell } from "lucide-react";
import React from "react";

const NoNotification = () => {
  return (
    <div className="text-center py-12">
      <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-2 text-lg font-medium">No notifications</h3>
      <p className="mt-1 text-muted-foreground">
        You'll see notifications here when you get them
      </p>
    </div>
  );
};

export default React.memo(NoNotification);

