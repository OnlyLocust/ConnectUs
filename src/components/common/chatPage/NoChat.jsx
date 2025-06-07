import React from "react";

const NoChat = () => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center p-6">
        <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
        <p className="text-gray-500">
          Choose a chat from the sidebar to start messaging
        </p>
      </div>
    </div>
  );
};

export default NoChat;
