import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import React from "react";

const UsernameInput = ({value,onChange}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="username">Uername</Label>
      <div className="relative">
        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          id="username"
          name="username"
          type="text"
          placeholder="username"
          value={value}
          onChange={onChange}
          className={`pl-10 `}
        />
      </div>
    </div>
  );
};

export default UsernameInput;
