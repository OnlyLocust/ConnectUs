import React from "react";
import { Bell } from "lucide-react";

const Skeleton = ({ className }) => (
  <div className={`bg-muted animate-pulse rounded ${className}`} />
);

const LoadingNotifications = () => {
  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <Bell className="text-muted-foreground" />
        <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-3 bg-card border border-border rounded-lg shadow-sm"
          >
            <Skeleton className="w-full h-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-2 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingNotifications;
