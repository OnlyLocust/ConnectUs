import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

const UserInputName = ({value,onChange}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="username">Username</Label>
      <Input
        id="username"
        name="username"
        value={value}
        onChange={onChange}
        placeholder="Enter your username"
      />
    </div>
  );
};

export default UserInputName;
