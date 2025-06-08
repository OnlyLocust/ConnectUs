import { Button } from "@/components/ui/button";
import { ImageIcon, UsersIcon } from "lucide-react";
import React from "react";

const SearchTabs = ({activeTab,setActiveTab}) => {
  return (
    <div className="flex space-x-2 mt-4">
      <Button
        variant={activeTab === "users" ? "default" : "outline"}
        onClick={() => setActiveTab("users")}
        className="rounded-full"
      >
        <UsersIcon className="h-4 w-4 mr-2" /> Users
      </Button>
      <Button
        variant={activeTab === "posts" ? "default" : "outline"}
        onClick={() => setActiveTab("posts")}
        className="rounded-full"
      >
        <ImageIcon className="h-4 w-4 mr-2" /> Posts
      </Button>
    </div>
  );
};

export default SearchTabs;
