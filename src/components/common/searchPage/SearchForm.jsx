import { Input } from "@/components/ui/input";
import { SearchIcon, XIcon } from "lucide-react";
import React from "react";

const SearchForm = ({value,onChange, setSearchQuery}) => {
  return (
    <form className="relative">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search users or posts..."
          className="pl-10 pr-10 py-6 rounded-xl text-base"
          value={value}
          onChange={onChange}
        />
        {value && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <XIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchForm;
