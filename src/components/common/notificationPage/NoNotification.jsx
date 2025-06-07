import { Bell } from "lucide-react";
import React from "react";

const NoNotification = () => {
  return (
    <div className="text-center py-12">
      <Bell className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-lg font-medium">No notifications</h3>
      <p className="mt-1 text-gray-500">
        You'll see notifications here when you get them
      </p>
    </div>
  );
};

export default React.memo(NoNotification);

