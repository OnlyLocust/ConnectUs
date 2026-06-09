import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

const ProfileInput = ({onChange}) => {
  return (
    <>
      <Input
        id="profilePicture"
        type="file"
        accept="image/*"
        onChange={onChange}
        className="hidden"
      />

      <Label
        htmlFor="profilePicture"
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90"
      >
        Change Photo
      </Label>
    </>
  );
};

export default ProfileInput;
