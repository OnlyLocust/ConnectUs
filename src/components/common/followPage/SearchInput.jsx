import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React from "react";

const SearchInput = ({value,onChange}) => {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search followers..."
        className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchInput;
