import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import React from "react";

const SubmitButton = ({disabled, isLoading, submitPost}) => {
  return (
    <div className="space-y-3">
      <Button
        className="w-full cursor-pointer"
        disabled={disabled}
        onClick={submitPost}
      >
        {isLoading ? <Loader2Icon className="animate-spin h-5 w-5" /> : "Share"}
      </Button>
    </div>
  );
};

export default SubmitButton;
