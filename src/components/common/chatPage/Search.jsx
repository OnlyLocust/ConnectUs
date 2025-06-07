import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React from "react";

const SearchBox = ({searchTerm ,setSearchTerm}) => {
  return (
    <div className="p-4 border-b">
      <h2 className="text-xl font-bold">Messages</h2>
      <div className="relative mt-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search conversations"
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchBox;
