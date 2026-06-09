import { CardTitle } from "@/components/ui/card";
import React from "react";

const FollowType = ({followType, userId,id ,followLength, username}) => {
  return (
    <CardTitle>
      {followType == "followers" ? (
        <span>
          Followers of {userId == id ? "You" :username} :{" "}
          {followLength} People
        </span>
      ) : (
        <span>
          {userId == id ? "You" : username} Following : {followLength}{" "}
          People
        </span>
      )}
    </CardTitle>
  );
};

export default FollowType;
