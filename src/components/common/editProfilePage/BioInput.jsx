import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

const BioInput = ({value,onChange}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="bio">Bio</Label>
      <Textarea
        id="bio"
        name="bio"
        value={value}
        onChange={onChange}
        placeholder="Tell others about yourself"
        rows={4}
      />
    </div>
  );
};

export default BioInput;
