import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";
import React from "react";

const PasswordInput = ({value,onChange,errors}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="password">Password</Label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={value}
          onChange={onChange}
          className={`pl-10 ${errors ? "border-red-500" : ""}`}
        />
      </div>
      {errors && (
        <p className="text-sm text-red-500">{errors}</p>
      )}
    </div>
  );
};

export default PasswordInput;
